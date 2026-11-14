import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { IntroScene } from '../../types/journey';
import { IntroScene3D } from '../canvas/IntroScene3D';
import { CinematicIntroOverlay } from './CinematicIntroOverlay';

interface CinematicIntroProps {
  onComplete: () => void; // Transitions to Stage 1: Command Terminal
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  // Intro Timeline state
  const [currentScene, setCurrentScene] = useState<IntroScene>('awakening');
  const [activeSentinelIndex, setActiveSentinelIndex] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [timeInScene, setTimeInScene] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Audio synthesizer ref (Web Audio API for zero-external-asset instant cinematic ambient sound)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const TOTAL_DURATION = 44.0;

  // Initialize Web Audio cinematic hum & drone
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(isMuted ? 0 : 0.25, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Deep space sub-bass drone oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 note
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      osc1.connect(filter);
      filter.connect(masterGain);
      osc1.start();

      // Atmospheric harmonic shimmer oscillator
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(110, ctx.currentTime); // A2 note
      const osc2Gain = ctx.createGain();
      osc2Gain.gain.setValueAtTime(0.08, ctx.currentTime);
      osc2.connect(osc2Gain);
      osc2Gain.connect(masterGain);
      osc2.start();
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  }, [isMuted]);

  // Handle Mute toggle
  const handleToggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (gainNodeRef.current && audioCtxRef.current) {
        gainNodeRef.current.gain.setValueAtTime(next ? 0 : 0.25, audioCtxRef.current.currentTime);
      }
      return next;
    });
  }, []);

  // Update elapsed time & determine current scene at full 60fps/120fps display refresh rate
  useEffect(() => {
    if (!isPlaying) return;

    let lastTime = performance.now();
    let animId: number;

    const tick = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      setElapsedTime((prev) => {
        const next = prev + delta;

        if (next >= TOTAL_DURATION) {
          // Reached end of intro; stay on title-reveal with CTA
          return TOTAL_DURATION;
        }

        // Determine current scene from elapsed time
        if (next < 7.0) {
          if (currentScene !== 'awakening') setCurrentScene('awakening');
          setTimeInScene(next);
        } else if (next < 23.0) {
          if (currentScene !== 'sentinels') setCurrentScene('sentinels');
          const sentTime = next - 7.0;
          setTimeInScene(sentTime);
          const sIndex = Math.min(Math.floor(sentTime / 2.0), 7);
          setActiveSentinelIndex(sIndex);
        } else if (next < 30.0) {
          if (currentScene !== 'grand-exhibition') setCurrentScene('grand-exhibition');
          setTimeInScene(next - 23.0);
        } else if (next < 36.0) {
          if (currentScene !== 'planetary-reveal') setCurrentScene('planetary-reveal');
          setTimeInScene(next - 30.0);
        } else {
          if (currentScene !== 'title-reveal') setCurrentScene('title-reveal');
          setTimeInScene(next - 36.0);
        }

        return next;
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animId);
  }, [isPlaying, currentScene]);

  // Jump to specific scene from navigation
  const handleSelectScene = (scene: IntroScene) => {
    initAudio();
    setCurrentScene(scene);
    setTimeInScene(0);
    switch (scene) {
      case 'awakening':
        setElapsedTime(0);
        break;
      case 'sentinels':
        setElapsedTime(7.0);
        setActiveSentinelIndex(0);
        break;
      case 'grand-exhibition':
        setElapsedTime(23.0);
        break;
      case 'planetary-reveal':
        setElapsedTime(30.0);
        break;
      case 'title-reveal':
        setElapsedTime(36.0);
        break;
    }
  };

  // Skip Intro immediately to Stage 1 (Command Terminal)
  const handleSkip = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    onComplete();
  };

  // Replay Intro from start
  const handleReplay = () => {
    setElapsedTime(0);
    setTimeInScene(0);
    setCurrentScene('awakening');
    setActiveSentinelIndex(0);
    setIsPlaying(true);
  };

  // Enter the Archive from Scene 5 CTA
  const handleEnterArchive = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {}
    }
    onComplete();
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  const progress = Math.min(elapsedTime / TOTAL_DURATION, 1.0);

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden select-none"
      onClick={() => {
        // Unlock audio context on user interaction if needed
        initAudio();
      }}
      onWheel={(e) => {
        initAudio();
        if (e.deltaY > 35) {
          if (currentScene === 'title-reveal') {
            handleEnterArchive();
          } else {
            setElapsedTime((prev) => Math.min(TOTAL_DURATION, prev + 1.0));
          }
        } else if (e.deltaY < -35) {
          setElapsedTime((prev) => Math.max(0, prev - 1.0));
        }
      }}
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 14, 26], fov: 45 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        >
          <color attach="background" args={['#030712']} />
          <IntroScene3D
            scene={currentScene}
            activeSentinelIndex={activeSentinelIndex}
            timeInScene={timeInScene}
          />
        </Canvas>
      </div>

      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 bg-radial-gradient" />

      {/* HTML / DOM Control & Typography Overlay */}
      <CinematicIntroOverlay
        scene={currentScene}
        activeSentinelIndex={activeSentinelIndex}
        progress={progress}
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={() => {
          setIsPlaying((prev) => {
            const next = !prev;
            if (audioCtxRef.current) {
              if (!next && audioCtxRef.current.state === 'running') {
                audioCtxRef.current.suspend();
              } else if (next && audioCtxRef.current.state === 'suspended') {
                audioCtxRef.current.resume();
              }
            }
            return next;
          });
        }}
        onToggleMute={handleToggleMute}
        onSkip={handleSkip}
        onReplay={handleReplay}
        onSelectScene={handleSelectScene}
        onEnterArchive={handleEnterArchive}
      />
    </div>
  );
};
