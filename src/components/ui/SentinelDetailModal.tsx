import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Bookmark, Layers, ChevronDown } from 'lucide-react';
import { ArtifactPodiumViewer } from '../canvas/ArtifactPodiumViewer';
import narrationScripts from '../../data/narrationScripts.json';

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
      className={`fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md transition-all duration-400 ease-out ${
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
        Isolated Page Container with smooth transitions:
        - When opening: scales and fades in from scale(0.90) to scale(1.0)
        - When exiting: eases out from scale(1.0) to scale(0.95) with upward drift
        - Contains overscroll-contain so wheel events belong strictly to this page
      */}
      <div
        ref={scrollContainerRef}
        onWheel={handleContainerWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className={`relative w-full max-w-4xl max-h-[94vh] sm:max-h-[92vh] overflow-y-auto overscroll-contain bg-slate-950/95 border border-sky-500/30 rounded-2xl p-4 sm:p-7 shadow-[0_0_60px_rgba(56,189,248,0.25)] text-slate-100 font-mono transform transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) ${
          isVisible && !isExiting
            ? 'scale-100 opacity-100 translate-y-0'
            : isExiting
            ? 'scale-95 opacity-0 -translate-y-8'
            : 'scale-90 opacity-0 translate-y-10'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleTriggerExit}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Metadata */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 text-[10px] sm:text-xs pr-10 sm:pr-12">
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
            {sentinel.celestialBody.toUpperCase()}
          </span>
          <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {sentinel.characterArchetype}
          </span>
          <span className="text-slate-400 flex items-center gap-1.5 ml-auto text-[10px] sm:text-[11px]">
            <Bookmark className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-sky-400" />
            DURATION: {formatTime(duration || sentinel.estimatedDurationSec)}
          </span>
        </div>

        {/* Sentinel Title */}
        <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3 sm:mb-4">
          {sentinel.name}
        </h2>

        {/* 
          INTERACTIVE 3D ARTIFACT PODIUM
          Allows users to click, drag, orbit 360°, and zoom around the official NASA 3D model!
        */}
        <div className="mb-4 sm:mb-5">
          <ArtifactPodiumViewer sentinelId={sentinel.id} />
        </div>

        {/* 
          AUTHENTIC AUDIO NARRATION PLAYER
          Plays the voiceover files from public/audio/ (novo1, novo3, novo5, novo7)
        */}
        <div className="mb-4 sm:mb-5 p-3 sm:p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={handleTogglePlay}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all shadow-md ${
                  isPlaying
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                    : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>PAUSE NARRATION</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>LISTEN TO STORY</span>
                  </>
                )}
              </button>

              {/* Restart Button */}
              <button
                onClick={handleRestart}
                className="p-2 sm:p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Restart audio"
                aria-label="Restart audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Wave Activity Indicator */}
            <div className="flex items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-sky-300 font-mono">
              <div className="flex items-center gap-1 h-3.5 sm:h-4">
                {[4, 8, 14, 10, 6, 12, 5].map((h, i) => (
                  <span
                    key={i}
                    className={`w-0.5 sm:w-1 rounded-full transition-all duration-200 ${
                      isPlaying ? 'bg-sky-400' : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying ? `${h}px` : '4px',
                      animation: isPlaying ? `pulse 0.8s ease-in-out infinite ${i * 0.1}s` : 'none',
                    }}
                  />
                ))}
              </div>
              <Volume2 className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="truncate">
                {useSpeechFallback
                  ? 'VOICEOVER READY (SPEECH)'
                  : audioSrc
                  ? 'OFFICIAL RECORDED NARRATION'
                  : 'VOICEOVER AUDIO READY'}
              </span>
            </div>
          </div>

          {/* Interactive Audio Scrubber Bar */}
          {!useSpeechFallback && (
            <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400">
              <span className="text-white font-mono">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || sentinel.estimatedDurationSec}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
              />
              <span className="font-mono">{formatTime(duration || sentinel.estimatedDurationSec)}</span>
            </div>
          )}
        </div>

        {/* Student Takeaway Card */}
        <div className="mb-4 sm:mb-5 p-3.5 sm:p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>Core Takeaway for Young Explorers</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
            {sentinel.takeawayForKids}
          </p>
        </div>

        {/* Full First-Person Authentic Story (Conveys only clean narrative text) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-400 border-b border-white/10 pb-2">
            <span className="font-bold tracking-widest text-sky-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>FIRST-PERSON PERSPECTIVE</span>
            </span>
            <span className="text-[10px] sm:text-[11px] text-slate-400">AUTHENTIC STORY</span>
          </div>

          <div className="p-3.5 sm:p-5 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm leading-relaxed text-slate-200 font-sans">
            <p className="whitespace-pre-line leading-relaxed">{cleanStoryText}</p>
          </div>
        </div>

        {/* 
          End of Page: Scroll-to-Finish Exit Cue (Active Theory Interaction Pattern)
          Finishing the scroll of the page triggers ease-exit back to the 3D helix
        */}
        <div
          onClick={handleTriggerExit}
          className="mt-5 sm:mt-6 p-3.5 sm:p-4 rounded-xl border border-sky-500/30 bg-sky-950/40 hover:bg-sky-900/50 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-all text-center group"
        >
          <div className="flex items-center gap-2 text-sky-400 font-mono text-[11px] sm:text-xs font-bold uppercase tracking-widest">
            <span>Scroll down or click to exit to orbital helix</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform animate-bounce" />
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 font-mono">
            Eases out smoothly and resumes the 3D Space Shuttle corridor
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="mt-4 sm:mt-5 flex justify-end">
          <button
            onClick={handleTriggerExit}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider transition-colors text-center"
          >
            RETURN TO SHUTTLE CORRIDOR
          </button>
        </div>
      </div>
    </div>
  );
};
