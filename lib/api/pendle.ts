export const NETWORK_IDS = {
  arbitrum: 42161,
  ethereum: 1,
  mantle: 5000,
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
    // Next.js caching control: fetch fresh data (or we can use revalidate config if needed)
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
