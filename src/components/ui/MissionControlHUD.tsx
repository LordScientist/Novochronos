import React from 'react';
import { Volume2, Compass, Radio, Disc3, ShieldAlert } from 'lucide-react';

interface MissionControlHUDProps {
  scrollProgress: number;
  scrollVelocity: number;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  selectedSentinelId: string | null;
  onResetSelection: () => void;
}

export const MissionControlHUD: React.FC<MissionControlHUDProps> = ({
  scrollProgress,
  scrollVelocity,
  activeFilter,
  onFilterChange,
  selectedSentinelId,
  onResetSelection,
}) => {
  const currentSentinelIndex = Math.min(8, Math.max(1, Math.floor(scrollProgress * 8) + 1));
  const velocityMagnitude = Math.abs(Math.round(scrollVelocity * 10));

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 select-none">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between border-b border-white/10 pb-4 backdrop-blur-sm bg-black/20 px-4 rounded-xl">
        <div className="flex items-center gap-4 pointer-events-auto">
          {/* NASA Meatball Logo */}
          <img
            src="/nasa-logo.svg"
            alt="NASA Insignia"
            className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400">
                NOVOCHRONOS // NASA SPACE APPS 2026
              </span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h1 className="text-sm font-mono tracking-wider text-slate-200">
              ABANDONED BUT NOT FORGOTTEN: SENTINEL REGISTRY
            </h1>
          </div>
        </div>

        {/* Telemetry Stats (Active Theory Monospace Style) */}
        <div className="hidden md:flex items-center gap-6 font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>FLIGHT CORRIDOR: <strong className="text-white">SHUTTLE-01</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>VELOCITY: <strong className="text-white">{velocityMagnitude} KM/S</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Disc3 className="w-3.5 h-3.5 text-amber-400" />
            <span>SENTINEL: <strong className="text-white">0{currentSentinelIndex} / 08</strong></span>
          </div>
        </div>
      </header>

      {/* Middle Section: Left Filter Bar (Active Theory "WHAT ARE YOU LOOKING FOR?" metaphor) */}
      <div className="flex justify-between items-center my-auto">
        <aside className="pointer-events-auto flex flex-col gap-2 font-mono text-xs backdrop-blur-md bg-black/40 p-4 rounded-xl border border-white/10 max-w-[200px]">
          <div className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mb-1">
            TARGET REGION
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
              className={`text-left px-2.5 py-1.5 rounded transition-all duration-200 flex items-center justify-between ${
                activeFilter === item.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50 font-bold'
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
              className="mt-3 text-[11px] text-amber-400 border border-amber-400/30 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-1.5 rounded flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3 h-3" />
              <span>RETURN TO CORRIDOR</span>
            </button>
          )}
        </aside>

        {/* Right Scroll Progression Bar (Active Theory Right Rail) */}
        <div className="pointer-events-auto hidden sm:flex flex-col items-center gap-3 backdrop-blur-md bg-black/40 px-3 py-6 rounded-full border border-white/10">
          <span className="text-[10px] font-mono text-sky-400 rotate-90 tracking-widest uppercase">
            ORBIT
          </span>
          <div className="w-1.5 h-36 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full transition-all duration-150"
              style={{ height: `${Math.max(8, scrollProgress * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>

      {/* Bottom Command Strip */}
      <footer className="flex items-center justify-between border-t border-white/10 pt-4 backdrop-blur-sm bg-black/20 px-4 rounded-xl">
        <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
          <span className="px-2 py-1 rounded bg-white/10 text-slate-200 text-[10px]">LENIS MOMENTUM</span>
          <span className="hidden sm:inline">SCROLL TO ADVANCE FLIGHT CORRIDOR • HOVER CARDS TO TILT • CLICK TO DOCK</span>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs text-sky-400">
          <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
          <span className="hidden sm:inline">VOICEOVER READY</span>
        </div>
      </footer>
    </div>
  );
};
