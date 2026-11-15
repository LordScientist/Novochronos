import React, { useState, useRef, useCallback, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Volume2, VolumeX, Play, Pause, RotateCcw, ArrowRight, ArrowDown } from 'lucide-react';
import { gsap } from 'gsap';
import { LusionAstronautScene } from '../canvas/LusionAstronautScene';

interface LusionHeroPageProps {
  onComplete: () => void;
  isAudioAllowed: boolean;
  isMuted: boolean;
  onEnableAudio: () => void;
  onToggleMute: () => void;
}

export const LusionHeroPage: React.FC<LusionHeroPageProps> = ({
  onComplete,
  isAudioAllowed,
  isMuted,
  onEnableAudio,
  onToggleMute,
}) => {
  // Master GSAP-driven scroll progress: 0.00 (Landing) -> 1.00 (Supernova Complete)
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const progressProxyRef = useRef<{ value: number }>({ value: 0 });
  const hasTriggeredCompleteRef = useRef<boolean>(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // Cinematic Auto-Play state
  const [isPlayingCinematic, setIsPlayingCinematic] = useState<boolean>(false);

  // Mouse Parallax & Dynamic 3D Tilt
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [tabletTilt, setTabletTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });

  // ---------------------------------------------------------------------------
  // SYNC GSAP PROGRESS PROXY TO REACT STATE & TRANSITION COMPLETION
  // ---------------------------------------------------------------------------
  const updateProgress = useCallback(
    (val: number) => {
      const clamped = Math.max(0, Math.min(1.0, val));
      progressProxyRef.current.value = clamped;
      setScrollProgress(clamped);

      // Trigger transition once dive completes
      if (clamped >= 0.985 && !hasTriggeredCompleteRef.current) {
        hasTriggeredCompleteRef.current = true;
        onComplete();
      }
    },
    [onComplete]
  );

  // ---------------------------------------------------------------------------
  // INTERACTIVE WHEEL & TOUCH SCRUBBING VIA GSAP TWEEN
  // ---------------------------------------------------------------------------
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (isPlayingCinematic) {
        setIsPlayingCinematic(false);
        tweenRef.current?.kill();
      }

      const delta = e.deltaY;
      const step = delta > 0 ? Math.min(0.12, delta * 0.0006) : Math.max(-0.12, delta * 0.0006);
      const target = Math.max(0, Math.min(1.0, progressProxyRef.current.value + step));

      // GSAP smooth scrub tween
      tweenRef.current?.kill();
      tweenRef.current = gsap.to(progressProxyRef.current, {
        value: target,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: () => {
          updateProgress(progressProxyRef.current.value);
        },
      });

      if (!isAudioAllowed && delta > 0) {
        onEnableAudio();
      }
    },
    [isPlayingCinematic, isAudioAllowed, onEnableAudio, updateProgress]
  );

  const touchStartYRef = useRef<number>(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isPlayingCinematic) {
      setIsPlayingCinematic(false);
      tweenRef.current?.kill();
    }
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchY = e.touches[0].clientY;
    const deltaY = touchStartYRef.current - touchY;
    touchStartYRef.current = touchY;

    const step = deltaY * 0.0022;
    const target = Math.max(0, Math.min(1.0, progressProxyRef.current.value + step));

    tweenRef.current?.kill();
    tweenRef.current = gsap.to(progressProxyRef.current, {
      value: target,
      duration: 0.35,
      ease: 'power1.out',
      onUpdate: () => {
        updateProgress(progressProxyRef.current.value);
      },
    });

    if (!isAudioAllowed && deltaY > 0) {
      onEnableAudio();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = (e.clientY / window.innerHeight) * 2 - 1;

    setPointerPos({ x: normX, y: normY });

    // Subtle 3D tilt for iPad chassis in landing phase
    setTabletTilt({
      rotateX: -normY * 9.0,
      rotateY: normX * 10.5,
    });
  };

  // ---------------------------------------------------------------------------
  // CINEMATIC AUTO-PLAY DIVE VIA GSAP
  // ---------------------------------------------------------------------------
  const handleTogglePlayCinematic = () => {
    if (!isAudioAllowed) {
      onEnableAudio();
    }

    if (isPlayingCinematic) {
      // Pause
      setIsPlayingCinematic(false);
      tweenRef.current?.pause();
    } else {
      // Play
      setIsPlayingCinematic(true);
      tweenRef.current?.kill();

      if (progressProxyRef.current.value >= 0.96) {
        progressProxyRef.current.value = 0;
        hasTriggeredCompleteRef.current = false;
      }

      const remainingDistance = 1.0 - progressProxyRef.current.value;
      const duration = remainingDistance * 14.0; // ~14s for full filmic dive

      tweenRef.current = gsap.to(progressProxyRef.current, {
        value: 1.0,
        duration: Math.max(1.5, duration),
        ease: 'none',
        onUpdate: () => {
          updateProgress(progressProxyRef.current.value);
        },
        onComplete: () => {
          setIsPlayingCinematic(false);
        },
      });
    }
  };

  const handleResetToStart = () => {
    setIsPlayingCinematic(false);
    tweenRef.current?.kill();
    hasTriggeredCompleteRef.current = false;

    gsap.to(progressProxyRef.current, {
      value: 0.0,
      duration: 0.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        updateProgress(progressProxyRef.current.value);
      },
    });
  };

  const handleSeek = (ratio: number) => {
    setIsPlayingCinematic(false);
    tweenRef.current?.kill();
    const target = Math.max(0, Math.min(1.0, ratio));

    gsap.to(progressProxyRef.current, {
      value: target,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        updateProgress(progressProxyRef.current.value);
      },
    });

    if (!isAudioAllowed) {
      onEnableAudio();
    }
  };

  // ---------------------------------------------------------------------------
  // VIEWPORT CLIPPING & DISSOLVE MECHANICS
  // WebGL Canvas is ALWAYS fixed full-screen (100vw x 100vh).
  // At scrollProgress = 0, it is masked inside the centered iPad rect.
  // As scrollProgress advances, the mask smoothly expands to full screen!
  // ---------------------------------------------------------------------------
  const expandT = Math.min(1, Math.max(0, scrollProgress / 0.35));
  const easedExpand = Math.sin((expandT * Math.PI) / 2);

  const insetY = (1 - easedExpand) * 24;
  const insetX = (1 - easedExpand) * 26;
  const cornerRadius = (1 - easedExpand) * 44;

  const clipPathStyle =
    expandT >= 0.99
      ? 'none'
      : `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${cornerRadius}px)`;

  const bezelOpacity = Math.max(0, 1 - expandT * 1.6);
  const bezelScale = 1.0 + expandT * 0.35;

  // Editorial UI fade and glide physics
  const uiOpacity = Math.max(0, 1 - scrollProgress * 3.2);
  const uiTranslateY = scrollProgress * 70;

  const whiteCanvasOpacity = Math.max(0, 1 - Math.pow(scrollProgress * 2.2, 1.2));

  const supernovaFlashOpacity =
    scrollProgress > 0.88 ? Math.min(1, Math.pow((scrollProgress - 0.88) / 0.12, 1.8) * 1.6) : 0;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden select-none font-sans bg-black"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onMouseMove={handleMouseMove}
    >
      {/* 
        -------------------------------------------------------------
        1. BASE WHITE CANVAS LAYER (Dissolves into Cosmic Void)
        -------------------------------------------------------------
      */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
        style={{
          backgroundColor: '#fafafa',
          opacity: whiteCanvasOpacity,
        }}
      />

      {/* 
        -------------------------------------------------------------
        2. THE ICONIC FLOWING CYAN / TURQUOISE NEON RIBBON
        Matches Frame 001 of lucio.webm
        -------------------------------------------------------------
      */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300 overflow-visible z-10"
        style={{ opacity: whiteCanvasOpacity * 0.9 }}
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lusionRibbonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.65" />
          </linearGradient>
          <filter id="ribbonBlur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="25" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          d="M 180 80 C 450 -40, 850 120, 880 340 C 910 560, 680 880, 480 860 C 280 840, 220 540, 420 420 C 620 300, 1150 200, 1750 480"
          stroke="url(#lusionRibbonGradient)"
          strokeWidth="60"
          strokeLinecap="round"
          filter="url(#ribbonBlur)"
          opacity="0.35"
        />
        <path
          d="M 180 80 C 450 -40, 850 120, 880 340 C 910 560, 680 880, 480 860 C 280 840, 220 540, 420 420 C 620 300, 1150 200, 1750 480"
          stroke="url(#lusionRibbonGradient)"
          strokeWidth="36"
          strokeLinecap="round"
          opacity="0.85"
        />
      </svg>

      {/* 
        -------------------------------------------------------------
        3. TOP BRAND NAVIGATION BAR (Clean, Minimal, Non-Intrusive)
        -------------------------------------------------------------
      */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 sm:px-12 py-6 pointer-events-auto">
        <div className="flex items-center gap-3">
          <span
            className="font-heading font-black tracking-tight text-lg md:text-2xl uppercase transition-colors duration-500"
            style={{ color: whiteCanvasOpacity > 0.4 ? '#171717' : '#ffffff' }}
          >
            NOVOCHRONOS
          </span>
          <span className="text-neutral-400 font-light hidden sm:inline">/</span>
          <span
            className="text-[11px] font-mono tracking-widest uppercase hidden sm:inline-block font-semibold transition-colors duration-500"
            style={{ color: whiteCanvasOpacity > 0.4 ? '#737373' : '#94a3b8' }}
          >
            NASA SPACE APPS ARCHIVE
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Audio Transmission Toggle */}
          <button
            onClick={() => {
              if (!isAudioAllowed) {
                onEnableAudio();
              } else {
                onToggleMute();
              }
            }}
            className="bg-neutral-900/90 hover:bg-black text-white text-[11px] md:text-xs font-ui font-semibold uppercase tracking-wider px-4 py-2 rounded-full flex items-center gap-2 shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer border border-white/10 backdrop-blur-md"
          >
            {isAudioAllowed && !isMuted ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="hidden sm:inline">AUDIO: ON</span>
                <div className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-0.5 h-1.5 bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-neutral-400" />
                <span>SOUND: OFF •</span>
              </>
            )}
          </button>

          {/* Primary Cinematic Auto-Play Trigger */}
          <button
            onClick={handleTogglePlayCinematic}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] md:text-xs font-ui font-bold uppercase tracking-wider px-5 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isPlayingCinematic ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{scrollProgress < 0.05 ? 'PLAY DIVE' : 'RESUME'}</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* 
        -------------------------------------------------------------
        4. HERO EDITORIAL HEADLINE (Cleanly Formatted, No Overlap)
        Paragraphs removed per instruction. Bold headline positioned
        cleanly above the tablet with responsive sizing.
        -------------------------------------------------------------
      */}
      {uiOpacity > 0.01 && (
        <div
          className="absolute top-20 sm:top-24 left-6 sm:left-12 lg:left-16 right-6 sm:right-12 z-30 pointer-events-none transition-all"
          style={{
            opacity: uiOpacity,
            transform: `translateY(-${uiTranslateY * 0.55}px)`,
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-neutral-500 uppercase font-semibold">
              HUMANITY'S DISCARDED SENTINELS ON THE MOON & MARS
            </span>
          </div>

          <h1 className="font-heading font-black text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-neutral-950 tracking-tight uppercase leading-[1.05] max-w-2xl sm:max-w-3xl">
            WHERE ANCIENT EXPLORERS<br />
            BECOME LIVING LEGENDS.
          </h1>
        </div>
      )}

      {/* 
        -------------------------------------------------------------
        4. FULL-VIEWPORT 3D WEBGL STAGE (100vw x 100vh)
        Masked inside iPad rect at start, expands smoothly to fullscreen!
        NO 2D TEXT OVERLAYS BLOCKING THE SCENE!
        -------------------------------------------------------------
      */}
      <div
        className="absolute inset-0 z-20 pointer-events-auto transition-[clip-path] duration-75 ease-out"
        style={{
          clipPath: clipPathStyle,
          WebkitClipPath: clipPathStyle,
        }}
      >
        <Canvas
          shadows
          camera={{ position: [0, 0, 3.6], fov: 42, near: 0.1, far: 200 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
          dpr={[1, 1.75]}
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <LusionAstronautScene
              scrollProgress={scrollProgress}
              pointerPos={pointerPos}
              isExpanded={expandT >= 0.99}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* 
        -------------------------------------------------------------
        5. IPAD HARDWARE CHASSIS BEZEL & GLASS SHEEN
        -------------------------------------------------------------
      */}
      {bezelOpacity > 0.02 && (
        <div
          onClick={handleTogglePlayCinematic}
          className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
          style={{
            opacity: bezelOpacity,
            transform: `scale(${bezelScale}) perspective(1200px) rotateX(${tabletTilt.rotateX}deg) rotateY(${tabletTilt.rotateY}deg)`,
            transition: 'transform 0.15s ease-out',
          }}
        >
          <div className="relative w-[340px] h-[230px] sm:w-[480px] sm:h-[320px] md:w-[620px] md:h-[400px] lg:w-[720px] lg:h-[460px] rounded-[36px] sm:rounded-[42px] md:rounded-[48px] border-[12px] sm:border-[14px] md:border-[16px] border-[#18181b] bg-transparent shadow-[0_35px_100px_rgba(0,0,0,0.65),0_0_60px_rgba(34,211,238,0.25)] pointer-events-auto cursor-pointer">
            <div className="absolute top-1/2 left-[-10px] -translate-y-1/2 flex flex-col gap-1 pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[#27272a] border border-[#3f3f46]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]/50" />
            </div>

            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/8 to-transparent rounded-[inherit] pointer-events-none" />

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/75 border border-white/20 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-widest shadow-xl pointer-events-none">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>SCROLL OR CLICK TO DIVE ↗</span>
            </div>
          </div>
        </div>
      )}

      {/* 
        -------------------------------------------------------------
        6. BOTTOM METADATA & "SCROLL DOWN" CALLOUT
        Restored to faithfully match lucio.webm and the user request:
        Left: Brand & Mission metadata
        Right: "SCROLL DOWN" with the bouncing circular arrow button!
        -------------------------------------------------------------
      */}
      {uiOpacity > 0.01 && (
        <footer
          className="absolute bottom-0 left-0 right-0 z-30 flex flex-col sm:flex-row items-start sm:items-end justify-between px-6 sm:px-12 lg:px-16 py-6 pointer-events-auto gap-4 transition-all"
          style={{
            opacity: uiOpacity,
            transform: `translateY(${uiTranslateY * 0.55}px)`,
          }}
        >
          <div className="space-y-1">
            <p className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
              NOVOCHRONOS • NASA SPACE APPS ARCHIVE • 2026
            </p>
            <p className="text-xs text-neutral-400 font-mono tracking-wide hidden sm:block">
              Interactive documentary exploring humanity's discarded technology resting on foreign soil.
            </p>
          </div>

          {/* Pulsing "SCROLL DOWN" Indicator with Bouncing Arrow */}
          <div
            onClick={handleTogglePlayCinematic}
            className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-neutral-800 hover:text-black cursor-pointer group transition-all"
          >
            <span className="font-bold tracking-[0.2em]">SCROLL DOWN</span>
            <div className="w-9 h-9 rounded-full border border-neutral-300 group-hover:border-neutral-900 flex items-center justify-center bg-white shadow-sm transition-all group-hover:scale-110">
              <ArrowDown className="w-4 h-4 text-neutral-800 group-hover:text-black animate-bounce" />
            </div>
          </div>
        </footer>
      )}

      {/* 
        -------------------------------------------------------------
        7. POST-WARP "CONTINUE TO SCROLL" PILL (lucio.webm Frame 022)
        Appears right after the supernova portal bloom flash clears!
        -------------------------------------------------------------
      */}
      {scrollProgress > 0.88 && (
        <div
          onClick={onComplete}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white text-black text-xs font-mono font-bold uppercase tracking-widest shadow-2xl animate-pulse cursor-pointer hover:scale-105 transition-transform"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          <span>CONTINUE TO SCROLL</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </div>
      )}

      {/* 
        -------------------------------------------------------------
        8. MINIMAL SCRUBBER CONTROLLER (Bottom Center Floating Pill)
        Gives full, effortless interactive control over the dive timeline
        -------------------------------------------------------------
      */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-35 flex items-center gap-3 px-5 py-2.5 rounded-full bg-neutral-950/85 border border-white/15 backdrop-blur-md shadow-2xl pointer-events-auto">
        <button
          onClick={handleTogglePlayCinematic}
          className="text-white hover:text-cyan-400 transition-colors cursor-pointer"
          title={isPlayingCinematic ? 'Pause' : 'Play Cinematic Dive'}
        >
          {isPlayingCinematic ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current" />
          )}
        </button>

        <button
          onClick={handleResetToStart}
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="Restart Animation"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            handleSeek(ratio);
          }}
          className="relative w-36 sm:w-56 h-1.5 bg-neutral-800 rounded-full cursor-pointer overflow-hidden group"
          title="Click to scrub animation timeline"
        >
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 transition-all duration-75"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>

        <span className="text-[10px] font-mono text-neutral-400 font-semibold min-w-[32px] text-right">
          {Math.round(scrollProgress * 100)}%
        </span>

        <button
          onClick={onComplete}
          className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider pl-1 cursor-pointer"
          title="Skip to Exhibition"
        >
          <span>ENTER</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* 
        -------------------------------------------------------------
        9. SUPERNOVA PORTAL BLOOM FLASH (Frame 036 of lucio.webm)
        -------------------------------------------------------------
      */}
      <div
        className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-150"
        style={{
          opacity: supernovaFlashOpacity,
          background:
            'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(56,189,248,0.85) 45%, rgba(2,6,23,0.95) 100%)',
        }}
      />
    </div>
  );
};
