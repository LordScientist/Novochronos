import React from 'react';
import { Volume2, Compass, Radio, Disc3, ShieldAlert, ChevronUp, ChevronDown, Info } from 'lucide-react';

interface MissionControlHUDProps {
  scrollProgress: number;
  scrollVelocity: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  selectedSentinelId: string | null;
  onResetSelection: () => void;
  onNavigateStep?: (direction: 'prev' | 'next') => void;
}

export const MissionControlHUD: React.FC<MissionControlHUDProps> = ({
  scrollProgress,
  scrollVelocity,
  activeFilter,
  onFilterChange,
  selectedSentinelId,
  onResetSelection,
  onNavigateStep,
}) => {
  const currentSentinelIndex = Math.min(8, Math.max(1, Math.floor(scrollProgress * 8) + 1));
  const velocityMagnitude = Math.abs(Math.round(scrollVelocity * 10));

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between border border-white/10 pb-3 pt-3 backdrop-blur-md bg-black/40 px-5 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* NASA Meatball Logo */}
          <img
            src="/nasa-logo.svg"
            alt="NASA Insignia"
            className="w-10 h-10 object-contain drop-shadow-[0_0_14px_rgba(56,189,248,0.6)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400">
                NOVOCHRONOS // NASA SPACE APPS 2026
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-xs sm:text-sm font-mono tracking-wider text-slate-200">
              ABANDONED BUT NOT FORGOTTEN: SENTINEL REGISTRY
            </h1>
          </div>
        </div>

        {/* Telemetry Stats */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>ORBIT: <strong className="text-white">STS LAUNCH STACK</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>VELOCITY: <strong className="text-white">{velocityMagnitude} KM/S</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Disc3 className="w-3.5 h-3.5 text-amber-400" />
            <span>SENTINEL IN FOCUS: <strong className="text-white">0{currentSentinelIndex} / 08</strong></span>
          </div>
        </div>
      </header>

      {/* Middle Section: Left Filter Bar + Right Navigation Controls */}
      <div className="flex justify-between items-center my-auto">
        {/* Left Filter Bar */}
        <aside className="pointer-events-auto flex flex-col gap-2 font-mono text-xs backdrop-blur-md bg-black/50 p-4 rounded-2xl border border-white/10 max-w-[210px] shadow-lg">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1 flex items-center gap-1.5">
            <Info className="w-3 h-3 text-sky-400" />
            <span>TARGET REGION</span>
          </div>
          {[
            { id: 'all', label: 'ALL SENTINELS (8)' },
            { id: 'mars', label: 'MARS SURFACE (4)' },
            { id: 'moon', label: 'LUNAR REGOLITH (3)' },
            { id: 'deep-space', label: 'DEEP SPACE (1)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between text-[11px] ${
                activeFilter === item.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 font-bold shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{item.label}</span>
              {activeFilter === item.id && <span className="text-sky-400 text-xs">●</span>}
            </button>
          ))}

          {selectedSentinelId && (
            <button
              onClick={onResetSelection}
              className="mt-3 text-[11px] text-amber-300 border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors font-bold"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>RETURN TO CORRIDOR</span>
            </button>
          )}
        </aside>

        {/* Right Navigation & Progress Controls (Beginner Friendly Step Arrows + Orbit Bar) */}
        <div className="pointer-events-auto flex flex-col items-center gap-3 backdrop-blur-md bg-black/50 px-3 py-5 rounded-2xl border border-white/10 shadow-lg">
          {/* Previous Sentinel Button */}
          <button
            onClick={() => onNavigateStep?.('prev')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Previous Sentinel (or scroll up)"
            aria-label="Previous Sentinel"
          >
            <ChevronUp className="w-4 h-4 text-sky-400" />
          </button>

          <span className="text-[10px] font-mono text-sky-400 rotate-90 tracking-widest uppercase my-1">
            HELIX
          </span>

          <div className="w-1.5 h-28 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-sky-400 via-indigo-400 to-amber-400 rounded-full transition-all duration-150"
              style={{ height: `${Math.max(10, scrollProgress * 100)}%` }}
            />
          </div>

          <span className="text-[10px] font-mono text-slate-300">
            {Math.round(scrollProgress * 100)}%
          </span>

          {/* Next Sentinel Button */}
          <button
            onClick={() => onNavigateStep?.('next')}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
            title="Next Sentinel (or scroll down)"
            aria-label="Next Sentinel"
          >
            <ChevronDown className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Bottom Educational Guidance Banner */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/10 p-3 backdrop-blur-md bg-black/40 px-5 rounded-2xl shadow-lg">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-300">
          <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[10px] font-bold">
            BEGINNER GUIDE
          </span>
          <span className="text-slate-300 text-[11px] sm:text-xs">
            Scroll or use arrows to spiral around the Space Shuttle • Hover cards to inspect • Click to hear first-person voiceover.
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-sky-400">
          <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="text-[11px]">8 HISTORIC MONOLOGUES READY</span>
        </div>
      </footer>
    </div>
  );
};
