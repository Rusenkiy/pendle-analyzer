"use client";

import InputForm, { StrategyInputs } from "@/components/InputForm";

export default function Home() {
  const handleStrategySubmit = (inputs: StrategyInputs) => {
    console.log("Dashboard received inputs:", inputs);
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
          <p>NET_CONN: ETHEREUM_MAINNET</p>
        </div>
      </header>

      {/* Two-Column Interactive Dashboard Layout */}
      <div className="my-12 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Strategy Config Form */}
        <div className="lg:col-span-1">
          <InputForm onSubmit={handleStrategySubmit} />
        </div>

        {/* Right Column: Interactive Output Console */}
        <div className="lg:col-span-2 border-2 border-dark-border bg-dark-card p-6 h-full min-h-[500px] flex flex-col justify-between font-mono">
          <div>
            <div className="flex items-center justify-between border-b border-dark-border pb-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 bg-brand-green"></span>
                <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                  Telemetry Console
                </span>
              </div>
              <span className="text-[10px] text-brand-green font-bold">
                [OUTPUT_STREAM: STANDBY]
              </span>
            </div>
            
            <div className="text-sm space-y-4 text-slate-400">
              <p className="text-slate-300">
                &gt; SYSTEM INIT OK. Awaiting parameters execution...
              </p>
              <p>
                &gt; Load a valid Yield Token (YT) contract and Market Contract from Pendle protocol to simulate entry points.
              </p>
              <div className="p-4 bg-black border border-dark-border space-y-2 text-xs">
                <span className="text-brand-green block mb-1 font-bold">{"// LEGACY TEST CONFIG MATCHES:"}</span>
                <p>• Network: Ethereum Mainnet</p>
                <p>• Market: 0x36d3ca43ae7939645c306e26603ce16e39a89192 (stETH Market)</p>
                <p>• YT Contract: 0xeb993b610b68f2631f70ca1cf4fe651db81f368e</p>
                <p>• Start Time: 2023-01-01 00:00:00 UTC</p>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-dark-border pt-4 text-[11px] text-slate-500">
            <span className="text-brand-green animate-pulse mr-2">●</span>
            READY FOR STRATEGY SIMULATION EXECUTION
          </div>
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
