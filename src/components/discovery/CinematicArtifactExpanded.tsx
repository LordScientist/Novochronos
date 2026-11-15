import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  X,
  Play,
  Pause,
  Compass,
  Image as ImageIcon,
  Box,
  Wrench,
  Camera,
  Activity,
  Radio,
  Landmark,
  Target,
} from 'lucide-react';
import { Artifact } from '../../types/artifact';
import { ContextualArtifactViewer } from '../canvas/ContextualArtifactViewer';

interface CinematicArtifactExpandedProps {
  artifact: Artifact;
  originRect: DOMRect | null;
  onClose: () => void;
}

const SENTINEL_AUDIO_MAP: Record<string, string> = {
  'opportunity-rover': '/audio/novo1.mp3',
  'ingenuity-helicopter': '/audio/even/Novo_2.mp3',
  'apollo-11-descent': '/audio/novo3.mp3',
  'insight-lander': '/audio/even/Novo_4.mp3',
  'apollo-15-lrv': '/audio/novo5.mp3',
  'sojourner-pathfinder': '/audio/even/Novo_6.mp3',
  'pioneer-10': '/audio/novo7.mp3',
  'surveyor-3': '/audio/even/Novo_8.mp3',
};

const getInstrumentIcon = (name: string, role: string) => {
  const text = `${name} ${role}`.toLowerCase();
  if (text.includes('camera') || text.includes('pancam') || text.includes('vidicon') || text.includes('imaging')) {
    return <Camera className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
  }
  if (
    text.includes('spectrometer') ||
    text.includes('seis') ||
    text.includes('seismic') ||
    text.includes('apxs') ||
    text.includes('magnetometer') ||
    text.includes('tes') ||
    text.includes('heat')
  ) {
    return <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
  }
  if (
    text.includes('rat') ||
    text.includes('abrasion') ||
    text.includes('arm') ||
    text.includes('tool') ||
    text.includes('sampler') ||
    text.includes('claw') ||
    text.includes('mole') ||
    text.includes('wheel') ||
    text.includes('joystick')
  ) {
    return <Wrench className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  }
  if (text.includes('antenna') || text.includes('dish') || text.includes('radio') || text.includes('transmitter')) {
    return <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  }
  if (text.includes('plaque') || text.includes('marker') || text.includes('fabric') || text.includes('tribute')) {
    return <Landmark className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
  }
  return <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
};

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const CinematicArtifactExpanded: React.FC<CinematicArtifactExpandedProps> = ({
  artifact,
  originRect,
  onClose,
}) => {
  // FLIP Expansion Transition States
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isClosing, setIsClosing] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View mode: 3D interactive model vs Archival photo
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [activeTab, setActiveTab] = useState<'overview' | 'why' | 'instruments' | 'specs'>('overview');

  // Audio voiceover state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  // Trigger FLIP expansion on mount
  useEffect(() => {
    // Next animation frame: expand to full screen
    const raf = requestAnimationFrame(() => {
      setIsExpanded(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Handle closing with smooth reverse FLIP animation
  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsExpanded(false);

    // Stop audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Wait for transition duration before unmounting
    setTimeout(() => {
      onClose();
    }, 550);
  }, [isClosing, onClose]);

  // Keyboard navigation: Escape key closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  // Audio controls
  const togglePlayAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const audioPath = SENTINEL_AUDIO_MAP[artifact.id] || `/audio/${artifact.id}.mp3`;
  const imagePath = `/images/sentinels/${artifact.id}.jpg`;

  // Calculate inline styles for FLIP transition
  const getContainerStyle = (): React.CSSProperties => {
    if (!originRect || isExpanded) {
      return {
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        borderRadius: '0px',
        opacity: 1,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
      };
    }

    // Initial and Collapsing position matches the exact origin card rect
    return {
      top: `${originRect.top}px`,
      left: `${originRect.left}px`,
      width: `${originRect.width}px`,
      height: `${originRect.height}px`,
      borderRadius: '16px',
      opacity: isClosing ? 0.4 : 1,
      transition: 'all 0.55s cubic-bezier(0.16, 1, 0.3, 1)',
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-auto select-none">
      {/* Background Dimming Backdrop */}
      <div
        onClick={handleClose}
        className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ${
          isExpanded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioPath}
        preload="auto"
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(0);
        }}
      />

      {/* Main Shared-Element Expanding Container */}
      <div
        ref={containerRef}
        style={getContainerStyle()}
        className="fixed z-50 bg-[#050811] border border-white/15 overflow-hidden flex flex-col shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
      >
        {/* Top Editorial Bar */}
        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/80 backdrop-blur-md z-30 shrink-0">
          {/* Breadcrumb / Tag */}
          <div className="flex items-center gap-3">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: artifact.accentColor }}
            />
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-500 uppercase tracking-widest hidden sm:inline">
                STAGE 05 // EXHIBITION DOSSIER //
              </span>
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                {artifact.celestialBody}
              </span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-300 font-medium tracking-wide">
                {artifact.name.split('(')[0].trim()}
              </span>
            </div>
          </div>

          {/* Close Action */}
          <button
            onClick={handleClose}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 font-mono text-xs transition-colors cursor-pointer group shadow-lg"
            title="Return to Archive (Esc)"
          >
            <span className="text-[11px] font-bold">CLOSE TO ARCHIVE</span>
            <X className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Main Cinema Split Stage */}
        <div className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden">
          {/* Left / Center: 3D Interactive Stage or Archival Photograph (60% Desktop) */}
          <div className="relative flex-1 lg:flex-[1.3] h-[45vh] lg:h-full bg-black overflow-hidden flex flex-col justify-between">
            {/* View Mode Content */}
            <div className="absolute inset-0">
              {viewMode === '3d' ? (
                <ContextualArtifactViewer artifact={artifact} />
              ) : (
                <div className="w-full h-full relative flex items-center justify-center p-6 bg-black/90">
                  <img
                    src={imagePath}
                    alt={artifact.name}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-slate-950/80 border border-white/10 backdrop-blur-md max-w-md">
                    <span className="font-mono text-[10px] text-amber-400 tracking-wider uppercase block mb-1">
                      AUTHENTIC NASA MISSION IMAGERY
                    </span>
                    <p className="font-sans text-xs text-slate-300 leading-relaxed">
                      Archival photograph of {artifact.name} resting at {artifact.landingSite}.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* View Mode Toggle Switcher (Bottom-Left) */}
            <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-white/15 backdrop-blur-md shadow-2xl">
              <button
                onClick={() => setViewMode('3d')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  viewMode === '3d'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                <span>3D MODEL</span>
              </button>

              <button
                onClick={() => setViewMode('photo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  viewMode === 'photo'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>NASA PHOTO</span>
              </button>
            </div>
          </div>

          {/* Right Column: Editorial Storytelling & Hardware Dossier (40% Desktop) */}
          <div className="flex-1 lg:flex-[1.0] h-[55vh] lg:h-full overflow-y-auto bg-[#070b16] border-t lg:border-t-0 lg:border-l border-white/10 p-6 sm:p-8 flex flex-col justify-between custom-scrollbar">
            <div>
              {/* Primary Header & Identity */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2.5 py-0.5 rounded-full font-mono text-[10px] uppercase font-bold tracking-wider"
                    style={{
                      backgroundColor: `${artifact.accentColor}20`,
                      color: artifact.accentColor,
                      border: `1px solid ${artifact.accentColor}50`,
                    }}
                  >
                    {artifact.characterArchetype}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 border border-slate-800 px-2.5 py-0.5 rounded-full">
                    {artifact.status}
                  </span>
                </div>

                <h1 className="font-orbitron text-2xl sm:text-3xl font-extrabold text-white tracking-wide leading-tight">
                  {artifact.name}
                </h1>

                <p className="font-sans text-xs sm:text-sm text-slate-300 font-light mt-2.5 leading-relaxed">
                  {artifact.tagline}
                </p>
              </div>

              {/* Embedded Audio Voiceover Bar */}
              <div className="mb-6 p-4 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlayAudio}
                    className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer shrink-0"
                    title={isPlaying ? 'Pause Narration' : 'Play Narration'}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-slate-950" />
                    ) : (
                      <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
                    )}
                  </button>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-400 font-semibold block">
                      OFFICIAL NASA ARCHIVE NARRATION
                    </span>
                    <span className="font-mono text-xs text-slate-300 font-medium">
                      {formatTime(currentTime)} / {formatTime(duration || artifact.audioDurationSec)}
                    </span>
                  </div>
                </div>

                {/* Micro Audio Equalizer Waveform Indicator */}
                <div className="flex items-end gap-1 h-5 shrink-0">
                  {[0.4, 0.8, 0.5, 0.9, 0.3].map((height, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-200 ${
                        isPlaying ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'
                      }`}
                      style={{
                        height: isPlaying ? `${height * 100}%` : '20%',
                        animationDelay: `${i * 120}ms`,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center gap-1 border-b border-white/10 mb-6 font-mono text-xs overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'overview'
                      ? 'border-amber-400 text-white font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  HISTORICAL CONTEXT
                </button>

                <button
                  onClick={() => setActiveTab('why')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'why'
                      ? 'border-amber-400 text-white font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  WHY DISCARDED
                </button>

                <button
                  onClick={() => setActiveTab('instruments')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'instruments'
                      ? 'border-amber-400 text-white font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  BREAKTHROUGHS ({artifact.breakthroughs.length})
                </button>

                <button
                  onClick={() => setActiveTab('specs')}
                  className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer shrink-0 ${
                    activeTab === 'specs'
                      ? 'border-amber-400 text-white font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  TELEMETRY SPECS
                </button>
              </div>

              {/* Tab Content Display */}
              <div className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed min-h-[180px]">
                {/* 1. Historical Context */}
                {activeTab === 'overview' && (
                  <div className="space-y-4 animate-title-reveal">
                    <div>
                      <h4 className="font-mono text-[11px] text-amber-400 uppercase tracking-widest font-bold mb-1.5">
                        MISSION ARCHAEOLOGY
                      </h4>
                      <p className="font-light text-slate-200 text-sm leading-relaxed">
                        {artifact.ttsCleanScript || artifact.tagline}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="font-mono text-[10px] text-sky-400 uppercase tracking-wider block mb-1">
                        TAKEAWAY FOR FUTURE EXPLORERS
                      </span>
                      <p className="italic text-slate-300 text-xs">
                        “{artifact.takeawayForKids}”
                      </p>
                    </div>
                  </div>
                )}

                {/* 2. Why Abandoned */}
                {activeTab === 'why' && (
                  <div className="space-y-4 animate-title-reveal">
                    <div>
                      <h4 className="font-mono text-[11px] text-amber-400 uppercase tracking-widest font-bold mb-1.5">
                        REASON FOR PRESERVATION ON-SITE
                      </h4>
                      <p className="font-light text-slate-200 text-sm leading-relaxed">
                        {artifact.whyLeftBehind}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-900/40">
                      <span className="font-mono text-[10px] text-amber-400 uppercase tracking-wider font-semibold block mb-1">
                        HISTORICAL ARTIFACT STATUS
                      </span>
                      <span className="font-mono text-xs text-amber-200/90">
                        Preserved in situ as permanent archaeological heritage of humankind.
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Breakthroughs & Scientific Instruments */}
                {activeTab === 'instruments' && (
                  <div className="space-y-4 animate-title-reveal">
                    {/* Breakthroughs List */}
                    <div>
                      <h4 className="font-mono text-[11px] text-amber-400 uppercase tracking-widest font-bold mb-2">
                        MAJOR SCIENTIFIC DISCOVERIES
                      </h4>
                      <ul className="space-y-2">
                        {artifact.breakthroughs.map((breakthrough, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="text-amber-400 font-mono font-bold mt-0.5">▸</span>
                            <span>{breakthrough}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Scientific Instruments */}
                    {artifact.instruments.length > 0 && (
                      <div className="pt-2">
                        <h4 className="font-mono text-[11px] text-sky-400 uppercase tracking-widest font-bold mb-2">
                          SCIENCE HARDWARE & INSTRUMENTS
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {artifact.instruments.map((inst, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start gap-2.5"
                            >
                              {getInstrumentIcon(inst.name, inst.role)}
                              <div>
                                <span className="font-mono text-[11px] text-white font-semibold block">
                                  {inst.name}
                                </span>
                                <span className="text-[10px] text-slate-400 leading-tight block">
                                  {inst.role}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. Telemetry Specs */}
                {activeTab === 'specs' && (
                  <div className="space-y-3 font-mono text-xs animate-title-reveal">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">LAUNCH DATE</span>
                        <span className="text-slate-200 font-bold">{artifact.launchDate}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">SURFACE ARRIVAL</span>
                        <span className="text-slate-200 font-bold">{artifact.landingDate}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">DESIGNED LIFESPAN</span>
                        <span className="text-slate-200 font-bold">{artifact.missionLifespan.planned}</span>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                        <span className="text-slate-500 text-[10px] block">ACTUAL LIFESPAN</span>
                        <span className="text-emerald-400 font-bold">{artifact.missionLifespan.actual}</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 text-[10px]">RESTING SITE</span>
                        <span className="text-amber-300 font-bold text-right">{artifact.landingSite}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                        <span className="text-slate-500 text-[10px]">COORDINATES</span>
                        <span className="text-sky-300 text-right">{artifact.coordinates}</span>
                      </div>
                    </div>

                    {artifact.didYouKnow.length > 0 && (
                      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800/80">
                        <span className="text-amber-400 text-[10px] uppercase font-bold block mb-1">
                          DID YOU KNOW?
                        </span>
                        <p className="font-sans text-xs text-slate-300 font-light italic">
                          “{artifact.didYouKnow[0]}”
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Coordinates & NASA Recognition */}
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400 shrink-0">
              <div className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">{artifact.coordinates}</span>
              </div>
              <span className="text-slate-500">2026 NASA SPACE APPS CHALLENGE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
