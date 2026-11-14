import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, Sparkles, Bookmark, Layers } from 'lucide-react';
import { ArtifactPodiumViewer } from '../canvas/ArtifactPodiumViewer';
import narrationScripts from '../../data/narrationScripts.json';

interface SentinelDetailModalProps {
  sentinelId: string | null;
  onClose: () => void;
}

// Map Sentinel ID to the audio file present in public/audio/ (novo1, novo3, novo5, novo7)
const SENTINEL_AUDIO_MAP: Record<string, string> = {
  'opportunity-rover': '/audio/novo1.mp3',
  'ingenuity-helicopter': '/audio/novo2.mp3',
  'apollo-11-descent': '/audio/novo3.mp3',
  'insight-lander': '/audio/novo4.mp3',
  'apollo-15-lrv': '/audio/novo5.mp3',
  'sojourner-pathfinder': '/audio/novo6.mp3',
  'pioneer-10': '/audio/novo7.mp3',
  'surveyor-3': '/audio/novo8.mp3',
};

export const SentinelDetailModal: React.FC<SentinelDetailModalProps> = ({
  sentinelId,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [useSpeechFallback, setUseSpeechFallback] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sentinel = narrationScripts.find((s) => s.id === sentinelId);
  const audioSrc = sentinelId ? SENTINEL_AUDIO_MAP[sentinelId] : undefined;

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

  if (!sentinel) return null;

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
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else if (useSpeechFallback) {
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
    <div className="fixed inset-0 z-30 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
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

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950/95 border border-sky-500/30 rounded-2xl p-5 sm:p-7 shadow-[0_0_60px_rgba(56,189,248,0.25)] text-slate-100 font-mono">
        {/* Close Button */}
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
              window.speechSynthesis.cancel();
            }
            onClose();
          }}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors z-20"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badges & Metadata */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs pr-12">
          <span className="px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300 border border-sky-400/30 font-bold">
            {sentinel.celestialBody.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {sentinel.characterArchetype}
          </span>
          <span className="text-slate-400 flex items-center gap-1.5 ml-auto text-[11px]">
            <Bookmark className="w-3.5 h-3.5 text-sky-400" />
            DURATION: {formatTime(duration || sentinel.estimatedDurationSec)}
          </span>
        </div>

        {/* Sentinel Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-4">
          {sentinel.name}
        </h2>

        {/* 
          INTERACTIVE 3D ARTIFACT PODIUM
          Allows users to click, drag, orbit 360°, and zoom around the official NASA 3D model!
        */}
        <div className="mb-5">
          <ArtifactPodiumViewer sentinelId={sentinel.id} />
        </div>

        {/* 
          AUTHENTIC AUDIO NARRATION PLAYER
          Plays the voiceover files from public/audio/ (novo1, novo3, novo5, novo7)
        */}
        <div className="mb-5 p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Play / Pause Toggle Button */}
              <button
                onClick={handleTogglePlay}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wider transition-all shadow-md ${
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
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                title="Restart audio"
                aria-label="Restart audio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Audio Wave Activity Indicator */}
            <div className="flex items-center gap-3 text-xs text-sky-300 font-mono">
              <div className="flex items-center gap-1 h-4">
                {[4, 8, 14, 10, 6, 12, 5].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying ? 'bg-sky-400' : 'bg-slate-700'
                    }`}
                    style={{
                      height: isPlaying ? `${h}px` : '4px',
                      animation: isPlaying ? `pulse 0.8s ease-in-out infinite ${i * 0.1}s` : 'none',
                    }}
                  />
                ))}
              </div>
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-sky-400 animate-pulse' : 'text-slate-500'}`} />
              <span>
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
            <div className="flex items-center gap-3 text-xs text-slate-400">
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
        <div className="mb-5 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Core Takeaway for Young Explorers</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
            {sentinel.takeawayForKids}
          </p>
        </div>

        {/* Full First-Person Narration Monologue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
            <span className="font-bold tracking-widest text-sky-400 uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>FIRST-PERSON MONOLOGUE & SOUND CUES</span>
            </span>
            <span className="text-[11px] text-slate-400">AUTHENTIC SCRIPT</span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
            {sentinel.directorScript}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider transition-colors"
          >
            RETURN TO SHUTTLE CORRIDOR
          </button>
        </div>
      </div>
    </div>
  );
};
