import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface MissionControlHUDProps {
  scrollProgress: number;
  scrollVelocity: number;
  onNavigateStep?: (direction: 'prev' | 'next') => void;
}

export const MissionControlHUD: React.FC<MissionControlHUDProps> = ({
  scrollProgress,
  onNavigateStep,
}) => {
  const currentSentinelIndex = Math.min(8, Math.max(1, Math.floor(scrollProgress * 8) + 1));

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-6 select-none">
      {/* Minimal Top Brand Bar */}
      <header className="flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 backdrop-blur-md bg-black/30 px-3.5 py-2 rounded-xl border border-white/10">
          <img
            src="/nasa-logo.svg"
            alt="NASA Insignia"
            className="w-7 h-7 object-contain drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
          />
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold tracking-widest text-white">
              NOVOCHRONOS
            </span>
            <span className="text-[10px] font-mono text-sky-400">
              // 0{currentSentinelIndex}
            </span>
          </div>
        </div>

        {/* Minimal Scroll Progression Indicator */}
        <div className="hidden sm:flex items-center gap-2 backdrop-blur-md bg-black/30 px-3 py-1.5 rounded-xl border border-white/10 font-mono text-xs text-slate-400">
          <span className="text-sky-400">●</span>
          <span>STS CORRIDOR</span>
        </div>
      </header>

      {/* Subtle Right Helix Navigation Controls */}
      <div className="flex justify-end items-center my-auto pointer-events-auto">
        <div className="flex flex-col items-center gap-2.5 backdrop-blur-md bg-black/30 px-2 py-3 rounded-full border border-white/10">
          <button
            onClick={() => onNavigateStep?.('prev')}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Previous (or scroll up)"
            aria-label="Previous"
          >
            <ChevronUp className="w-4 h-4 text-sky-400" />
          </button>

          <div className="w-1 h-20 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full transition-all duration-150"
              style={{ height: `${Math.max(12, scrollProgress * 100)}%` }}
            />
          </div>

          <button
            onClick={() => onNavigateStep?.('next')}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Next (or scroll down)"
            aria-label="Next"
          >
            <ChevronDown className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Empty bottom spacer to keep viewport clean */}
      <div className="h-6" />
    </div>
  );
};
