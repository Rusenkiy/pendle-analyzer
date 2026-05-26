import { PendleTransaction } from "../api/pendle";
import { StrategyDataPoint } from "../../components/ResultsDashboard";

/**
 * Formats an ISO string to a clean UTC chart timestamp format: YYYY-MM-DD HH:mm
 */
function formatChartDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Calculates hours left from a given timestamp to maturity.
 */
export function calculateHoursToMaturity(timestampStr: string, maturityStr: string): number {
  const tTime = new Date(timestampStr).getTime();
  const mTime = new Date(maturityStr).getTime();
  if (isNaN(tTime) || isNaN(mTime)) return 0;
  
  const diffMs = mTime - tTime;
  return Math.max(0, diffMs / (1000 * 60 * 60)); // Return 0 if post-maturity
}

/**
 * Calculates Yield Token (YT) Price per underlying asset based on Implied APY.
 * Formula: (impliedApy + 1) ^ (hoursToMaturity / 8760) - 1
 */
export function calculateYtPrice(impliedApy: number, hoursToMaturity: number): number {
  if (hoursToMaturity <= 0) return 0;
  return Math.pow(impliedApy + 1, hoursToMaturity / 8760) - 1;
}

/**
 * Calculates Points Earned per underlying asset.
 * Formula: (1 / price) * hoursToMaturity * pointsRate * amount * multiplier
 */
export function calculatePoints(
  ytPrice: number,
  hoursToMaturity: number,
  pointsRate: number,
  amount: number,
  multiplier: number
): number {
  if (ytPrice <= 0 || hoursToMaturity <= 0) return 0;
  return (1 / ytPrice) * hoursToMaturity * pointsRate * amount * multiplier;
}

export interface CalculationResult {
  data: StrategyDataPoint[];
  totalWeightedPoints: number;
}

/**
 * Port of YTCalculation legacy runner:
 * Processes transactions, calculates fair value, and computes total weighted points.
 */
export function runStrategyCalculations(
  transactions: PendleTransaction[],
  maturityDate: string,
  pointsPerHourPerUnderlying: number,
  underlyingAmount: number,
  pendleMultiplier: number
): CalculationResult {
  if (transactions.length === 0) {
    return { data: [], totalWeightedPoints: 0 };
  }

  // 1. Calculate average Implied APY weighted by USD valuation
  let totalValuation = 0;
  let weightedApySum = 0;
  let simpleApySum = 0;
  let validApyCount = 0;

  for (const tx of transactions) {
    if (tx.impliedApy !== undefined && tx.impliedApy !== null) {
      const valuationUsd = tx.valuation?.usd || 0;
      if (valuationUsd > 0) {
        totalValuation += valuationUsd;
        weightedApySum += tx.impliedApy * valuationUsd;
      }
      simpleApySum += tx.impliedApy;
      validApyCount++;
    }
  }

  const averageImpliedApy =
    totalValuation > 0
      ? weightedApySum / totalValuation
      : validApyCount > 0
      ? simpleApySum / validApyCount
      : 0.05; // Fallback to 5% if no APY data exists

  // 2. Process each transaction to build strategy data points
  // We sort transactions from oldest to newest (chronological order)
  const sortedTransactions = [...transactions]
    .filter((tx) => {
      const txTime = new Date(tx.timestamp).getTime();
      const mTime = new Date(maturityDate).getTime();
      // Only include transactions that occurred before maturity
      return !isNaN(txTime) && !isNaN(mTime) && txTime <= mTime;
    })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const dataPoints: (StrategyDataPoint & { valuationUsd: number })[] = [];

  for (const tx of sortedTransactions) {
    const hoursToMaturity = calculateHoursToMaturity(tx.timestamp, maturityDate);
    const impliedApy = tx.impliedApy ?? averageImpliedApy;
    
    // Price from implied APY
    const ytPrice = calculateYtPrice(impliedApy, hoursToMaturity);
    
    // Points earned if purchased at this timestamp
    const pointsEarned = calculatePoints(
      ytPrice,
      hoursToMaturity,
      pointsPerHourPerUnderlying,
      underlyingAmount,
      pendleMultiplier
    );

    // Fair value curve value for this timestamp
    // Formula: 1 - 1 / (1 + averageImpliedApy) ^ (hoursToMaturity / 8760)
    const fairValue = 1 - 1 / Math.pow(1 + averageImpliedApy, hoursToMaturity / 8760);

    dataPoints.push({
      timestamp: formatChartDate(tx.timestamp),
      ytPrice,
      fairValue,
      pointsEarned,
      valuationUsd: tx.valuation?.usd || 0,
    });
  }

  // 3. Calculate weighted points (Sum of points * valuation_usd / Sum of valuation_usd)
  let sumValuation = 0;
  let sumWeightedPoints = 0;

  for (const dp of dataPoints) {
    if (dp.valuationUsd > 0) {
      sumValuation += dp.valuationUsd;
      sumWeightedPoints += dp.pointsEarned * dp.valuationUsd;
    }
  }

  const totalWeightedPoints =
    sumValuation > 0
      ? sumWeightedPoints / sumValuation
      : dataPoints.reduce((acc, dp) => acc + dp.pointsEarned, 0) / (dataPoints.length || 1);

  // Return the data without internal valuation fields
  const finalData: StrategyDataPoint[] = dataPoints.map((dp) => ({
    timestamp: dp.timestamp,
    ytPrice: dp.ytPrice,
    fairValue: dp.fairValue,
    pointsEarned: dp.pointsEarned,
  }));

  return {
    data: finalData,
    totalWeightedPoints,
  };
}
