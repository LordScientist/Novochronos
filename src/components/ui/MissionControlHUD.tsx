import React from 'react';
import { ChevronUp, ChevronDown, Rocket } from 'lucide-react';

interface MissionControlHUDProps {
  scrollProgress: number;
  scrollVelocity: number;
  onNavigateStep?: (direction: 'prev' | 'next') => void;
  onPlayGame?: () => void;
}

export const MissionControlHUD: React.FC<MissionControlHUDProps> = ({
  scrollProgress,
  onNavigateStep,
  onPlayGame,
}) => {
  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Top Floating Action: Play Game Button */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div />
        {onPlayGame && (
          <button
            onClick={onPlayGame}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(245,158,11,0.6)] cursor-pointer active:scale-95 border border-amber-300"
          >
            <Rocket className="w-3.5 h-3.5 fill-current" />
            <span>PLAY GAME: POWER RUN</span>
          </button>
        )}
      </div>

      {/* Subtle Right Helix Navigation Controls (wrapper is pointer-events-none so it NEVER blocks canvas clicks) */}
      <div className="pointer-events-none flex justify-end items-center my-auto w-full">
        <div className="pointer-events-auto flex flex-col items-center gap-2 backdrop-blur-md bg-black/40 p-2 sm:px-2 sm:py-3 rounded-full border border-white/10 shadow-lg">
          <button
            onClick={() => onNavigateStep?.('prev')}
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Previous (or scroll up)"
            aria-label="Previous"
          >
            <ChevronUp className="w-4 h-4 text-sky-400" />
          </button>

          <div className="w-1 h-16 sm:h-20 bg-slate-800 rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-sky-400 to-indigo-500 rounded-full transition-all duration-150"
              style={{ height: `${Math.max(12, scrollProgress * 100)}%` }}
            />
          </div>

          <button
            onClick={() => onNavigateStep?.('next')}
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Next (or scroll down)"
            aria-label="Next"
          >
            <ChevronDown className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
