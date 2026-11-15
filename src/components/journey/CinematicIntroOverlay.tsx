import React, { useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { ARTIFACTS } from '../../data/artifacts';
import { IntroScene } from '../../types/journey';
import { getCueForTimestamp, INTRO_AUDIO_DURATION } from '../../data/introAudioSync';

interface CinematicIntroOverlayProps {
  scene: IntroScene;
  activeSentinelIndex?: number;
  currentTime?: number;
  duration?: number;
  progress?: number;
  isPlaying?: boolean;
  isMuted?: boolean;
  onTogglePlay?: () => void;
  onToggleMute?: () => void;
  onSeek?: (timeSec: number) => void;
  onSkip: () => void;
  onReplay?: () => void;
  onSelectScene?: (scene: IntroScene) => void;
  onEnterArchive: () => void;
  onPlayGame?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  scene,
  activeSentinelIndex = 0,
  currentTime = 0,
  duration = INTRO_AUDIO_DURATION,
  progress = 0,
  isPlaying = true,
  isMuted = false,
  onTogglePlay,
  onToggleMute,
  onSeek,
  onSkip,
  onEnterArchive,
  onPlayGame,
}) => {
  const currentSentinel = ARTIFACTS[activeSentinelIndex] || ARTIFACTS[0];
  const activeCue = useMemo(() => getCueForTimestamp(currentTime), [currentTime]);

  // Marker positions for the timeline scrubber
  const timelineMarkers = [
    { time: 11.5, label: 'Oppy', index: 0 },
    { time: 18.2, label: 'Ginny', index: 1 },
    { time: 23.4, label: 'Apollo 11', index: 2 },
    { time: 29.2, label: 'InSight', index: 3 },
    { time: 33.7, label: 'LRV-1', index: 4 },
    { time: 38.6, label: 'Sojourner', index: 5 },
    { time: 44.0, label: 'Pioneer 10', index: 6 },
    { time: 50.0, label: 'Surveyor 3', index: 7 },
    { time: 55.5, label: 'Exhibition' },
    { time: 65.5, label: 'Planetary' },
    { time: 74.5, label: 'Title' },
  ];

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(clickRatio * duration);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none z-20 flex flex-col justify-between p-3 xs:p-4 sm:p-6 md:p-8 font-sans">
      {/* Top Header Controls: Timecode readout & Audio Controls (Top-Right) */}
      <div className="w-full flex justify-between items-center pointer-events-auto gap-2">
        {/* Master Clock Readout */}
        <div className="flex items-center gap-1.5 sm:gap-2 obsidian-card border border-titanium/15 rounded-full px-2.5 sm:px-3 py-1 backdrop-blur-md shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-signalGreen animate-pulse shrink-0" />
          <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-titanium font-medium whitespace-nowrap">
            {formatTime(currentTime)} <span className="text-dustGrey">/</span> {formatTime(duration)}
          </span>
          <span className="text-titanium/30 text-xs hidden xs:inline">|</span>
          <span className="font-mono text-[9px] sm:text-[10px] text-nebulaCyan uppercase tracking-widest font-semibold hidden xs:inline truncate max-w-[100px] sm:max-w-none">
            {scene.replace('-', ' ')}
          </span>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 obsidian-card border border-titanium/15 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 backdrop-blur-md shadow-2xl shrink-0">
          {/* Mute Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-1 sm:p-1.5 rounded-full hover:bg-cosmicNavy text-dustGrey hover:text-lunarWhite transition-colors cursor-pointer"
              title={isMuted ? 'Unmute Narration' : 'Mute Narration'}
            >
              {isMuted ? (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-nebulaCyan" />
              )}
            </button>
          )}

          {/* Audio & Animation Play / Pause Toggle */}
          {onTogglePlay && (
            <button
              onClick={onTogglePlay}
              aria-label={isPlaying ? 'Pause Intro' : 'Play Intro'}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-cosmicNavy hover:bg-stellarBlue/20 text-titanium hover:text-lunarWhite border border-titanium/20 font-mono text-xs transition-colors cursor-pointer"
              title={isPlaying ? 'Pause Intro' : 'Play Intro'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-solarAmber fill-current" />
                  <span className="text-[10px] sm:text-[11px] font-semibold">PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-signalGreen fill-current ml-0.5" />
                  <span className="text-[10px] sm:text-[11px] font-semibold text-signalGreen">PLAY</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Center / Lower-Third: Animated Display for Active Sentinel & Synchronized Narration */}
      <div className="flex-1 flex flex-col justify-end pointer-events-none pb-4">
        {/* Scene 1 Awakening Narrative */}
        {scene === 'awakening' && (
          <div key="awakening-text" className="animate-title-reveal pointer-events-auto max-w-xl mb-4">
            <span className="font-mono text-[10px] tracking-widest text-nebulaCyan uppercase font-semibold block mb-1">
              PROLOGUE // THE MACHINES WE LEFT BEHIND
            </span>
            <p className="font-sans text-lg sm:text-xl font-light text-lunarWhite italic drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              “{activeCue.spokenWords}”
            </p>
          </div>
        )}

        {/* Scene 2 Sentinels Display */}
        {scene === 'sentinels' && (
          <div
            key={currentSentinel.id}
            className="animate-title-reveal pointer-events-auto max-w-xl mb-4"
          >
            {/* Top Micro-Tag */}
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: currentSentinel.accentColor }}
              />
              <span className="font-mono text-[10px] tracking-widest text-nebulaCyan font-semibold uppercase">
                SENTINEL 0{activeSentinelIndex + 1} // {currentSentinel.celestialBody.toUpperCase()}
              </span>
            </div>

            {/* Model Name with Smooth Editorial Typography */}
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-lunarWhite tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
              {currentSentinel.name}
            </h2>

            {/* Subtitle Details: Resting Site & Coordinates */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-dustGrey mt-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              <span className="text-solarAmber font-medium">
                📍 {currentSentinel.landingSite}
              </span>
              <span className="text-titanium/40">•</span>
              <span className="text-titanium">
                {currentSentinel.missionLifespan.actual}
              </span>
            </div>

            {/* Synchronized Narration Subtitle */}
            <p className="font-sans text-sm sm:text-base text-lunarWhite/90 italic mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              “{activeCue.spokenWords}”
            </p>

            {/* Animated accent gradient line */}
            <div
              className="h-0.5 mt-3 rounded-full transition-all duration-700"
              style={{
                background: 'linear-gradient(90deg, #1A2FFB, #54C9F5, transparent)',
                width: '240px',
              }}
            />
          </div>
        )}

        {/* Scene 3 Grand Exhibition */}
        {scene === 'grand-exhibition' && (
          <div key="exhibition-text" className="animate-title-reveal pointer-events-auto max-w-xl mb-4">
            <span className="font-mono text-[10px] tracking-widest text-nebulaCyan uppercase font-semibold block mb-1">
              THE CIRCULAR EXHIBITION // SACRED MONUMENTS
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-lunarWhite tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] mb-1">
              ALL EIGHT SENTINELS
            </h3>
            <p className="font-sans text-sm sm:text-base text-lunarWhite/95 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              “{activeCue.spokenWords}”
            </p>
          </div>
        )}

        {/* Scene 4 Planetary Reveal */}
        {scene === 'planetary-reveal' && (
          <div key="planetary-text" className="animate-title-reveal pointer-events-auto max-w-xl mb-4">
            <span className="font-mono text-[10px] tracking-widest text-solarAmber uppercase font-semibold block mb-1">
              GEOLOGICAL RECORD // MARTIAN SURFACE
            </span>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-lunarWhite tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] mb-1">
              ACROSS THREE SILENT WORLDS
            </h3>
            <p className="font-sans text-sm sm:text-base text-lunarWhite/95 italic drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              “{activeCue.spokenWords}”
            </p>
          </div>
        )}

        {/* Scene 5 Title Reveal & Hero CTA */}
        {scene === 'title-reveal' && (
          <div key="title-text" className="animate-title-reveal pointer-events-auto max-w-2xl mb-4">
            <span className="font-mono text-[10px] tracking-widest text-nebulaCyan uppercase font-semibold block mb-1">
              STAGE 0 // NASA SPACE APPS ARCHIVE
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-lunarWhite tracking-tight drop-shadow-[0_6px_24px_rgba(0,0,0,0.95)]">
              NOVOCHRONOS
            </h1>
            <p className="font-sans text-sm sm:text-base text-dustGrey italic mt-2 mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              “{activeCue.spokenWords}”
            </p>
            <div>
              <button
                onClick={onEnterArchive}
                className="px-8 py-3.5 rounded-xl bg-stellarBlue hover:bg-stellarBlue/90 text-lunarWhite font-mono font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(26,47,251,0.5)] hover:shadow-[0_0_45px_rgba(26,47,251,0.7)] hover:scale-105 active:scale-95 flex items-center gap-2 group cursor-pointer"
              >
                <span>ENTER THE ARCHIVE</span>
                <span className="w-2 h-2 rounded-full bg-nebulaCyan group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar: Interactive Timeline Scrubber & Skip Button */}
      <div className="w-full flex flex-col gap-2 pointer-events-auto">
        {/* Timeline Scrubber Bar */}
        <div className="w-full flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 obsidian-card border border-titanium/15 rounded-xl p-2.5 sm:px-4 sm:py-2 backdrop-blur-xl shadow-2xl">
          {/* Progress bar container (full width on mobile) */}
          <div
            className="relative w-full sm:flex-1 h-3.5 sm:h-3 bg-cosmicNavy rounded-full cursor-pointer group flex items-center order-1"
            onClick={handleProgressBarClick}
            title="Click to scrub audio timeline"
          >
            {/* Background track */}
            <div className="absolute inset-0 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-stellarBlue via-nebulaCyan to-signalGreen transition-all duration-75"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            {/* Sentinel Marker Dots along track */}
            {timelineMarkers.map((marker, i) => {
              const markerPercent = (marker.time / duration) * 100;
              const isPast = currentTime >= marker.time;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 pointer-events-none"
                  style={{ left: `${markerPercent}%` }}
                  title={`${marker.label} (${formatTime(marker.time)})`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full border transition-all ${
                      isPast
                        ? 'bg-nebulaCyan border-nebulaCyan scale-110 shadow-[0_0_6px_#54C9F5]'
                        : 'bg-titanium/40 border-titanium/20'
                    }`}
                  />
                </div>
              );
            })}

            {/* Playhead thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 sm:w-3.5 sm:h-3.5 rounded-full bg-lunarWhite shadow-[0_0_8px_rgba(255,255,255,0.8)] border-2 border-stellarBlue pointer-events-none group-hover:scale-125 transition-transform"
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          {/* Action buttons (inline on desktop, full-width row on mobile) */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto order-2">
            {/* Play Game Button */}
            {onPlayGame && (
              <button
                onClick={onPlayGame}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-solarAmber hover:bg-solarAmber/90 text-deepSpace font-mono font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(245,166,35,0.4)] cursor-pointer active:scale-95 whitespace-nowrap"
              >
                <span>POWER RUN</span>
              </button>
            )}

            {/* Skip Intro button */}
            <button
              onClick={onSkip}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-cosmicNavy hover:bg-stellarBlue/20 text-titanium hover:text-lunarWhite border border-titanium/20 font-mono text-[10px] sm:text-[11px] tracking-wider transition-colors cursor-pointer group whitespace-nowrap"
              title="Skip Intro to Stage 1: Command Terminal"
            >
              <span>SKIP INTRO</span>
              <SkipForward className="w-3 h-3 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
