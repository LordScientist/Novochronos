import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  ChevronDown,
  Compass,
  Target,
  ShieldCheck,
  Radio,
  Quote,
  Camera,
  Activity,
  Wrench,
  Crosshair,
  Info,
  Landmark,
} from 'lucide-react';
import { ArtifactPodiumViewer } from '../canvas/ArtifactPodiumViewer';
import narrationScripts from '../../data/narrationScripts.json';
import { ARTIFACTS } from '../../data/artifacts';

interface SentinelDetailModalProps {
  sentinelId: string | null;
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
  if (text.includes('retroreflector') || text.includes('laser') || text.includes('lrrr') || text.includes('cube')) {
    return <Crosshair className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
  }
  if (text.includes('antenna') || text.includes('dish') || text.includes('radio') || text.includes('transmitter')) {
    return <Radio className="w-3.5 h-3.5 text-cyan-400 shrink-0" />;
  }
  if (text.includes('plaque') || text.includes('marker') || text.includes('fabric') || text.includes('tribute')) {
    return <Landmark className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
  }
  return <Target className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
};

export const SentinelDetailModal: React.FC<SentinelDetailModalProps> = ({
  sentinelId,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);
  const [isAudioHovered, setIsAudioHovered] = useState(false);

  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const exitTriggeredRef = useRef<boolean>(false);
  const touchStartYRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sentinel = narrationScripts.find((s) => s.id === sentinelId);
  const artifactData = ARTIFACTS.find((a) => a.id === sentinelId);
  const sentinelIndex = narrationScripts.findIndex((s) => s.id === sentinelId);
  const indexStr = `${String(sentinelIndex >= 0 ? sentinelIndex + 1 : 1).padStart(2, '0')} / ${String(narrationScripts.length).padStart(2, '0')}`;
  const audioSrc = sentinelId ? SENTINEL_AUDIO_MAP[sentinelId] : undefined;
  const backgroundImageSrc = sentinelId ? `/images/sentinels/${sentinelId}.jpg` : undefined;

  const storyText = sentinel ? (sentinel.ttsCleanScript || sentinel.directorScript).trim() : '';

  useEffect(() => {
    if (sentinelId) {
      setIsRendered(true);
      exitTriggeredRef.current = false;
      setIsAudioHovered(false);
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
        setIsExiting(false);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
      setIsExiting(false);
      setIsRendered(false);
      setIsAudioHovered(false);
    }
  }, [sentinelId]);

  useEffect(() => {
    if (!isRendered || !scrollContainerRef.current) return;

    const modalLenis = new Lenis({
      wrapper: scrollContainerRef.current,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      autoRaf: true,
    });

    const handleScroll = (e: { progress: number; velocity: number }) => {
      if (e.progress >= 0.992 && e.velocity > 0.03 && !exitTriggeredRef.current) {
        exitTriggeredRef.current = true;
        handleTriggerExit();
      }
    };

    modalLenis.on('scroll', handleScroll);

    return () => {
      modalLenis.destroy();
    };
  }, [isRendered]);

  const handleTriggerExit = () => {
    if (isExiting) return;
    setIsExiting(true);
    setIsVisible(false);

    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      setIsRendered(false);
      setIsExiting(false);
      exitTriggeredRef.current = false;
      onClose();
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTriggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setUseSpeechFallback(false);
    setIsAudioHovered(false);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [sentinelId]);

  if (!isRendered && !sentinelId) return null;
  if (!sentinel) return null;

  const handleContainerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || exitTriggeredRef.current || isExiting) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom && e.deltaY > 15) {
      exitTriggeredRef.current = true;
      handleTriggerExit();
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || exitTriggeredRef.current || isExiting) return;

    const diff = touchStartYRef.current - e.touches[0].clientY;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    if (isAtBottom && diff > 35) {
      exitTriggeredRef.current = true;
      handleTriggerExit();
    }
  };

  const handleTogglePlay = () => {
    if (useSpeechFallback) {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(storyText);
        utterance.rate = 0.95;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
      return;
    }

    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setUseSpeechFallback(true);
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(storyText);
            utterance.rate = 0.95;
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
            setIsPlaying(true);
          }
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      if (!isPlaying) {
        audioRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setUseSpeechFallback(true));
      }
    } else if (useSpeechFallback && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(storyText);
      utterance.rate = 0.95;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      className={`fixed inset-0 z-30 flex items-center justify-center p-2 xs:p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md transition-all duration-400 ease-out ${
        isVisible && !isExiting ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleTriggerExit();
        }
      }}
    >
      {/* Fullscreen Atmospheric Background Layer */}
      {backgroundImageSrc && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <img
            src={backgroundImageSrc}
            alt=""
            className="w-full h-full object-cover object-center filter blur-xl scale-110 opacity-30 contrast-125"
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      {audioSrc && !useSpeechFallback && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={() => {
            if (audioRef.current) {
              setCurrentTime(audioRef.current.currentTime);
            }
          }}
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration);
            }
          }}
          onEnded={() => setIsPlaying(false)}
          onError={() => setUseSpeechFallback(true)}
        />
      )}

      {/* Main Dossier Container with Authentic Photographic Background */}
      <div
        ref={scrollContainerRef}
        onWheel={handleContainerWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative w-full max-w-6xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain bg-slate-950/85 border border-white/10 rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 md:p-8 shadow-[0_25px_80px_rgba(0,0,0,0.95)] text-slate-100 font-sans transform transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${
          isVisible && !isExiting
            ? 'scale-100 opacity-100 translate-y-0'
            : isExiting
            ? 'scale-95 opacity-0 -translate-y-8'
            : 'scale-90 opacity-0 translate-y-10'
        }`}
      >
        {/* Main Canvas Background: Authentic Sentinel Photograph (Opportunity on Mars) */}
        {backgroundImageSrc && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-xl sm:rounded-2xl z-0">
            <img
              src={backgroundImageSrc}
              alt={sentinel.name}
              className="w-full h-full object-cover object-top sm:object-center filter brightness-[0.24] contrast-[1.12] saturate-[0.8] scale-100"
            />
            {/* Cinematic multi-stage vignettes & dark gradient feathers */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/90" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_transparent_15%,_rgba(0,0,0,0.85)_85%)]" />
          </div>
        )}

        {/* Floating Close Button */}
        <button
          onClick={handleTriggerExit}
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Content Container (Layered above photographic canvas) */}
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-5 pb-2 sm:pb-3 border-b border-white/10 pr-9 sm:pr-12">
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-heading font-normal tracking-[0.16em] sm:tracking-[0.2em] text-sky-400 uppercase">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>NASA HISTORIC ARTIFACT DOSSIER • {indexStr}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-sans font-light tracking-[0.14em] sm:tracking-[0.16em] uppercase text-slate-400">
              <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
              <span>{artifactData?.status || 'PERMANENT ARCHIVE'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 xl:gap-10 items-start">
            {/* Left Column: Sticky 3D Viewer & Telemetry */}
            <div className="lg:col-span-5 lg:sticky lg:top-0 space-y-2.5 sm:space-y-4">
              <div>
                <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2 text-[9px] sm:text-xs">
                  <span className="px-2 sm:px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                    {sentinel.celestialBody}
                  </span>
                  <span className="px-2 sm:px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans font-light tracking-[0.12em] sm:tracking-[0.14em] uppercase">
                    {artifactData?.characterArchetype || sentinel.characterArchetype}
                  </span>
                </div>
                <h1 className="text-xl xs:text-2xl sm:text-3xl xl:text-4xl font-heading font-extrabold text-white tracking-tight uppercase leading-tight mb-1 sm:mb-2">
                  {sentinel.name}
                </h1>
                {artifactData?.tagline && (
                  <p className="text-[11px] sm:text-xs md:text-sm text-slate-300 font-sans font-light leading-snug sm:leading-relaxed">
                    {artifactData.tagline}
                  </p>
                )}
              </div>

              <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-md">
                <ArtifactPodiumViewer sentinelId={sentinel.id} />
              </div>

              <div className="p-2.5 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 space-y-2 sm:space-y-3">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] text-slate-400 uppercase border-b border-white/5 pb-1.5 sm:pb-2">
                  <span className="flex items-center gap-1.5 text-sky-400">
                    <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>MISSION TELEMETRY</span>
                  </span>
                  <span className="font-mono text-slate-400 text-[9px] sm:text-[11px]">
                    {artifactData?.coordinates || 'SURFACE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                  <div className="p-2 sm:p-2.5 rounded-lg bg-black/50 border border-white/5">
                    <span className="block text-[9px] sm:text-[10px] font-heading font-normal tracking-[0.14em] sm:tracking-[0.16em] uppercase text-slate-400 mb-0.5">
                      PLANNED LIFESPAN
                    </span>
                    <span className="font-mono text-slate-200 font-medium text-[10px] sm:text-xs">
                      {artifactData?.missionLifespan.planned || 'Design Phase'}
                    </span>
                  </div>
                  <div className="p-2 sm:p-2.5 rounded-lg bg-sky-950/40 border border-sky-500/20">
                    <span className="block text-[9px] sm:text-[10px] font-heading font-normal tracking-[0.14em] sm:tracking-[0.16em] uppercase text-sky-400 mb-0.5">
                      ACTUAL LIFESPAN
                    </span>
                    <span className="font-mono text-sky-200 font-semibold text-[10px] sm:text-xs">
                      {artifactData?.missionLifespan.actual || 'Operational'}
                    </span>
                  </div>
                </div>

                {artifactData?.landingSite && (
                  <div className="p-2 sm:p-2.5 rounded-lg bg-black/50 border border-white/5 text-xs">
                    <span className="block text-[9px] sm:text-[10px] font-heading font-normal tracking-[0.14em] sm:tracking-[0.16em] uppercase text-slate-400 mb-0.5">
                      RESTING SITE / LANDING LOCATION
                    </span>
                    <span className="text-slate-200 font-sans font-light text-[10px] sm:text-xs leading-snug">
                      {artifactData.landingSite}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-slate-400 px-1 pt-0.5 font-mono">
                  <span>LAUNCH: {artifactData?.launchDate || 'Historic'}</span>
                  <span>LANDED: {artifactData?.landingDate || 'Historic'}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Feed & Dynamic Audio Controls */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5">
              
              {/* Glassmorphic Audio Player with Expanding Circular Interaction */}
              <div className="p-3 sm:p-4 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-2 sm:mb-3">
                  
                  {/* Circular Button that Expands into Pill on Hover */}
                  <div className="flex items-center gap-3">
                    <div
                      onMouseEnter={() => setIsAudioHovered(true)}
                      onMouseLeave={() => setIsAudioHovered(false)}
                      className={`relative flex items-center h-11 sm:h-12 rounded-full border border-white/20 bg-white/10 hover:bg-white/15 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 ease-out overflow-hidden cursor-pointer select-none ${
                        isAudioHovered
                          ? 'w-auto px-3.5 gap-2.5 bg-white/15 border-white/35'
                          : 'w-11 sm:w-12 justify-center px-0'
                      } ${isPlaying ? 'ring-2 ring-sky-400/50 shadow-[0_0_24px_rgba(56,189,248,0.35)]' : ''}`}
                    >
                      {/* Play / Pause Toggle Button */}
                      <button
                        onClick={handleTogglePlay}
                        className="flex items-center gap-2 text-white outline-none focus:outline-none"
                        aria-label={isPlaying ? 'Pause narration' : 'Listen to story'}
                      >
                        <span className={`flex items-center justify-center shrink-0 w-5 h-5 transition-transform duration-200 ${isAudioHovered ? 'scale-110' : ''}`}>
                          {isPlaying ? (
                            <Pause className="w-4 h-4 text-rose-400 fill-current" />
                          ) : (
                            <Play className="w-4 h-4 text-sky-400 fill-current translate-x-0.5" />
                          )}
                        </span>

                        {/* Sequence 1: 'Listen to Story' text slides in when hovered */}
                        <span
                          className={`whitespace-nowrap text-[11px] sm:text-xs font-heading font-bold tracking-[0.14em] uppercase transition-all duration-200 ${
                            isAudioHovered
                              ? 'opacity-100 max-w-[150px] translate-x-0 ml-0.5'
                              : 'opacity-0 max-w-0 -translate-x-3 pointer-events-none overflow-hidden'
                          } ${isPlaying ? 'text-rose-300' : 'text-slate-100'}`}
                        >
                          {isPlaying ? 'PAUSE NARRATION' : 'LISTEN TO STORY'}
                        </span>
                      </button>

                      {/* Sequence 2: 'Restart audio' icon slides in right after the text */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestart();
                        }}
                        className={`flex items-center justify-center p-1.5 rounded-full hover:bg-white/20 text-slate-300 hover:text-white transition-all duration-200 ${
                          isAudioHovered
                            ? 'opacity-100 translate-x-0 delay-100'
                            : 'opacity-0 translate-x-3 pointer-events-none w-0 overflow-hidden'
                        }`}
                        title="Restart audio"
                        aria-label="Restart audio"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Live Audio Visualizer Bars & Status */}
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs text-sky-300 font-mono">
                      <div className="flex items-center gap-0.5 sm:gap-1 h-3 sm:h-4">
                        {[4, 8, 14, 10, 6, 12, 5].map((h, i) => (
                          <span
                            key={i}
                            className={`w-0.5 sm:w-1 rounded-full transition-all duration-200 ${
                              isPlaying ? 'bg-sky-400' : 'bg-slate-700'
                            }`}
                            style={{
                              height: isPlaying ? `${Math.max(3, h * 0.75)}px` : '3px',
                              animation: isPlaying ? `pulse 0.8s ease-in-out infinite ${i * 0.1}s` : 'none',
                            }}
                          />
                        ))}
                      </div>
                      <Volume2 className={`w-3.5 h-3.5 ${isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
                      <span className="truncate text-[10px] sm:text-xs">
                        {useSpeechFallback
                          ? 'VOICEOVER READY (SPEECH)'
                          : audioSrc
                          ? 'RECORDED NARRATION'
                          : 'VOICEOVER AUDIO READY'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scrubber Timeline */}
                {!useSpeechFallback && (
                  <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-xs text-slate-400 pt-1">
                    <span className="text-white font-mono">{formatTime(currentTime)}</span>
                    <input
                      type="range"
                      min={0}
                      max={duration || sentinel.estimatedDurationSec}
                      step={0.1}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-1 sm:h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
                    />
                    <span className="font-mono">{formatTime(duration || sentinel.estimatedDurationSec)}</span>
                  </div>
                )}
              </div>

              {/* Mission Log / Historical Account */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                  <span className="text-sky-400 flex items-center gap-1.5">
                    <Quote className="w-3.5 h-3.5" />
                    <span>MISSION LOG & HISTORICAL ACCOUNT</span>
                  </span>
                  <span className="text-slate-400">ARCHIVAL RECORD</span>
                </div>

                <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 text-[11px] sm:text-sm leading-normal sm:leading-relaxed text-slate-200 font-sans font-light space-y-2 sm:space-y-3">
                  {storyText.split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="leading-normal sm:leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Historic Breakthroughs */}
              {artifactData?.breakthroughs && artifactData.breakthroughs.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>HISTORIC BREAKTHROUGHS</span>
                    </span>
                    <span className="text-slate-400">{artifactData.breakthroughs.length} ACHIEVEMENTS</span>
                  </div>

                  <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                    {artifactData.breakthroughs.map((breakthrough, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-md border border-white/5 text-[10px] sm:text-xs text-slate-200 font-sans font-light leading-snug sm:leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                        <span>{breakthrough}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Left Behind / Heritage */}
              {artifactData?.whyLeftBehind && (
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-black/50 backdrop-blur-md border border-white/10 space-y-1 sm:space-y-2">
                  <div className="flex items-center gap-1.5 text-sky-300 text-[10px] sm:text-[11px] font-heading font-normal uppercase tracking-[0.16em] sm:tracking-[0.18em]">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>WHY LEFT BEHIND • HERITAGE</span>
                  </div>
                  <p className="text-[11px] sm:text-sm text-slate-300 leading-snug sm:leading-relaxed font-sans font-light">
                    {artifactData.whyLeftBehind}
                  </p>
                </div>
              )}

              {/* Scientific Instrumentation */}
              {artifactData?.instruments && artifactData.instruments.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                    <span className="text-indigo-400 flex items-center gap-1.5">
                      <Crosshair className="w-3.5 h-3.5" />
                      <span>SCIENTIFIC INSTRUMENTATION</span>
                    </span>
                    <span className="text-slate-400">{artifactData.instruments.length} SENSORS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                    {artifactData.instruments.map((inst, idx) => (
                      <div
                        key={idx}
                        className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-md border border-white/5 space-y-1"
                      >
                        <div className="flex items-center gap-1.5">
                          {getInstrumentIcon(inst.name, inst.role)}
                          <span className="text-[10px] sm:text-[11px] font-mono text-sky-300 font-medium truncate">
                            {inst.name}
                          </span>
                        </div>
                        <span className="block text-[9px] sm:text-[11px] text-slate-400 font-sans font-light leading-snug sm:leading-relaxed">
                          {inst.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Field Observations / Archival Notes */}
              {artifactData?.didYouKnow && artifactData.didYouKnow.length > 0 && (
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>FIELD OBSERVATIONS</span>
                    </span>
                    <span className="text-slate-400">HISTORICAL NOTES</span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    {artifactData.didYouKnow.map((fact, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-black/50 backdrop-blur-md border border-white/5 text-[10px] sm:text-xs text-amber-100/90 font-sans font-light leading-snug sm:leading-relaxed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                        <span>{fact}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Scroll-to-Finish Exit Cue */}
              <div
                onClick={handleTriggerExit}
                className="mt-4 sm:mt-6 p-2.5 sm:p-4 rounded-xl border border-white/10 bg-black/40 hover:bg-black/60 backdrop-blur-md cursor-pointer flex flex-col items-center justify-center gap-1 transition-all text-center group"
              >
                <div className="flex items-center gap-1.5 text-sky-400 text-[10px] sm:text-[11px] font-heading font-normal uppercase tracking-[0.16em] sm:tracking-[0.18em]">
                  <span>Scroll down or tap to exit to orbital helix</span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
                </div>
                <p className="text-[9px] sm:text-[11px] text-slate-400 font-sans font-light tracking-wide">
                  Eases out smoothly and resumes the 3D Space Shuttle corridor
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-1 sm:pt-2 flex justify-end">
                <button
                  onClick={handleTriggerExit}
                  className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/10 hover:bg-white/20 text-white text-[10px] sm:text-xs font-heading font-bold tracking-[0.14em] sm:tracking-[0.16em] uppercase transition-colors text-center"
                >
                  RETURN TO SHUTTLE CORRIDOR
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
