import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
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
  // Audio & Master clock state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const rafRef = useRef<number | null>(null);

  // Background ambient synthesizer (Web Audio API) for rich sub-bass depth beneath the narration
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Derive active sync cue, scene, and sentinel from the exact audio timestamp
  const activeCue = getCueForTimestamp(currentTime);
  const currentScene = activeCue.scene;
  const activeSentinelIndex = activeCue.sentinelIndex ?? 0;

  // Calculate time within current scene
  const sceneStartTimes: Record<IntroScene, number> = {
    'awakening': 0.0,
    'sentinels': 11.8,
    'grand-exhibition': 55.5,
    'planetary-reveal': 65.5,
    'title-reveal': 74.5,
  };
  const timeInScene = Math.max(0, currentTime - sceneStartTimes[currentScene]);

  // High-precision synchronization loop driven by requestAnimationFrame
  useEffect(() => {
    const updateLoop = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
      rafRef.current = requestAnimationFrame(updateLoop);
    };

    rafRef.current = requestAnimationFrame(updateLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Initialize Web Audio sub-bass drone
  const initAmbientSynth = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.12, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Sub-bass drone oscillator (55Hz A1)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, ctx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();

      // Soft cosmic harmonic shimmer (110Hz A2)
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime);
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.04, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(masterGain);
      osc2.start();
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  }, [isMuted]);

  // Attempt autoplay on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            initAmbientSynth();
          })
          .catch(() => {
            // Browser autoplay policy blocked unprompted audio; wait for user gesture
            setIsPlaying(false);
          });
      }
    }
  }, [initAmbientSynth]);

  // Handle Play/Pause toggle
  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    initAmbientSynth();

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
    } else {
      audio.pause();
      setIsPlaying(false);
      if (audioCtxRef.current && audioCtxRef.current.state === 'running') {
        audioCtxRef.current.suspend();
      }
    }
  }, [initAmbientSynth]);

  // Handle Mute toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (audioRef.current) {
        audioRef.current.muted = next;
      }
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(next ? 0 : 0.12, audioCtxRef.current.currentTime);
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
    initAmbientSynth();
    const target = sceneStartTimes[scene];
    handleSeek(target);
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [handleSeek, initAmbientSynth]);

  // Skip Intro immediately to Stage 1 (Command Terminal)
  const handleSkip = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    onComplete();
  }, [onComplete]);

  // Replay Intro from start
  const handleReplay = useCallback(() => {
    handleSeek(0);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [handleSeek]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  const progress = Math.min(currentTime / INTRO_AUDIO_DURATION, 1.0);

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onClick={() => {
        // Unlock audio on first user click if autoplay was initially blocked
        if (audioRef.current && audioRef.current.paused && !isPlaying) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
          initAmbientSynth();
        }
      }}
    >
      {/* Authentic Master Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/intro-narration.mp3"
        preload="auto"
        playsInline
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          // Set position to title-reveal completion state
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
