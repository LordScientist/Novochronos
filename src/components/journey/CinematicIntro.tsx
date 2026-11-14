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
        src="/audio/intro-narration.mp3"
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
      />

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
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md pointer-events-auto">
          <div className="max-w-md mx-auto text-center px-6 py-8 rounded-2xl bg-slate-950/90 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <span className="font-mono text-[10px] tracking-[0.3em] text-amber-400 font-bold uppercase block mb-2">
              STAGE 0 // NASA SPACE APPS ARCHIVE
            </span>
            <h1 className="font-orbitron text-2xl sm:text-3xl font-black text-white tracking-wider mb-2">
              NOVOCHRONOS
            </h1>
            <p className="font-sans text-xs text-slate-300 mb-6 leading-relaxed">
              Experience the cinematic 3D exhibition with authentic narration voiceover.
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                startAudio();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_40px_rgba(245,158,11,0.7)] flex items-center justify-center gap-2.5 cursor-pointer group hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START CINEMATIC INTRODUCTION</span>
            </button>
            <span className="font-mono text-[10px] text-slate-500 block mt-3">
              Click anywhere on screen to enable audio
            </span>
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
