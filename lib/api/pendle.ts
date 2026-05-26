export const NETWORK_IDS = {
  arbitrum: 42161,
  ethereum: 1,
  mantle: 5000,
  bnb: 56,
  optimism: 10,
  base: 8453,
  avalanche: 43114,
} as const;

export type NetworkName = keyof typeof NETWORK_IDS;

export interface AssetDetails {
  symbol: string;
  expiry: string;
}

interface PendleAsset {
  baseType: string;
  address: string;
  symbol: string;
  expiry: string;
  [key: string]: unknown;
}

export interface MarketApyRecord {
  timestamp: number;
  impliedApy: number;
  underlyingApy: number;
  ptApy: number;
  ytApy: number;
}

export interface OhlcvRecord {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketDataResponse {
  apy: MarketApyRecord[];
  ohlcv: OhlcvRecord[];
}

export interface TransactionAssetInfo {
  address: string;
  symbol?: string;
  decimals?: number;
  baseType: string;
}

export interface TransactionIOItem {
  asset: TransactionAssetInfo;
  amount: string;
  [key: string]: unknown;
}

export interface TransactionValuation {
  usd?: number;
  [key: string]: unknown;
}

export interface PendleTransaction {
  timestamp: string;
  txHash: string;
  action: string;
  impliedApy?: number;
  inputs: TransactionIOItem[];
  outputs: TransactionIOItem[];
  valuation: TransactionValuation;
  market: {
    address: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface RawOhlcvItem {
  time: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

/**
 * Format ISO expiry date to YYYY-MM-DD HH:mm:ss in UTC timezone.
 */
function formatExpiryToUTC(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateStr}`);
  }
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parses raw CSV APY data into typed records.
 */
function parseApyCsv(csvContent: string): MarketApyRecord[] {
  const lines = csvContent.trim().split("\n");
  if (lines.length <= 1) return [];

  const headers = lines[0].split(",");
  const timestampIndex = headers.indexOf("timestamp");
  const impliedApyIndex = headers.indexOf("impliedApy");
  const underlyingApyIndex = headers.indexOf("underlyingApy");
  const ptApyIndex = headers.indexOf("ptApy");
  const ytApyIndex = headers.indexOf("ytApy");

  const records: MarketApyRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",");
    if (values.length < headers.length) continue;

    records.push({
      timestamp: parseInt(values[timestampIndex], 10),
      impliedApy: parseFloat(values[impliedApyIndex]) || 0,
      underlyingApy: parseFloat(values[underlyingApyIndex]) || 0,
      ptApy: parseFloat(values[ptApyIndex]) || 0,
      ytApy: parseFloat(values[ytApyIndex]) || 0,
    });
  }

  return records;
}

/**
 * Fetches asset details (symbol and expiry) from Pendle V2 API.
 * 
 * @param network Blockchain network name ('ethereum', 'arbitrum', 'mantle')
 * @param ytContract Contract address of the Yield Token (YT)
 */
export async function getAssetDetails(
  network: string,
  ytContract: string
): Promise<AssetDetails> {
  const networkKey = network.toLowerCase() as NetworkName;
  const networkId = NETWORK_IDS[networkKey];
  
  if (networkId === undefined) {
    throw new Error("Invalid network: must be 'arbitrum', 'ethereum', or 'mantle'");
  }

  const url = `https://api-v2.pendle.finance/core/v1/${networkId}/assets/all`;
  
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch assets from Pendle API: ${response.statusText} (${response.status})`);
  }

  const data = (await response.json()) as unknown;

  if (!Array.isArray(data)) {
    throw new Error("Invalid response format from Pendle API: expected an array");
  }

  const normalizedYtContract = ytContract.toLowerCase();

  const matchingAsset = (data as PendleAsset[]).find(
    (item) =>
      item.baseType?.toUpperCase() === "YT" &&
      item.address?.toLowerCase() === normalizedYtContract &&
      typeof item.expiry === "string"
  );

  if (!matchingAsset) {
    throw new Error("No valid assets found with the given parameters");
  }

  return {
    symbol: matchingAsset.symbol,
    expiry: formatExpiryToUTC(matchingAsset.expiry),
  };
}

/**
 * Fetches historical APY and OHLCV market data.
 * 
 * @param network Blockchain network name
 * @param marketContract Contract address of the Pendle Market
 * @param ytContract Contract address of the Yield Token (YT)
 * @param startTime ISO 8601 string of starting period
 * @param endTime ISO 8601 string of ending period (defaults to current time)
 */
export async function getMarketData(
  network: string,
  marketContract: string,
  ytContract: string,
  startTime: string,
  endTime?: string
): Promise<MarketDataResponse> {
  const networkKey = network.toLowerCase() as NetworkName;
  const networkId = NETWORK_IDS[networkKey];
  
  if (networkId === undefined) {
    throw new Error("Invalid network: must be 'arbitrum', 'ethereum', or 'mantle'");
  }

  const finalEndTime = endTime || new Date().toISOString();
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  };

  // 1. Fetch APY history (returned as CSV string in .results)
  const apyUrl = `https://api-v2.pendle.finance/core/v1/${networkId}/markets/${marketContract.toLowerCase()}/apy-history-1ma?time_frame=hour&timestamp_start=${encodeURIComponent(startTime)}&timestamp_end=${encodeURIComponent(finalEndTime)}`;
  
  const apyResponse = await fetch(apyUrl, { method: "GET", headers, next: { revalidate: 3600 } });
  if (!apyResponse.ok) {
    throw new Error(`Failed to fetch APY history from Pendle API: ${apyResponse.statusText} (${apyResponse.status})`);
  }
  const apyJson = (await apyResponse.json()) as { results?: string };
  const apy = parseApyCsv(apyJson.results || "");

  // 2. Fetch OHLCV price history (returned as JSON array in .results)
  const ohlcvUrl = `https://api-v2.pendle.finance/core/v3/${networkId}/prices/${ytContract.toLowerCase()}/ohlcv?time_frame=hour&timestamp_start=${encodeURIComponent(startTime)}&timestamp_end=${encodeURIComponent(finalEndTime)}`;

  const ohlcvResponse = await fetch(ohlcvUrl, { method: "GET", headers, next: { revalidate: 3600 } });
  if (!ohlcvResponse.ok) {
    throw new Error(`Failed to fetch OHLCV history from Pendle API: ${ohlcvResponse.statusText} (${ohlcvResponse.status})`);
  }
  const ohlcvJson = (await ohlcvResponse.json()) as { results?: unknown[] };
  const rawOhlcv = ohlcvJson.results || [];

  const ohlcv: OhlcvRecord[] = (rawOhlcv as RawOhlcvItem[]).map((item) => ({
    time: item.time,
    open: parseFloat(item.open) || 0,
    high: parseFloat(item.high) || 0,
    low: parseFloat(item.low) || 0,
    close: parseFloat(item.close) || 0,
    volume: parseFloat(item.volume || "0") || 0,
  }));

  return { apy, ohlcv };
}

/**
 * Fetches transaction events for a given market contract (paginated).
 * If rate limits or API errors are encountered, it falls back to returning the gathered results.
 * 
 * @param network Blockchain network name
 * @param marketContract Contract address of the Pendle Market
 * @param limit Page size limit (default 1000)
 * @param maxTransactions Maximum transaction records to retrieve (default 3000)
 */
export async function getTransactions(
  network: string,
  marketContract: string,
  limit = 1000,
  maxTransactions = 3000
): Promise<PendleTransaction[]> {
  const networkKey = network.toLowerCase() as NetworkName;
  const networkId = NETWORK_IDS[networkKey];
  
  if (networkId === undefined) {
    throw new Error("Invalid network: must be 'arbitrum', 'ethereum', or 'mantle'");
  }

  const allTransactions: PendleTransaction[] = [];
  let skip = 0;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
  };
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  while (allTransactions.length < maxTransactions) {
    const url = `https://api-v2.pendle.finance/core/v3/${networkId}/transactions?market=${marketContract.toLowerCase()}&action=SWAP_PT,SWAP_PY,SWAP_YT&origin=PENDLE_MARKET,YT&skip=${skip}&limit=${limit}&minValue=0`;

    let response: Response | undefined;
    let attempts = 0;
    const maxAttempts = 3;
    let shouldBreak = false;

    while (attempts < maxAttempts) {
      try {
        response = await fetch(url, { method: "GET", headers });
        if (response.ok) {
          break;
        }

        // If the server returns 400, we've likely hit the maximum page skip/offset limit.
        if (response.status === 400) {
          console.warn(`[getTransactions] Hit offset boundary (400 Bad Request) at skip=${skip}. Ending fetch loop.`);
          shouldBreak = true;
          break;
        }

        // If the server returns 429, retry with exponential backoff
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn(`[getTransactions] Rate limit or fetch error (${response.status}) after ${maxAttempts} attempts. Returning accumulated transactions.`);
          shouldBreak = true;
          break;
        }

        const delay = 1500 * Math.pow(2, attempts) + Math.random() * 1500;
        await sleep(delay);
      } catch {
        attempts++;
        if (attempts >= maxAttempts) {
          console.warn("[getTransactions] Connection error during transaction fetch. Returning accumulated transactions.");
          shouldBreak = true;
          break;
        }
        await sleep(1500 * Math.pow(2, attempts) + Math.random() * 1500);
      }
    }

    if (shouldBreak || !response || !response.ok) {
      break;
    }

    const data = (await response.json()) as { results?: PendleTransaction[] };
    const transactions = data.results || [];

    if (transactions.length === 0) {
      break;
    }

    allTransactions.push(...transactions);
    skip += limit;

    // Small delay to behave nicely with the API rate limits
    await sleep(200 + Math.random() * 300);
  }

  // Cap at maxTransactions in case we got a bit more in the final page
  return allTransactions.slice(0, maxTransactions);
}
