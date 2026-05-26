"use client";

import { useState } from "react";
import InputForm, { StrategyInputs } from "@/components/InputForm";
import ResultsDashboard, { StrategyDataPoint } from "@/components/ResultsDashboard";

// Sample mockup data representing stETH YT decay and points accumulation
const MOCK_STRATEGY_DATA: StrategyDataPoint[] = [
  { timestamp: "2024-12-20 00:00", ytPrice: 0.0582, fairValue: 0.0551, pointsEarned: 1250 },
  { timestamp: "2024-12-21 00:00", ytPrice: 0.0515, fairValue: 0.0518, pointsEarned: 3800 },
  { timestamp: "2024-12-22 00:00", ytPrice: 0.0448, fairValue: 0.0482, pointsEarned: 6900 },
  { timestamp: "2024-12-23 00:00", ytPrice: 0.0412, fairValue: 0.0449, pointsEarned: 9950 },
  { timestamp: "2024-12-24 00:00", ytPrice: 0.0385, fairValue: 0.0415, pointsEarned: 12800 },
  { timestamp: "2024-12-25 00:00", ytPrice: 0.0292, fairValue: 0.0382, pointsEarned: 15420 },
];

export default function Home() {
  const [strategyInputs, setStrategyInputs] = useState<StrategyInputs>({
    network: "ethereum",
    marketContract: "0x36d3ca43ae7939645c306e26603ce16e39a89192",
    ytContract: "0xeb993b610b68f2631f70ca1cf4fe651db81f368e",
    startTime: "2023-01-01T00:00",
    underlyingAmount: 1.0,
    pointsPerHourPerUnderlying: 0.04,
    pendleMultiplier: 5,
  });

  const handleStrategySubmit = (inputs: StrategyInputs) => {
    console.log("Dashboard received inputs:", inputs);
    setStrategyInputs(inputs);
  };

  return (
    <main className="min-h-screen cyber-grid flex flex-col justify-between p-6 md:p-12 selection:bg-brand-green selection:text-black text-slate-200">
      {/* HUD Header */}
      <header className="border-b-2 border-brand-green pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 bg-brand-green animate-pulse inline-block"></span>
            <span className="text-xs font-mono tracking-widest text-brand-green uppercase">
              System Active // v0.1.0-alpha
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-mono tracking-tight uppercase">
            Pendle YT Timing Strategy Analyzer
          </h1>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <p>LOC_UTC: {new Date().toISOString().substring(0, 10)}</p>
          <p>NET_CONN: {strategyInputs.network.toUpperCase()}_MAINNET</p>
        </div>
      </header>

      {/* Two-Column Interactive Dashboard Layout */}
      <div className="my-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Strategy Config Form */}
        <div className="lg:col-span-1 space-y-6">
          <InputForm onSubmit={handleStrategySubmit} />
          
          {/* Diagnostic Console Log Card */}
          <div className="border-2 border-dark-border bg-dark-card p-4 font-mono text-xs text-slate-400 space-y-2">
            <span className="text-brand-green font-bold block mb-1">{"[DIAGNOSTIC_TELEMETRY]"}</span>
            <p>• NET: {strategyInputs.network}</p>
            <p className="truncate">• MKT: {strategyInputs.marketContract}</p>
            <p className="truncate">• YT: {strategyInputs.ytContract}</p>
            <p>• START: {strategyInputs.startTime}</p>
            <p>• COLLATERAL: {strategyInputs.underlyingAmount} ETH</p>
          </div>
        </div>

        {/* Right Column: Charting Results Dashboard */}
        <div className="lg:col-span-2">
          <ResultsDashboard
            data={MOCK_STRATEGY_DATA}
            totalWeightedPoints={15420.00}
            symbol="YT-stETH-26DEC2024"
            network={strategyInputs.network}
            underlyingAmount={strategyInputs.underlyingAmount}
          />
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
          <span className="text-slate-600">SECURE_SHELL: ACTIVE</span>
        </div>
      </footer>
    </main>
  );
}
