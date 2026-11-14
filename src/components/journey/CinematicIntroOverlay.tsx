import React from 'react';
import { SkipForward } from 'lucide-react';
import { IntroScene } from '../../types/journey';

interface CinematicIntroOverlayProps {
  scene: IntroScene;
  activeSentinelIndex?: number;
  progress?: number;
  isPlaying?: boolean;
  isMuted?: boolean;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onSkip: () => void;
  onReplay?: () => void;
  onSelectScene?: (scene: IntroScene) => void;
  onEnterArchive: () => void;
}

/**
 * CinematicIntroOverlay
 * Clean visual overlay without obstructive top bar, headings, or floating cards.
 * Leaves 100% of the viewport dedicated to the 3D scene, lighting, and models.
 */
export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  scene,
  onSkip,
  onEnterArchive,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20">
      {/* Discreet, non-obstructive Skip control pinned to bottom-right corner */}
      <div className="absolute bottom-6 right-6 pointer-events-auto">
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 hover:bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800/60 font-mono text-[11px] tracking-wider backdrop-blur-sm transition-all duration-200 shadow-lg group"
          title="Skip Intro to Command Terminal"
        >
          <span>SKIP INTRO</span>
          <SkipForward className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Clean Call-to-Action only in final scene */}
      {scene === 'title-reveal' && (
        <div className="absolute bottom-10 inset-x-0 flex justify-center pointer-events-auto animate-fade-in">
          <button
            onClick={onEnterArchive}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_45px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95"
          >
            ENTER THE ARCHIVE
          </button>
        </div>
      )}
    </div>
  );
};
