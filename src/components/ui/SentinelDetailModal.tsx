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
  Rocket,
} from 'lucide-react';
import { ArtifactPodiumViewer } from '../canvas/ArtifactPodiumViewer';
import narrationScripts from '../../data/narrationScripts.json';
import { ARTIFACTS } from '../../data/artifacts';

interface SentinelDetailModalProps {
  sentinelId: string | null;
  onClose: () => void;
  onLaunchGame?: (sentinelId: string) => void;
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
  onLaunchGame,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

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

  const storyText = sentinel ? (sentinel.ttsCleanScript || sentinel.directorScript).trim() : '';

  useEffect(() => {
    if (sentinelId) {
      setIsRendered(true);
      exitTriggeredRef.current = false;
      const frame = requestAnimationFrame(() => {
        setIsVisible(true);
        setIsExiting(false);
      });
      return () => cancelAnimationFrame(frame);
    } else {
      setIsVisible(false);
      setIsExiting(false);
      setIsRendered(false);
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

      <div
        ref={scrollContainerRef}
        data-lenis-prevent
        onWheel={handleContainerWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative w-full max-w-6xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain bg-deepSpace/95 border border-titanium/20 rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 md:p-8 shadow-[0_0_80px_rgba(26,47,251,0.2)] text-lunarWhite font-sans transform transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${
          isVisible && !isExiting
            ? 'scale-100 opacity-100 translate-y-0'
            : isExiting
            ? 'scale-95 opacity-0 -translate-y-8'
            : 'scale-90 opacity-0 translate-y-10'
        }`}
      >
        <button
          onClick={handleTriggerExit}
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cosmicNavy hover:bg-stellarBlue/20 text-titanium hover:text-lunarWhite border border-titanium/15 transition-colors z-20 cursor-pointer"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-5 pb-2 sm:pb-3 border-b border-titanium/15 pr-9 sm:pr-12">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-mono font-medium tracking-widest text-nebulaCyan uppercase">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-signalGreen animate-pulse" />
            <span>NASA HISTORIC ARTIFACT DOSSIER • {indexStr}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-mono tracking-wider uppercase text-dustGrey">
            <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-nebulaCyan" />
            <span>{artifactData?.status || 'PERMANENT ARCHIVE'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 xl:gap-10 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-0 space-y-2.5 sm:space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2 text-[9px] sm:text-xs">
                <span className="px-2 sm:px-2.5 py-0.5 rounded bg-stellarBlue/15 text-nebulaCyan border border-stellarBlue/30 font-mono uppercase tracking-wider">
                  {sentinel.celestialBody}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded bg-solarAmber/15 text-solarAmber border border-solarAmber/30 font-mono uppercase tracking-wider">
                  {artifactData?.characterArchetype || sentinel.characterArchetype}
                </span>
              </div>
              <h1 className="text-xl xs:text-2xl sm:text-3xl xl:text-4xl font-display font-bold text-lunarWhite tracking-tight uppercase leading-tight mb-1 sm:mb-2">
                {sentinel.name}
              </h1>
              {artifactData?.tagline && (
                <p className="text-[11px] sm:text-xs md:text-sm text-dustGrey font-sans leading-snug sm:leading-relaxed">
                  {artifactData.tagline}
                </p>
              )}
            </div>

            <div className="relative group rounded-xl overflow-hidden border border-titanium/15">
              <ArtifactPodiumViewer sentinelId={sentinel.id} />
            </div>

            <div className="p-2.5 sm:p-4 rounded-xl obsidian-card border border-titanium/15 space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-dustGrey uppercase border-b border-titanium/10 pb-1.5 sm:pb-2 tracking-wider">
                <span className="flex items-center gap-1.5 text-nebulaCyan">
                  <Compass className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>MISSION TELEMETRY</span>
                </span>
                <span className="font-mono text-titanium text-[9px] sm:text-[11px]">
                  {artifactData?.coordinates || 'SURFACE'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs">
                <div className="p-2 sm:p-2.5 rounded-lg bg-deepSpace/60 border border-titanium/10">
                  <span className="block text-[9px] sm:text-[10px] font-mono uppercase text-dustGrey mb-0.5 tracking-wider">
                    PLANNED LIFESPAN
                  </span>
                  <span className="font-mono text-titanium font-medium text-[10px] sm:text-xs">
                    {artifactData?.missionLifespan.planned || 'Design Phase'}
                  </span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-stellarBlue/15 border border-stellarBlue/30">
                  <span className="block text-[9px] sm:text-[10px] font-mono uppercase text-nebulaCyan mb-0.5 tracking-wider">
                    ACTUAL LIFESPAN
                  </span>
                  <span className="font-mono text-solarAmber font-semibold text-[10px] sm:text-xs">
                    {artifactData?.missionLifespan.actual || 'Operational'}
                  </span>
                </div>
              </div>

              {artifactData?.landingSite && (
                <div className="p-2 sm:p-2.5 rounded-lg bg-deepSpace/60 border border-titanium/10 text-xs">
                  <span className="block text-[9px] sm:text-[10px] font-mono uppercase text-dustGrey mb-0.5 tracking-wider">
                    RESTING SITE / LANDING LOCATION
                  </span>
                  <span className="text-lunarWhite font-sans text-[10px] sm:text-xs leading-snug">
                    {artifactData.landingSite}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between text-[9px] sm:text-[11px] text-dustGrey px-1 pt-0.5 font-mono">
                <span>LAUNCH: {artifactData?.launchDate || 'Historic'}</span>
                <span>LANDED: {artifactData?.landingDate || 'Historic'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5">
            <div className="p-2.5 sm:p-4 rounded-xl obsidian-card border border-stellarBlue/30 shadow-[0_0_24px_rgba(26,47,251,0.15)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleTogglePlay}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-mono font-bold tracking-wider transition-all shadow-md cursor-pointer ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                        : 'bg-stellarBlue hover:bg-stellarBlue/90 text-lunarWhite shadow-[0_0_20px_rgba(26,47,251,0.5)]'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>PAUSE NARRATION</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>LISTEN TO STORY</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-cosmicNavy hover:bg-stellarBlue/20 text-titanium hover:text-lunarWhite border border-titanium/15 transition-colors cursor-pointer"
                    title="Restart audio"
                    aria-label="Restart audio"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-nebulaCyan font-mono">
                  <div className="flex items-center gap-0.5 sm:gap-1 h-3 sm:h-4">
                    {[4, 8, 14, 10, 6, 12, 5].map((h, i) => (
                      <span
                        key={i}
                        className={`w-0.5 sm:w-1 rounded-full transition-all duration-200 ${
                          isPlaying ? 'bg-nebulaCyan' : 'bg-cosmicNavy'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(3, h * 0.75)}px` : '3px',
                          animation: isPlaying ? `pulse 0.8s ease-in-out infinite ${i * 0.1}s` : 'none',
                        }}
                      />
                    ))}
                  </div>
                  <Volume2 className={`w-3 h-3 sm:w-4 sm:h-4 ${isPlaying ? 'text-nebulaCyan animate-pulse' : 'text-dustGrey'}`} />
                  <span className="truncate text-[10px] sm:text-xs">
                    {useSpeechFallback
                      ? 'VOICEOVER READY (SPEECH)'
                      : audioSrc
                      ? 'RECORDED NARRATION'
                      : 'VOICEOVER AUDIO READY'}
                  </span>
                </div>
              </div>

              {!useSpeechFallback && (
                <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-xs text-dustGrey pt-0.5">
                  <span className="text-lunarWhite font-mono">{formatTime(currentTime)}</span>
                  <input
                    type="range"
                    min={0}
                    max={duration || sentinel.estimatedDurationSec}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1 sm:h-1.5 bg-cosmicNavy rounded-lg appearance-none cursor-pointer accent-nebulaCyan"
                  />
                  <span className="font-mono text-dustGrey">{formatTime(duration || sentinel.estimatedDurationSec)}</span>
                </div>
              )}

              {onLaunchGame && (
                <div className="pt-2.5 mt-2 border-t border-titanium/15 flex items-center justify-between">
                  <span className="text-[10px] text-nebulaCyan font-mono uppercase tracking-widest font-semibold">
                    INTERACTIVE MISSION READY
                  </span>
                  <button
                    onClick={() => onLaunchGame(sentinel.id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-solarAmber hover:bg-solarAmber/90 text-deepSpace font-mono text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(245,166,35,0.4)] cursor-pointer active:scale-95"
                  >
                    <Rocket className="w-3.5 h-3.5 fill-current" />
                    <span>LAUNCH IN POWER RUN</span>
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-dustGrey border-b border-titanium/15 pb-1.5 sm:pb-2 font-mono uppercase tracking-wider">
                <span className="text-nebulaCyan flex items-center gap-1.5 font-semibold">
                  <Quote className="w-3.5 h-3.5" />
                  <span>MISSION LOG & HISTORICAL ACCOUNT</span>
                </span>
                <span className="text-dustGrey">ARCHIVAL RECORD</span>
              </div>

              <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-deepSpace/60 border border-titanium/15 text-[11px] sm:text-sm leading-normal sm:leading-relaxed text-titanium font-sans space-y-2 sm:space-y-3">
                {storyText.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-normal sm:leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {artifactData?.breakthroughs && artifactData.breakthroughs.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-dustGrey border-b border-titanium/15 pb-1.5 sm:pb-2 font-mono uppercase tracking-wider">
                  <span className="text-signalGreen flex items-center gap-1.5 font-semibold">
                    <Target className="w-3.5 h-3.5" />
                    <span>HISTORIC BREAKTHROUGHS</span>
                  </span>
                  <span className="text-dustGrey">{artifactData.breakthroughs.length} ACHIEVEMENTS</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                  {artifactData.breakthroughs.map((breakthrough, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-deepSpace/40 border border-titanium/10 text-[10px] sm:text-xs text-titanium font-sans leading-snug sm:leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-signalGreen mt-1 shrink-0" />
                      <span>{breakthrough}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {artifactData?.whyLeftBehind && (
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-stellarBlue/10 border border-stellarBlue/25 space-y-1 sm:space-y-2">
                <div className="flex items-center gap-1.5 text-nebulaCyan text-[10px] sm:text-[11px] font-mono uppercase tracking-wider font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-nebulaCyan" />
                  <span>WHY LEFT BEHIND • HERITAGE</span>
                </div>
                <p className="text-[11px] sm:text-sm text-titanium leading-snug sm:leading-relaxed font-sans">
                  {artifactData.whyLeftBehind}
                </p>
              </div>
            )}

            {artifactData?.instruments && artifactData.instruments.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-dustGrey border-b border-titanium/15 pb-1.5 sm:pb-2 font-mono uppercase tracking-wider">
                  <span className="text-nebulaCyan flex items-center gap-1.5 font-semibold">
                    <Crosshair className="w-3.5 h-3.5" />
                    <span>SCIENTIFIC INSTRUMENTATION</span>
                  </span>
                  <span className="text-dustGrey">{artifactData.instruments.length} SENSORS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {artifactData.instruments.map((inst, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-deepSpace/50 border border-titanium/10 space-y-1"
                    >
                      <div className="flex items-center gap-1.5">
                        {getInstrumentIcon(inst.name, inst.role)}
                        <span className="text-[10px] sm:text-[11px] font-mono text-nebulaCyan font-semibold truncate">
                          {inst.name}
                        </span>
                      </div>
                      <span className="block text-[9px] sm:text-[11px] text-dustGrey font-sans leading-snug sm:leading-relaxed">
                        {inst.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {artifactData?.didYouKnow && artifactData.didYouKnow.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-dustGrey border-b border-titanium/15 pb-1.5 sm:pb-2 font-mono uppercase tracking-wider">
                  <span className="text-solarAmber flex items-center gap-1.5 font-semibold">
                    <Info className="w-3.5 h-3.5" />
                    <span>FIELD OBSERVATIONS</span>
                  </span>
                  <span className="text-dustGrey">HISTORICAL NOTES</span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {artifactData.didYouKnow.map((fact, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-solarAmber/10 border border-solarAmber/20 text-[10px] sm:text-xs text-solarAmber font-sans leading-snug sm:leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-solarAmber mt-1 shrink-0" />
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              onClick={handleTriggerExit}
              className="mt-4 sm:mt-6 p-2.5 sm:p-4 rounded-xl border border-titanium/20 bg-cosmicNavy/40 hover:bg-stellarBlue/20 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all text-center group"
            >
              <div className="flex items-center gap-1.5 text-nebulaCyan text-[10px] sm:text-[11px] font-mono uppercase tracking-wider">
                <span>Scroll down or tap to exit to orbital helix</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
              </div>
              <p className="text-[9px] sm:text-[11px] text-dustGrey font-sans tracking-wide">
                Eases out smoothly and resumes the 3D Space Shuttle corridor
              </p>
            </div>

            <div className="pt-1 sm:pt-2 flex justify-end">
              <button
                onClick={handleTriggerExit}
                className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 rounded-lg sm:rounded-xl bg-stellarBlue hover:bg-stellarBlue/90 text-lunarWhite text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(26,47,251,0.4)] cursor-pointer text-center"
              >
                RETURN TO SHUTTLE CORRIDOR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
