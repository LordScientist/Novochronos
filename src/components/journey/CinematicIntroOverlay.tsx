import React from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { ARTIFACTS } from '../../data/artifacts';
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

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  scene,
  activeSentinelIndex = 0,
  isPlaying = true,
  isMuted = false,
  onTogglePlay,
  onToggleMute,
  onSkip,
  onEnterArchive,
}) => {
  const currentSentinel = ARTIFACTS[activeSentinelIndex] || ARTIFACTS[0];

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-6 md:p-8">
      {/* Top Controls: Audio Play/Pause, Mute (Top-Right, Non-obstructive) */}
      <div className="w-full flex justify-end items-center pointer-events-auto">
        <div className="flex items-center gap-2 bg-slate-950/70 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md shadow-2xl">
          {/* Mute Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              )}
            </button>
          )}

          {/* Audio & Animation Play / Pause Toggle */}
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause Intro' : 'Play Intro'}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/60 font-mono text-xs transition-colors"
              title={isPlaying ? 'Pause Intro' : 'Play Intro'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-semibold">PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400 ml-0.5" />
                  <span className="text-[11px] font-semibold text-emerald-400">PLAY</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Center / Lower-Third: Animated Name Display for Focused Model */}
      <div className="flex-1 flex flex-col justify-end pointer-events-none pb-2">
        {scene === 'sentinels' && (
          <div
            key={currentSentinel.id}
            className="animate-title-reveal pointer-events-auto max-w-lg mb-4"
          >
            {/* Top Micro-Tag */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: currentSentinel.accentColor }}
              />
              <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 font-bold uppercase">
                SENTINEL 0{activeSentinelIndex + 1} // {currentSentinel.celestialBody.toUpperCase()}
              </span>
            </div>

            {/* Model Name with Smooth Glow and Typography */}
            <h2 className="font-orbitron text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-wider drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {currentSentinel.name}
            </h2>

            {/* Subtitle Details: Resting Site & Coordinates */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-slate-300 mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <span className="text-amber-300/90 font-medium">
                📍 {currentSentinel.landingSite}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">
                {currentSentinel.missionLifespan.actual}
              </span>
            </div>

            {/* Animated accent gradient line */}
            <div
              className="h-0.5 mt-3 rounded-full transition-all duration-700"
              style={{
                background: `linear-gradient(90deg, ${currentSentinel.accentColor}, #38bdf8, transparent)`,
                width: '240px',
              }}
            />
          </div>
        )}

        {/* Scene 3 Grand Exhibition Subtle Indicator */}
        {scene === 'grand-exhibition' && (
          <div className="animate-title-reveal pointer-events-auto max-w-md mb-4">
            <span className="font-mono text-[10px] tracking-[0.25em] text-sky-400 uppercase font-bold block mb-1">
              THE CIRCULAR AMPHITHEATER
            </span>
            <h3 className="font-orbitron text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              ALL EIGHT SENTINELS
            </h3>
            <p className="font-mono text-xs text-slate-300 mt-1">
              Panoramic 360° orbital view of humanity's off-world pioneers
            </p>
          </div>
        )}
      </div>

      {/* Bottom Bar: Skip Control (Right) & Enter Archive CTA (Center in final scene) */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div />

        {/* Enter Archive CTA in Scene 5 */}
        {scene === 'title-reveal' && (
          <div className="animate-fade-in flex-1 flex justify-center">
            <button
              onClick={onEnterArchive}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_45px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 flex items-center gap-2 group"
            >
              <span>ENTER THE ARCHIVE</span>
              <span className="w-2 h-2 rounded-full bg-slate-950 group-hover:scale-125 transition-transform" />
            </button>
          </div>
        )}

        {/* Discreet Skip Intro button */}
        <button
          onClick={onSkip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950/70 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 font-mono text-[11px] tracking-wider backdrop-blur-md transition-all duration-200 shadow-xl group"
          title="Skip Intro to Command Terminal"
        >
          <span>SKIP INTRO</span>
          <SkipForward className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
};
