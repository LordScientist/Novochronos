import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { Play } from 'lucide-react';
import { IntroScene } from '../../types/journey';
import { IntroScene3D } from '../canvas/IntroScene3D';
import { CinematicIntroOverlay } from './CinematicIntroOverlay';
import {
  INTRO_AUDIO_DURATION,
  getCueForTimestamp,
} from '../../data/introAudioSync';

interface CinematicIntroProps {
  onComplete: () => void; // Transitions to Stage 1: Command Terminal
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Narration Voiceover Audio Element ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);

  // Derive active sync cue, scene, and sentinel from the exact audio timestamp
  const activeCue = getCueForTimestamp(currentTime);
  const currentScene = activeCue.scene;
  const activeSentinelIndex = activeCue.sentinelIndex ?? 0;

  // Exact start timestamps for each scene (aligned with spoken voiceover)
  const sceneStartTimes: Record<IntroScene, number> = {
    'awakening': 0.0,
    'sentinels': 11.5,
    'grand-exhibition': 55.5,
    'planetary-reveal': 65.5,
    'title-reveal': 74.5,
  };
  const timeInScene = Math.max(0, currentTime - sceneStartTimes[currentScene]);

  // Master Clock: High-precision 60fps loop synced to narration audio.currentTime
  useEffect(() => {
    const updateLoop = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        setCurrentTime(audio.currentTime);
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Primary function to start voiceover playback with full user gesture compliance
  const startAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 1.0;
    audio.muted = isMuted;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setHasStarted(true);
        })
        .catch((err) => {
          console.warn('Audio playback waiting for direct user gesture:', err);
        });
    }
  }, [isMuted]);

  // Attempt autoplay on mount (succeeds if browser has high user engagement or permission)
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0;
      audio.muted = false;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasStarted(true);
          })
          .catch(() => {
            // Browser autoplay policy requires user gesture; show start prompt
            setIsPlaying(false);
            setHasStarted(false);
          });
      }
    }
  }, []);

  // Handle Play/Pause toggle
  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  // Handle Mute toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      return next;
    });
  }, []);

  // Handle seeking / scrubbing across the timeline
  const handleSeek = useCallback((targetSec: number) => {
    const clamped = Math.max(0, Math.min(targetSec, INTRO_AUDIO_DURATION));
    if (audioRef.current) {
      audioRef.current.currentTime = clamped;
    }
    setCurrentTime(clamped);
  }, []);

  // Jump to specific scene
  const handleSelectScene = useCallback((scene: IntroScene) => {
    const target = sceneStartTimes[scene];
    handleSeek(target);
    const audio = audioRef.current;
    if (audio && audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    }
  }, [handleSeek]);

  // Skip Intro immediately to Stage 1 (Command Terminal)
  const handleSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onComplete();
  }, [onComplete]);

  // Replay Intro from start
  const handleReplay = useCallback(() => {
    handleSeek(0);
    const audio = audioRef.current;
    if (audio) {
      audio.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
      }).catch(() => {});
    }
  }, [handleSeek]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const progress = Math.min(currentTime / INTRO_AUDIO_DURATION, 1.0);

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onClick={() => {
        // Any click on the viewport starts voiceover playback if not yet started
        if (!hasStarted) {
          startAudio();
        }
      }}
    >
      {/* Authentic Master Narration Audio Element (NO SYNTH / NO BUZZING) */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        onPlay={() => {
          setIsPlaying(true);
          setHasStarted(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentTime(INTRO_AUDIO_DURATION);
        }}
      >
        <source src="/audio/intro.mpeg" type="audio/mpeg" />
        <source src="/audio/intro-narration.mp3" type="audio/mpeg" />
      </audio>

      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 15, 27], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#030712']} />
          <IntroScene3D
            scene={currentScene}
            activeSentinelIndex={activeSentinelIndex}
            timeInScene={timeInScene}
            currentTime={currentTime}
          />
        </Canvas>
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-gradient" />

      {/* Initial Start Prompt (Displayed only when browser blocks unprompted autoplay) */}
      {!hasStarted && (
        <div
          onClick={startAudio}
          className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/10 pointer-events-auto cursor-pointer p-4 transition-all duration-500"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
              startAudio();
            }}
            className="relative max-w-md w-full mx-auto text-center px-8 py-7 rounded-2xl bg-slate-950/40 border border-white/20 backdrop-blur-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_30px_rgba(56,189,248,0.12)] hover:border-amber-400/40 transition-all duration-300"
          >
            {/* Top Micro-Tag */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase">
                STAGE 0 // NASA SPACE APPS ARCHIVE
              </span>
            </div>

            <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-wider mb-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              NOVOCHRONOS
            </h1>
            <p className="font-sans text-xs text-slate-200/90 mb-5 leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              Experience humanity's interplanetary pioneers in 3D with authentic spoken narration.
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startAudio();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_40px_rgba(245,158,11,0.8)] flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950 group-hover:scale-110 transition-transform" />
              <span>START CINEMATIC INTRODUCTION</span>
            </button>

            <div className="flex items-center justify-center gap-1.5 mt-3.5 font-mono text-[11px] text-slate-300/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              <span>🔊</span>
              <span>Click anywhere on screen to begin</span>
            </div>
          </div>
        </div>
      )}

      {/* HTML / DOM Control & Typography Overlay */}
      <CinematicIntroOverlay
        scene={currentScene}
        activeSentinelIndex={activeSentinelIndex}
        currentTime={currentTime}
        duration={INTRO_AUDIO_DURATION}
        progress={progress}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={handleTogglePlay}
        onToggleMute={handleToggleMute}
        onSeek={handleSeek}
        onSkip={handleSkip}
        onReplay={handleReplay}
        onSelectScene={handleSelectScene}
        onEnterArchive={handleSkip}
      />
    </div>
  );
};
