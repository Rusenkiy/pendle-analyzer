"use client";

import { useState } from "react";
import InputForm, { StrategyInputs } from "@/components/InputForm";
import ResultsDashboard, { StrategyDataPoint } from "@/components/ResultsDashboard";
import { getAssetDetails, getMarketData, getTransactions } from "@/lib/api/pendle";
import { runStrategyCalculations } from "@/lib/math/ytCalculations";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageDropdown from "@/components/LanguageDropdown";

// Sample mockup data representing stETH YT decay and points accumulation (Preview Mode)
const MOCK_STRATEGY_DATA: StrategyDataPoint[] = [
  { timestamp: "2024-12-20 00:00", ytPrice: 0.0582, fairValue: 0.0551, pointsEarned: 1250 },
  { timestamp: "2024-12-21 00:00", ytPrice: 0.0515, fairValue: 0.0518, pointsEarned: 3800 },
  { timestamp: "2024-12-22 00:00", ytPrice: 0.0448, fairValue: 0.0482, pointsEarned: 6900 },
  { timestamp: "2024-12-23 00:00", ytPrice: 0.0412, fairValue: 0.0449, pointsEarned: 9950 },
  { timestamp: "2024-12-24 00:00", ytPrice: 0.0385, fairValue: 0.0415, pointsEarned: 12800 },
  { timestamp: "2024-12-25 00:00", ytPrice: 0.0292, fairValue: 0.0382, pointsEarned: 15420 },
];

interface SimulationResults {
  data: StrategyDataPoint[];
  totalWeightedPoints: number;
  symbol: string;
  network: string;
  underlyingAmount: number;
}

export default function Home() {
  const { t } = useLanguage();

  const [strategyInputs, setStrategyInputs] = useState<StrategyInputs>({
    network: "ethereum",
    marketContract: "0x36d3ca43ae7939645c306e26603ce16e39a89192",
    ytContract: "0xeb993b610b68f2631f70ca1cf4fe651db81f368e",
    startTime: "2023-01-01T00:00",
    underlyingAmount: 1.0,
    pointsPerHourPerUnderlying: 0.04,
    pendleMultiplier: 5,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SimulationResults | null>(null);

  const handleStrategySubmit = async (inputs: StrategyInputs) => {
    setIsLoading(true);
    setError(null);
    setStrategyInputs(inputs);

    try {
      // 1. Retrieve asset details (symbol and maturity date)
      console.log(`[Orchestrator] Retrieving asset details for ${inputs.ytContract}...`);
      const assetDetails = await getAssetDetails(inputs.network, inputs.ytContract);
      
      // Convert datetime-local picker string to full ISO date format
      const startIso = new Date(inputs.startTime).toISOString();

      // 2. Fetch market APY/OHLCV and transaction history concurrently
      console.log(`[Orchestrator] Fetching market data & transaction logs...`);
      const fetches = await Promise.all([
        getMarketData(inputs.network, inputs.marketContract, inputs.ytContract, startIso),
        getTransactions(inputs.network, inputs.marketContract, 1000, 3000),
      ]);
      const transactions = fetches[1];

      if (transactions.length === 0) {
        throw new Error("No transactions were found on-chain for the specified market contract.");
      }

      // 3. Perform strategy math calculations
      console.log(`[Orchestrator] Executing mathematical modeling...`);
      const calculationResult = runStrategyCalculations(
        transactions,
        assetDetails.expiry,
        inputs.pointsPerHourPerUnderlying,
        inputs.underlyingAmount,
        inputs.pendleMultiplier
      );

      setResults({
        data: calculationResult.data,
        totalWeightedPoints: calculationResult.totalWeightedPoints,
        symbol: assetDetails.symbol,
        network: inputs.network,
        underlyingAmount: inputs.underlyingAmount,
      });

    } catch (err) {
      console.error("[Orchestrator Error]:", err);
      setError(err instanceof Error ? err.message : "An unexpected execution fault occurred.");
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen cyber-grid flex flex-col justify-between p-6 md:p-12 selection:bg-brand-green selection:text-black text-slate-200">
      {/* HUD Header */}
      <header className="border-b-2 border-brand-green pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-brand-green animate-pulse inline-block"></span>
            <span className="text-xs font-mono tracking-widest text-brand-green uppercase">
              {t("common.status")}
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-mono tracking-tight uppercase">
            {t("common.title")}
          </h1>
        </div>
        
        {/* Language Switcher & Network Info */}
        <div className="flex flex-col items-start md:items-end gap-4 shrink-0 font-mono text-xs">
          <LanguageDropdown />

          <div className="text-left md:text-right text-slate-400 space-y-0.5">
            <p>{t("common.utc_time")}: {new Date().toISOString().substring(0, 10)}</p>
            <p>{t("common.net_conn", { network: strategyInputs.network.toUpperCase() })}</p>
          </div>
        </div>
      </header>

      {/* Two-Column Interactive Dashboard Layout */}
      <div className="my-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Strategy Config Form */}
        <div className="lg:col-span-1 space-y-6">
          <InputForm onSubmit={handleStrategySubmit} />
          
          {/* Diagnostic Console Log Card */}
          <div className="border-2 border-dark-border bg-dark-card p-4 font-mono text-xs text-slate-400 space-y-2">
            <span className="text-brand-green font-bold block mb-1">{t("common.diagnostic")}</span>
            <p>• NET: {strategyInputs.network.toUpperCase()}</p>
            <p className="truncate">• MKT: {strategyInputs.marketContract}</p>
            <p className="truncate">• YT: {strategyInputs.ytContract}</p>
            <p>• START: {strategyInputs.startTime}</p>
            <p>• COLLATERAL: {strategyInputs.underlyingAmount} ETH</p>
          </div>
        </div>

        {/* Right Column: Charting Results Dashboard / Loading / Error Panels */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading && (
            <div className="border-2 border-brand-green bg-black p-8 font-mono text-center text-brand-green animate-pulse rounded-none">
              <p className="text-sm font-bold tracking-widest mb-2">
                &gt; {t("common.loading")}
              </p>
              <p className="text-xs text-slate-400">
                {t("common.loading_sub")}
              </p>
            </div>
          )}

          {error && (
            <div className="border-2 border-red-500 bg-red-950/10 p-6 font-mono text-slate-200 rounded-none">
              <div className="flex items-center gap-2 mb-2 text-red-500 font-bold">
                <span>●</span>
                <span className="text-xs uppercase tracking-widest">{t("common.error_title")}</span>
              </div>
              <p className="text-sm border-l-2 border-red-500 pl-3 py-1 text-slate-300 font-mono">
                {error}
              </p>
              <button
                onClick={() => setError(null)}
                className="mt-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black font-bold uppercase text-[10px] tracking-wider rounded-none cursor-pointer transition-colors"
              >
                {t("common.dismiss")}
              </button>
            </div>
          )}

          {!isLoading && !error && !results && (
            <div className="space-y-4">
              <div className="border border-brand-green bg-brand-green-dim/10 text-brand-green p-3 text-xs font-mono rounded-none">
                &gt;&gt; {t("common.preview_mode")}
              </div>
              <ResultsDashboard
                data={MOCK_STRATEGY_DATA}
                totalWeightedPoints={15420.00}
                symbol="YT-stETH-26DEC2024"
                network={strategyInputs.network}
                underlyingAmount={strategyInputs.underlyingAmount}
              />
            </div>
          )}

          {!isLoading && !error && results && (
            <ResultsDashboard
              data={results.data}
              totalWeightedPoints={results.totalWeightedPoints}
              symbol={results.symbol}
              network={results.network}
              underlyingAmount={results.underlyingAmount}
            />
          )}
        </div>
      </div>

      {/* Futuristic Brutalist Terminal Footer */}
      <footer className="border-t border-dark-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500">
        <div>
          <p>&gt;_ PENDLE_YT_STRATEGY_ANALYZER.EXE</p>
        </div>
        <div className="flex gap-6">
          <span className="hover:text-brand-green cursor-pointer transition-colors">
            [DOCS.md]
          </span>
          <span className="hover:text-brand-green cursor-pointer transition-colors">
            [PROTOCOL_SPEC]
          </span>
          <span className="text-slate-600">{t("common.sec_shell")}</span>
        </div>
      </footer>
    </main>
  );
}
