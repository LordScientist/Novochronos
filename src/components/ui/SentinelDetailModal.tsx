import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Sparkles,
  Bookmark,
  Layers,
  ChevronDown,
  Compass,
  Award,
  Cpu,
  ShieldCheck,
} from 'lucide-react';
import { ArtifactPodiumViewer } from '../canvas/ArtifactPodiumViewer';
import narrationScripts from '../../data/narrationScripts.json';
import { ARTIFACTS } from '../../data/artifacts';

interface SentinelDetailModalProps {
  sentinelId: string | null;
  onClose: () => void;
}

// Map Sentinel ID to the authentic audio recordings in public/audio/
// Odd-numbered sentinels (1, 3, 5, 7) and Even-numbered sentinels (2, 4, 6, 8)
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

export const SentinelDetailModal: React.FC<SentinelDetailModalProps> = ({
  sentinelId,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

  // Transition and scroll-to-finish states
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

  // Clean all sound/voice bracketed director cues to convey only pure text
  const cleanStoryText = sentinel
    ? (sentinel.ttsCleanScript || sentinel.directorScript)
        .replace(/\[(?:Sound|Voice|Pause)[^\]]*\]/gi, '')
        .replace(/\[.*?\]/g, '')
        .trim()
    : '';

  // Manage smooth entrance transition when sentinelId changes
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

  // Dedicated Lenis instance for smooth modal dossier inspection
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
      // Reaching the bottom of the card dossier and scrolling down triggers smooth ease exit
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

  // Smooth exit ease animation handler
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

    // Wait for the exit ease animation (400ms) to complete, then return to helix
    setTimeout(() => {
      setIsRendered(false);
      setIsExiting(false);
      exitTriggeredRef.current = false;
      onClose();
    }, 400);
  };

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleTriggerExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cleanup audio or speech synthesis when switching or closing
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

  // Dedicated wheel scroll handler for page: when scroll reaches bottom, ease-exit
  const handleContainerWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || exitTriggeredRef.current || isExiting) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    // Scrolling down further past bottom finishes the page and triggers ease-exit
    if (isAtBottom && e.deltaY > 15) {
      exitTriggeredRef.current = true;
      handleTriggerExit();
    }
  };

  // Touch handlers for mobile scroll-to-finish
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = scrollContainerRef.current;
    if (!container || exitTriggeredRef.current || isExiting) return;

    const diff = touchStartYRef.current - e.touches[0].clientY;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10;

    // Upward swipe at bottom (downward scroll past end)
    if (isAtBottom && diff > 35) {
      exitTriggeredRef.current = true;
      handleTriggerExit();
    }
  };

  // Toggle play/pause for MP3 audio with automatic Web Speech fallback
  const handleTogglePlay = () => {
    if (useSpeechFallback) {
      // SpeechSynthesis playback
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(sentinel.ttsCleanScript);
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
          // If MP3 fails or is not found on disk, fallback to Web Speech API
          setUseSpeechFallback(true);
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(sentinel.ttsCleanScript);
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
      const utterance = new SpeechSynthesisUtterance(sentinel.ttsCleanScript);
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
        // Clicking backdrop triggers ease-exit
        if (e.target === e.currentTarget) {
          handleTriggerExit();
        }
      }}
    >
      {/* Hidden HTML5 Audio Element */}
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

      {/* 
        Isolated Editorial Split Dossier Container:
        - Desktop: 2-Column Split (Left: Sticky 3D Viewer + Telemetry; Right: Scrollable Story, Breakthroughs, Audio, Facts)
        - Mobile / Tablet: Compact, balanced vertical flow perfectly scaled to fit mobile screens
        - Typographic hierarchy: Swiss Neo-Grotesque
      */}
      <div
        ref={scrollContainerRef}
        onWheel={handleContainerWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative w-full max-w-6xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain bg-slate-950/95 border border-sky-500/30 rounded-xl sm:rounded-2xl p-3 xs:p-4 sm:p-6 md:p-8 shadow-[0_0_80px_rgba(56,189,248,0.2)] text-slate-100 font-sans transform transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${
          isVisible && !isExiting
            ? 'scale-100 opacity-100 translate-y-0'
            : isExiting
            ? 'scale-95 opacity-0 -translate-y-8'
            : 'scale-90 opacity-0 translate-y-10'
        }`}
      >
        {/* Floating Close Button */}
        <button
          onClick={handleTriggerExit}
          className="absolute top-2.5 right-2.5 sm:top-5 sm:right-5 p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          aria-label="Close dossier"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Top Header Bar: Editorial Kicker & Index */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-5 pb-2 sm:pb-3 border-b border-white/10 pr-9 sm:pr-12">
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-heading font-normal tracking-[0.16em] sm:tracking-[0.2em] text-sky-400 uppercase">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-sky-400 animate-pulse" />
            <span>NASA HISTORIC ARTIFACT DOSSIER • {indexStr}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[11px] font-sans font-light tracking-[0.14em] sm:tracking-[0.16em] uppercase text-slate-400">
            <Bookmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
            <span>{artifactData?.status || 'PERMANENT ARCHIVE'}</span>
          </div>
        </div>

        {/* EDITORIAL 2-COLUMN SPLIT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* ========================================================
              LEFT COLUMN: STICKY 3D VIEWER + TELEMETRY MICRO-DOSSIER
             ======================================================== */}
          <div className="lg:col-span-5 lg:sticky lg:top-0 space-y-2.5 sm:space-y-4">
            
            {/* Title & Archetype Header */}
            <div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2 text-[9px] sm:text-xs">
                <span className="px-2 sm:px-2.5 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                  {sentinel.celestialBody}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 font-sans font-light tracking-[0.12em] sm:tracking-[0.14em] uppercase">
                  {sentinel.characterArchetype}
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

            {/* Interactive 3D Artifact Podium */}
            <div className="relative group">
              <ArtifactPodiumViewer sentinelId={sentinel.id} />
            </div>

            {/* Micro-Telemetry Grid */}
            <div className="p-2.5 sm:p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-2 sm:space-y-3">
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
                <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5">
                  <span className="block text-[9px] sm:text-[10px] font-heading font-normal tracking-[0.14em] sm:tracking-[0.16em] uppercase text-slate-400 mb-0.5">
                    PLANNED LIFESPAN
                  </span>
                  <span className="font-mono text-slate-200 font-medium text-[10px] sm:text-xs">
                    {artifactData?.missionLifespan.planned || 'Design Phase'}
                  </span>
                </div>
                <div className="p-2 sm:p-2.5 rounded-lg bg-sky-950/30 border border-sky-500/20">
                  <span className="block text-[9px] sm:text-[10px] font-heading font-normal tracking-[0.14em] sm:tracking-[0.16em] uppercase text-sky-400 mb-0.5">
                    ACTUAL LIFESPAN
                  </span>
                  <span className="font-mono text-sky-200 font-semibold text-[10px] sm:text-xs">
                    {artifactData?.missionLifespan.actual || 'Operational'}
                  </span>
                </div>
              </div>

              {artifactData?.landingSite && (
                <div className="p-2 sm:p-2.5 rounded-lg bg-black/40 border border-white/5 text-xs">
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

          {/* ========================================================
              RIGHT COLUMN: SCROLLABLE NARRATIVE FEED & RESEARCH DOSSIER
             ======================================================== */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5">
            
            {/* Authentic Audio Narration Player */}
            <div className="p-2.5 sm:p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 shadow-[0_0_24px_rgba(56,189,248,0.12)]">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto">
                  {/* Play / Pause Toggle Button */}
                  <button
                    onClick={handleTogglePlay}
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-heading font-bold tracking-wider transition-all shadow-md ${
                      isPlaying
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                        : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
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

                  {/* Restart Button */}
                  <button
                    onClick={handleRestart}
                    className="p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Restart audio"
                    aria-label="Restart audio"
                  >
                    <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>

                {/* Audio Wave Activity Indicator */}
                <div className="flex items-center gap-1.5 sm:gap-3 text-[10px] sm:text-xs text-sky-300 font-mono">
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
                  <Volume2 className={`w-3 h-3 sm:w-4 sm:h-4 ${isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
                  <span className="truncate text-[10px] sm:text-xs">
                    {useSpeechFallback
                      ? 'VOICEOVER READY (SPEECH)'
                      : audioSrc
                      ? 'RECORDED NARRATION'
                      : 'VOICEOVER AUDIO READY'}
                  </span>
                </div>
              </div>

              {/* Interactive Audio Scrubber Bar */}
              {!useSpeechFallback && (
                <div className="flex items-center gap-1.5 sm:gap-3 text-[9px] sm:text-xs text-slate-400 pt-0.5">
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

            {/* Student Takeaway Card */}
            <div className="p-2.5 sm:p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex items-center gap-1.5 text-amber-400 text-[9px] sm:text-[11px] font-heading font-normal uppercase tracking-[0.14em] sm:tracking-[0.16em] mb-0.5 sm:mb-1">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Core Takeaway for Young Explorers</span>
              </div>
              <p className="text-[11px] sm:text-sm text-amber-100/90 leading-snug sm:leading-relaxed font-sans font-light">
                {sentinel.takeawayForKids}
              </p>
            </div>

            {/* First-Person Authentic Story Monologue */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                <span className="text-sky-400 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>FIRST-PERSON PERSPECTIVE</span>
                </span>
                <span className="text-slate-400">AUTHENTIC MONOLOGUE</span>
              </div>

              <div className="p-3 sm:p-4 md:p-5 rounded-xl bg-black/60 border border-white/10 text-[11px] sm:text-sm leading-normal sm:leading-relaxed text-slate-200 font-sans font-light space-y-2 sm:space-y-3">
                {cleanStoryText.split('\n\n').map((paragraph, idx) => (
                  <p key={idx} className="leading-normal sm:leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Historic Breakthroughs & Milestones */}
            {artifactData?.breakthroughs && artifactData.breakthroughs.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>HISTORIC BREAKTHROUGHS</span>
                  </span>
                  <span className="text-slate-400">{artifactData.breakthroughs.length} ACHIEVEMENTS</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 sm:gap-2">
                  {artifactData.breakthroughs.map((breakthrough, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/40 border border-white/5 text-[10px] sm:text-xs text-slate-200 font-sans font-light leading-snug sm:leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                      <span>{breakthrough}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why Left Behind / Preserving Humanity's Heritage */}
            {artifactData?.whyLeftBehind && (
              <div className="p-2.5 sm:p-3.5 rounded-xl bg-slate-900/50 border border-sky-500/20 space-y-1 sm:space-y-2">
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
                  <span className="text-purple-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>SCIENTIFIC INSTRUMENTATION</span>
                  </span>
                  <span className="text-slate-400">{artifactData.instruments.length} SENSORS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {artifactData.instruments.map((inst, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-slate-900/40 border border-white/5 space-y-0.5"
                    >
                      <span className="block text-[10px] sm:text-[11px] font-mono text-sky-300 font-medium">
                        {inst.name}
                      </span>
                      <span className="block text-[9px] sm:text-[11px] text-slate-400 font-sans font-light leading-snug sm:leading-relaxed">
                        {inst.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Did You Know? Trivia */}
            {artifactData?.didYouKnow && artifactData.didYouKnow.length > 0 && (
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-400 border-b border-white/10 pb-1.5 sm:pb-2 font-heading font-normal tracking-[0.16em] sm:tracking-[0.18em] uppercase">
                  <span className="text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>DID YOU KNOW?</span>
                  </span>
                  <span className="text-slate-400">EXPLORER TRIVIA</span>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {artifactData.didYouKnow.map((fact, idx) => (
                    <div
                      key={idx}
                      className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-950/15 border border-amber-500/20 text-[10px] sm:text-xs text-amber-100/90 font-sans font-light leading-snug sm:leading-relaxed"
                    >
                      {fact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Scroll-to-Finish Exit Cue (Active Theory Interaction Pattern) */}
            <div
              onClick={handleTriggerExit}
              className="mt-4 sm:mt-6 p-2.5 sm:p-4 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 cursor-pointer flex flex-col items-center justify-center gap-1 transition-all text-center group"
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
  );
};
