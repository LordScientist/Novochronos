import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { ARTIFACTS } from '../../data/artifacts';
import { IntroScene } from '../../types/journey';

interface CinematicIntroOverlayProps {
  scene: IntroScene;
  activeSentinelIndex: number;
  progress: number; // 0 to 1
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSkip: () => void;
  onReplay: () => void;
  onSelectScene: (scene: IntroScene) => void;
  onEnterArchive: () => void;
}

export const CinematicIntroOverlay: React.FC<CinematicIntroOverlayProps> = ({
  scene,
  activeSentinelIndex,
  progress,
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onSkip,
  onReplay,
  onSelectScene,
  onEnterArchive,
}) => {
  const currentSentinel = ARTIFACTS[activeSentinelIndex] || ARTIFACTS[0];

  const sceneSteps: { id: IntroScene; label: string; number: string }[] = [
    { id: 'awakening', label: 'Awakening', number: '01' },
    { id: 'sentinels', label: 'The Eight Sentinels', number: '02' },
    { id: 'grand-exhibition', label: 'Grand Exhibition', number: '03' },
    { id: 'planetary-reveal', label: 'Planetary Staging', number: '04' },
    { id: 'title-reveal', label: 'Title Reveal', number: '05' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 select-none z-20">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        {/* NASA Insignia & Stage 0 Indicator */}
        <div className="flex items-center gap-3">
          <img src="/nasa-logo.svg" alt="NASA" className="w-10 h-8 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
          <div className="border-l border-slate-700 pl-3">
            <span className="font-mono text-[10px] tracking-widest text-amber-400 block uppercase">
              Stage 0 // Cinematic Opening
            </span>
            <span className="font-orbitron text-xs font-bold tracking-wider text-slate-200">
              ECHOES OF EXPLORATION
            </span>
          </div>
        </div>

        {/* Scene Navigation Pills (Desktop) */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-950/70 backdrop-blur-md border border-slate-800/80 rounded-full px-3 py-1.5 shadow-lg">
          {sceneSteps.map((step) => {
            const isActive = scene === step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectScene(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <span className="opacity-50 text-[10px]">{step.number}</span>
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Controls: Mute, Pause, Skip */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 backdrop-blur-md transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          <button
            onClick={onTogglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="p-2.5 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60 backdrop-blur-md transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-amber-400" />}
          </button>

          <button
            onClick={onSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-400/60 backdrop-blur-md font-mono text-xs tracking-wider transition-all duration-300 shadow-md group"
          >
            <span>SKIP INTRO</span>
            <SkipForward className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Center Cinematic Content Area (Varies by Scene) */}
      <div className="flex-1 flex items-center justify-center pointer-events-none my-6">
        {/* Scene 1: Awakening Typography */}
        {scene === 'awakening' && (
          <div className="text-center max-w-2xl px-6 animate-fade-in transition-all duration-1000">
            <p className="font-mono text-xs tracking-[0.3em] text-amber-400/90 uppercase mb-3">
              Deep Space Telemetry Online
            </p>
            <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-400 tracking-wider leading-relaxed">
              Before the footprints, before the colonies...
            </h2>
            <p className="text-sm md:text-base text-slate-400 font-sans mt-4 max-w-xl mx-auto leading-relaxed">
              Humanity sent mechanical sentinels into the cosmic dark. They were never meant to return.
            </p>
          </div>
        )}

        {/* Scene 2: Mechanical Sentinel Card */}
        {scene === 'sentinels' && (
          <div className="w-full max-w-4xl flex flex-col md:flex-row items-end md:items-center justify-between gap-6 pointer-events-auto">
            {/* Left Telemetry HUD Badge */}
            <div className="glass-panel p-5 rounded-2xl max-w-md border-l-4 border-l-amber-400 animate-slide-in-left shadow-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                  SENTINEL {activeSentinelIndex + 1} OF 8
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${currentSentinel.accentColor}25`,
                    color: currentSentinel.accentColor,
                    border: `1px solid ${currentSentinel.accentColor}50`,
                  }}
                >
                  {currentSentinel.celestialBody}
                </span>
              </div>
              <h3 className="font-orbitron text-xl md:text-2xl font-black text-white tracking-wide">
                {currentSentinel.name}
              </h3>
              <p className="font-mono text-xs text-amber-300 mt-1">
                Resting Site: {currentSentinel.landingSite}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1">
                <p className="font-mono text-[11px] text-slate-400">
                  <span className="text-slate-500">COORDINATES:</span> {currentSentinel.coordinates}
                </p>
                <p className="font-mono text-[11px] text-slate-400">
                  <span className="text-slate-500">LIFESPAN:</span> {currentSentinel.missionLifespan.actual}
                </p>
                <p className="text-slate-300 italic pt-1">
                  "{currentSentinel.tagline}"
                </p>
              </div>
            </div>

            {/* Right Mechanical Key Features List */}
            <div className="glass-panel p-4 rounded-xl max-w-xs border border-slate-700/60 text-xs hidden md:block">
              <span className="font-mono text-[10px] text-sky-400 uppercase tracking-widest block mb-2 font-bold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-sky-400" /> Key Engineering
              </span>
              <ul className="space-y-1.5 text-slate-300 font-sans">
                {currentSentinel.instruments.slice(0, 3).map((inst, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[10px] mt-0.5">▸</span>
                    <div>
                      <strong className="text-slate-100 font-mono text-[11px]">{inst.name}</strong>
                      <p className="text-[10px] text-slate-400 leading-tight">{inst.role}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Scene 3: Grand Exhibition Panoramic Title */}
        {scene === 'grand-exhibition' && (
          <div className="text-center max-w-2xl px-6 animate-fade-in">
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono text-xs tracking-widest uppercase mb-3 inline-block">
              THE CIRCULAR AMPHITHEATER
            </span>
            <h2 className="font-orbitron text-3xl md:text-5xl font-black text-white tracking-wider">
              EIGHT SENTINELS ASSEMBLED
            </h2>
            <p className="text-sm md:text-base text-slate-300 font-sans mt-3 max-w-lg mx-auto">
              United in one panoramic exhibition space: the rovers, landers, and deep-space scouts that answered humanity's call.
            </p>
          </div>
        )}

        {/* Scene 4: Planetary Staging Reveal with Historical Accuracy Note */}
        {scene === 'planetary-reveal' && (
          <div className="text-center max-w-3xl px-6 animate-fade-in flex flex-col items-center">
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono text-xs tracking-widest uppercase mb-3 inline-block">
              MARTIAN SURFACE HORIZON
            </span>
            <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white tracking-wider">
              ACROSS THREE WORLDS
            </h2>

            {/* Mandatory Historical Accuracy Disclaimer Box */}
            <div className="glass-panel p-4 mt-4 rounded-xl border border-amber-500/40 bg-slate-950/80 text-left max-w-xl pointer-events-auto">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="font-mono text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                  Historical Staging Notice
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Mars serves as the cinematic staging landscape for this panoramic showcase. In reality:
              </p>
              <ul className="text-[11px] text-slate-400 font-mono mt-2 space-y-1">
                <li><strong className="text-rose-400">Mars:</strong> Opportunity, Ingenuity, InSight, and Sojourner</li>
                <li><strong className="text-slate-200">The Moon:</strong> Apollo 11 Descent Stage, Apollo 15 LRV, Surveyor 3</li>
                <li><strong className="text-purple-400">Deep Space:</strong> Pioneer 10 (interstellar trajectory)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Scene 5: Monumental Title Reveal & Enter Archive */}
        {scene === 'title-reveal' && (
          <div className="text-center max-w-3xl px-6 animate-fade-in flex flex-col items-center">
            <p className="font-mono text-xs md:text-sm tracking-[0.4em] text-amber-400 uppercase font-semibold mb-2">
              2026 NASA Space Apps Challenge
            </p>

            <h1 className="font-orbitron text-4xl sm:text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-400 tracking-wider drop-shadow-[0_0_35px_rgba(255,255,255,0.3)]">
              NOVOCHRONOS
            </h1>

            <h2 className="font-orbitron text-base sm:text-2xl md:text-3xl font-bold text-amber-300 tracking-[0.2em] mt-2 uppercase">
              ECHOES OF EXPLORATION
            </h2>

            <p className="font-serif italic text-sm sm:text-lg text-slate-300 mt-2">
              The Machines We Left Behind.
            </p>

            <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent my-4" />

            <p className="font-mono text-xs md:text-sm text-slate-400 tracking-wider">
              Eight Sentinels. Three worlds. One human legacy.
            </p>

            {/* Enter the Archive Primary CTA Button */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 pointer-events-auto">
              <button
                onClick={onEnterArchive}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-sm sm:text-base tracking-widest uppercase transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 flex items-center gap-3 group"
              >
                <span>ENTER THE ARCHIVE</span>
                <span className="w-2 h-2 rounded-full bg-slate-950 group-hover:scale-125 transition-transform" />
              </button>

              <button
                onClick={onReplay}
                className="px-5 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-mono text-xs tracking-wider uppercase transition-all duration-200 flex items-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Intro</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress & Scene Tracker */}
      <div className="w-full max-w-4xl mx-auto pointer-events-auto">
        <div className="glass-panel px-4 py-3 rounded-xl border border-slate-800/80 backdrop-blur-md flex flex-col gap-2">
          {/* Progress bar line */}
          <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-400 via-amber-400 to-rose-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(progress * 100, 100)}%` }}
            />
          </div>

          {/* Bottom metadata indicators */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold uppercase">
                SCENE: {scene.replace('-', ' ')}
              </span>
              {scene === 'sentinels' && (
                <span className="text-slate-300 hidden sm:inline">
                  REVEALING: {currentSentinel.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span>{Math.round(progress * 100)}% COMPLETE</span>
              <button
                onClick={onEnterArchive}
                className="text-amber-400 hover:text-amber-300 hover:underline uppercase text-[10px] tracking-wider font-bold"
              >
                Enter Archive →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
