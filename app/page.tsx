export default function Home() {
  return (
    <main className="min-h-screen cyber-grid flex flex-col justify-between p-6 md:p-12 selection:bg-brand-green selection:text-black">
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

      {/* Main Grid Content */}
      <div className="my-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Module 1: Strategy Backtester */}
        <div className="border-2 border-dark-border hover:border-brand-green bg-dark-card p-6 transition-all duration-300 group">
          <span className="font-mono text-xs text-brand-green font-bold block mb-4">
            [MODULE_01 // BACKTESTER]
          </span>
          <h2 className="text-xl font-bold font-mono uppercase mb-3 text-slate-200">
            Strategy Backtesting
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Analyze historical Yield Token (YT) purchasing performance. Simulate timing strategies based on discount rate deviation and implied yield trends.
          </p>
          <div className="font-mono text-xs text-slate-500 group-hover:text-brand-green transition-colors">
            STATUS: STANDBY // STAGE_1_READY
          </div>
        </div>

        {/* Module 2: Market Analytics */}
        <div className="border-2 border-dark-border hover:border-brand-green bg-dark-card p-6 transition-all duration-300 group">
          <span className="font-mono text-xs text-brand-green font-bold block mb-4">
            [MODULE_02 // ANALYTICS]
          </span>
          <h2 className="text-xl font-bold font-mono uppercase mb-3 text-slate-200">
            Implied Yield Analysis
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Compare real-time Pendle Implied Yield against realized underlying token yield. Uncover pricing inefficiencies and entry-point advantages.
          </p>
          <div className="font-mono text-xs text-slate-500 group-hover:text-brand-green transition-colors">
            STATUS: STANDBY // DATA_FEED_PENDING
          </div>
        </div>

        {/* Module 3: Strategy Engine */}
        <div className="border-2 border-dark-border hover:border-brand-green bg-dark-card p-6 transition-all duration-300 group">
          <span className="font-mono text-xs text-brand-green font-bold block mb-4">
            [MODULE_03 // OPTIMIZER]
          </span>
          <h2 className="text-xl font-bold font-mono uppercase mb-3 text-slate-200">
            YT Purchase Timing
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Optimize acquisition of YT. Programmatically model time-decay against yield fluctuations to calculate mathematically optimal entry periods.
          </p>
          <div className="font-mono text-xs text-slate-500 group-hover:text-brand-green transition-colors">
            STATUS: STANDBY // MODEL_LOADED
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
