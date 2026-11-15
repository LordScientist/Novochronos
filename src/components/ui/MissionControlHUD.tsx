import React from 'react';
import { ChevronUp, ChevronDown, RotateCcw } from 'lucide-react';

interface MissionControlHUDProps {
  scrollProgress: number;
  scrollVelocity: number;
  onNavigateStep?: (direction: 'prev' | 'next') => void;
  onReturnToIntro?: () => void;
  onPlayGame?: () => void;
}

export const MissionControlHUD: React.FC<MissionControlHUDProps> = ({
  scrollProgress,
  onNavigateStep,
  onReturnToIntro,
  onPlayGame,
}) => {
  const handleAction = onReturnToIntro || onPlayGame;

  return (
    <div className="pointer-events-none fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 select-none font-mono">
      {/* Top Floating Action: Return to Intro Button (Desktop only; on mobile the global nav handles intro) */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div />
        {handleAction && (
          <button
            onClick={handleAction}
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full obsidian-card hover:bg-stellarBlue/25 text-lunarWhite font-mono font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(26,47,251,0.35)] cursor-pointer active:scale-95 border border-titanium/20"
            title="Return to Stage 0 Cinematic Introduction"
          >
            <RotateCcw className="w-3.5 h-3.5 text-nebulaCyan" />
            <span>RETURN TO INTRO</span>
          </button>
        )}
      </div>

      {/* Subtle Right Helix Navigation Controls */}
      <div className="pointer-events-none flex justify-end items-center my-auto w-full">
        <div className="pointer-events-auto flex flex-col items-center gap-2 backdrop-blur-xl bg-obsidian/85 p-2 sm:px-2.5 sm:py-3.5 rounded-full border border-titanium/15 shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => onNavigateStep?.('prev')}
            className="p-1 sm:p-1.5 rounded-full hover:bg-cosmicNavy text-dustGrey hover:text-lunarWhite transition-colors cursor-pointer"
            title="Previous (or scroll up)"
            aria-label="Previous"
          >
            <ChevronUp className="w-4 h-4 text-nebulaCyan" />
          </button>

          <div className="w-1 h-16 sm:h-20 bg-cosmicNavy rounded-full overflow-hidden relative">
            <div
              className="w-full bg-gradient-to-b from-nebulaCyan via-stellarBlue to-indigo-600 rounded-full transition-all duration-150"
              style={{ height: `${Math.max(12, scrollProgress * 100)}%` }}
            />
          </div>

          <button
            onClick={() => onNavigateStep?.('next')}
            className="p-1 sm:p-1.5 rounded-full hover:bg-cosmicNavy text-dustGrey hover:text-lunarWhite transition-colors cursor-pointer"
            title="Next (or scroll down)"
            aria-label="Next"
          >
            <ChevronDown className="w-4 h-4 text-nebulaCyan" />
          </button>
        </div>
      </div>
    </div>
  );
};
