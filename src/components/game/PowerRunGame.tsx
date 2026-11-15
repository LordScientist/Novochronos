// POWER RUN: The Last Signal — 2D Side-Scrolling Arcade Runner
// 3-lane responsive navigation, fair obstacle patterns, physics, power management, and educational presentation

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { Artifact } from '../../types/artifact';
import { GameTelemetry, GameLane, Obstacle, BatteryPickup, FloatingText, GameParticle } from '../../types/game';
import { drawArtifactSprite } from './ArtifactSprite2D';
import { EnvironmentRenderer2D, THEMES, EnvironmentTheme } from './EnvironmentRenderer2D';
import { gameAudio } from '../../utils/gameAudio';
import {
  Zap,
  RotateCcw,
  Volume2,
  VolumeX,
  Play,
  Pause,
  LogOut,
  ChevronUp,
  ChevronDown,
  Info,
  ShieldAlert,
} from 'lucide-react';

interface PowerRunGameProps {
  selectedArtifact: Artifact;
  onExit: () => void;
  onRestart: () => void;
}

const ARTIFACT_FACTS: Record<string, string> = {
  'opportunity-rover':
    'Landed in 2004 for a planned 90-day mission, Opportunity operated on Mars for nearly 15 years, driving 45.16 km and confirming that liquid water once flowed across the Martian surface.',
  'ingenuity-helicopter':
    'Engineered for just 5 technology demonstration flights, Ingenuity accomplished 72 flights over nearly 3 years, serving as the first aerial scout on another world.',
  'apollo-11-descent':
    'The Apollo 11 Lunar Module descent stage touched down at Tranquility Base on July 20, 1969, serving as the launch pad when Armstrong and Aldrin lifted off back to lunar orbit.',
  'insight-lander':
    'InSight recorded over 1,300 marsquakes between 2018 and 2022, providing humanity with our first comprehensive seismic map of Mars’ crust, mantle, and liquid core.',
  'apollo-15-lrv':
    'The Apollo 15 Lunar Roving Vehicle enabled astronauts David Scott and James Irwin to explore 27.8 km across Hadley Rille, transforming lunar field geology.',
  'sojourner-pathfinder':
    'Weighing just 10.6 kg, Sojourner was humanity’s first Mars rover in 1997, demonstrating that robotic exploration vehicles could successfully operate on Martian soil.',
  'pioneer-10':
    'Launched in 1972, Pioneer 10 became the first spacecraft to navigate the asteroid belt and achieve a close flyby of Jupiter. It is now drifting silently into interstellar space.',
  'surveyor-3':
    'Landing on the Moon in 1967, Surveyor 3 was visited in November 1969 by Apollo 12 astronauts, who retrieved its television camera and scoop for scientific analysis on Earth.',
};

export const PowerRunGame: React.FC<PowerRunGameProps> = ({
  selectedArtifact,
  onExit,
  onRestart,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Environment theme determination
  const destination: 'Moon' | 'Mars' | 'Deep Space' = useMemo(() => {
    if (selectedArtifact.id === 'pioneer-10') return 'Deep Space';
    if (selectedArtifact.celestialBody === 'Mars') return 'Mars';
    return 'Moon';
  }, [selectedArtifact]);

  const theme: EnvironmentTheme = THEMES[destination] || THEMES.Moon;
  const envRenderer = useMemo(() => new EnvironmentRenderer2D(), []);

  // UI States
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(gameAudio.isMuted);
  const [showTutorial, setShowTutorial] = useState<boolean>(true);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  // Telemetry HUD State
  const [telemetry, setTelemetry] = useState<GameTelemetry>({
    power: 100,
    maxPower: 100,
    distance: 0,
    speed: 45,
    batteriesCollected: 0,
    currentLane: 1,
    isInvulnerable: false,
    isGameOver: false,
    isPaused: false,
    destination,
  });

  // Game Engine Internal State Refs (for smooth 60 FPS update loop without React re-renders)
  const stateRef = useRef({
    currentLane: 1 as GameLane,
    playerX: 0,
    playerY: 0,
    targetY: 0,
    tiltAngle: 0,
    scrollOffset: 0,
    scrollSpeed: 380, // Pixels per second
    power: 100,
    distance: 0,
    batteriesCollected: 0,
    isInvulnerable: false,
    invulnerableTimer: 0,
    shakeTimer: 0,
    shakeIntensity: 0,
    isShuttingDown: false,
    shutdownTimer: 0,
    isGameOver: false,
    lastAlertTime: 0,
    obstacles: [] as Obstacle[],
    batteries: [] as BatteryPickup[],
    floatingTexts: [] as FloatingText[],
    particles: [] as GameParticle[],
    nextObstacleX: 900,
    nextBatteryX: 650,
    obstacleIdCounter: 1,
    batteryIdCounter: 1,
    floatingIdCounter: 1,
    lastFrameTime: performance.now(),
  });

  // -----------------------------------------------------------
  // Lane Change Logic (Snappy, predictable, clamped)
  // -----------------------------------------------------------
  const changeLane = useCallback((direction: 'up' | 'down') => {
    const s = stateRef.current;
    if (s.isGameOver || isPaused) return;

    let targetLane: GameLane = s.currentLane;
    if (direction === 'up' && s.currentLane > 0) {
      targetLane = (s.currentLane - 1) as GameLane;
    } else if (direction === 'down' && s.currentLane < 2) {
      targetLane = (s.currentLane + 1) as GameLane;
    }

    if (targetLane !== s.currentLane) {
      s.currentLane = targetLane;
      gameAudio.playLaneShift(direction);
      setShowTutorial(false);
    }
  }, [isPaused]);

  // -----------------------------------------------------------
  // Keyboard Controls
  // -----------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        changeLane('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        changeLane('down');
      } else if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      } else if ((e.key === 'r' || e.key === 'R') && stateRef.current.isGameOver) {
        e.preventDefault();
        handleRestart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeLane]);

  // -----------------------------------------------------------
  // Mobile Touch Swipe Handling
  // -----------------------------------------------------------
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 35) {
      if (deltaY < 0) {
        changeLane('up');
      } else {
        changeLane('down');
      }
    }
    touchStartY.current = null;
  };

  // -----------------------------------------------------------
  // Restart Game
  // -----------------------------------------------------------
  const handleRestart = () => {
    const s = stateRef.current;
    s.currentLane = 1;
    s.power = 100;
    s.distance = 0;
    s.batteriesCollected = 0;
    s.scrollSpeed = 380;
    s.isInvulnerable = false;
    s.invulnerableTimer = 0;
    s.shakeTimer = 0;
    s.isShuttingDown = false;
    s.shutdownTimer = 0;
    s.isGameOver = false;
    s.obstacles = [];
    s.batteries = [];
    s.floatingTexts = [];
    s.particles = [];
    s.nextObstacleX = 900;
    s.nextBatteryX = 650;
    s.lastFrameTime = performance.now();

    setGameOver(false);
    setIsPaused(false);
    setTelemetry({
      power: 100,
      maxPower: 100,
      distance: 0,
      speed: 45,
      batteriesCollected: 0,
      currentLane: 1,
      isInvulnerable: false,
      isGameOver: false,
      isPaused: false,
      destination,
    });

    gameAudio.playCountdownBeep(true);
    onRestart();
  };

  // -----------------------------------------------------------
  // Main 60 FPS Fixed Delta-Time Game Loop
  // -----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const s = stateRef.current;
    s.lastFrameTime = performance.now();

    const loop = (currentTime: number) => {
      // Calculate delta time in seconds, clamped to prevent lag spikes
      const rawDelta = (currentTime - s.lastFrameTime) / 1000;
      s.lastFrameTime = currentTime;
      const dt = Math.min(rawDelta, 0.05);

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate the 3 vertical lane Y positions
      const laneY = [height * 0.28, height * 0.50, height * 0.72];

      if (!isPaused && !s.isGameOver) {
        // -----------------------------------------------------
        // 1. UPDATE STATE & SIMULATION
        // -----------------------------------------------------
        const timeSec = currentTime / 1000;

        // Power depletion: continuous predictable rate (-2.2% / sec)
        if (!s.isShuttingDown) {
          s.power = Math.max(0, s.power - 2.2 * dt);

          // Low power warning audio pulse
          if (s.power > 0 && s.power < 25 && timeSec - s.lastAlertTime > 2.8) {
            s.lastAlertTime = timeSec;
            gameAudio.playLowPowerAlert();
          }

          // Shutdown initiation at 0 power
          if (s.power <= 0) {
            s.isShuttingDown = true;
            s.shutdownTimer = 0;
            gameAudio.playShutdown();
          }
        } else {
          // Shutdown sequence deceleration
          s.shutdownTimer += dt;
          s.scrollSpeed = Math.max(0, s.scrollSpeed * (1 - dt * 2.2));
          if (s.shutdownTimer > 1.4 && !s.isGameOver) {
            s.isGameOver = true;
            setGameOver(true);
          }
        }

        // Distance and speed progression
        s.distance += (s.scrollSpeed * dt) / 10;
        s.scrollOffset += s.scrollSpeed * dt;

        // Player X is fixed at the left third (18% of screen width)
        s.playerX = width * 0.18;
        s.targetY = laneY[s.currentLane];

        // Snappy lane interpolation: lerp towards target lane Y
        s.playerY += (s.targetY - s.playerY) * Math.min(1.0, 16 * dt);

        // Dynamic banking / suspension tilt based on vertical movement
        const vy = s.targetY - s.playerY;
        const targetTilt = Math.max(-0.16, Math.min(0.16, vy * 0.003));
        s.tiltAngle += (targetTilt - s.tiltAngle) * Math.min(1.0, 14 * dt);

        // Invulnerability timer countdown
        if (s.isInvulnerable) {
          s.invulnerableTimer -= dt;
          if (s.invulnerableTimer <= 0) {
            s.isInvulnerable = false;
          }
        }

        // Screen shake timer countdown
        if (s.shakeTimer > 0) {
          s.shakeTimer -= dt;
        }

        // -----------------------------------------------------
        // 2. OBSTACLE GENERATION & FAIR LANE PATTERNS
        // -----------------------------------------------------
        if (!s.isShuttingDown) {
          // Spawn obstacles at regular spaced intervals (guaranteed passable routes)
          if (s.scrollOffset + width > s.nextObstacleX) {
            // Pattern choice: Single hazard or dual hazard (NEVER 3 hazards)
            const patternRoll = Math.random();
            const obsTypes: Obstacle['type'][] = ['rock', 'boulder', 'crater', 'debris'];
            const type = obsTypes[Math.floor(Math.random() * obsTypes.length)];

            if (patternRoll < 0.65) {
              // Single hazard in a random lane
              const randomLane = Math.floor(Math.random() * 3) as GameLane;
              s.obstacles.push({
                id: s.obstacleIdCounter++,
                lane: randomLane,
                x: s.nextObstacleX,
                width: 52,
                height: 40,
                type,
                hit: false,
              });
            } else {
              // Dual hazard leaving 1 designated safe lane
              const safeLane = Math.floor(Math.random() * 3) as GameLane;
              for (let laneIdx = 0; laneIdx < 3; laneIdx++) {
                if (laneIdx !== safeLane) {
                  s.obstacles.push({
                    id: s.obstacleIdCounter++,
                    lane: laneIdx as GameLane,
                    x: s.nextObstacleX + (laneIdx % 2 === 0 ? 0 : 35), // Slight stagger
                    width: 50,
                    height: 38,
                    type,
                    hit: false,
                  });
                }
              }
            }

            // Next obstacle spacing (380-480 px, fair reaction window)
            s.nextObstacleX = s.scrollOffset + width + 380 + Math.random() * 120;
          }

          // -----------------------------------------------------
          // 3. BATTERY CELL GENERATION
          // -----------------------------------------------------
          if (s.scrollOffset + width > s.nextBatteryX) {
            const batteryLane = Math.floor(Math.random() * 3) as GameLane;
            s.batteries.push({
              id: s.batteryIdCounter++,
              lane: batteryLane,
              x: s.nextBatteryX,
              width: 32,
              height: 42,
              collected: false,
              pulsePhase: Math.random() * Math.PI * 2,
            });

            // Battery spacing: placed regularly to maintain flow
            s.nextBatteryX = s.scrollOffset + width + 280 + Math.random() * 180;
          }
        }

        // -----------------------------------------------------
        // 4. COLLISION DETECTION (Fair Hitboxes)
        // -----------------------------------------------------
        const playerHitboxW = 54;
        const playerHitboxH = 34;

        // A. Obstacle Collisions
        s.obstacles.forEach((obs) => {
          if (!obs.hit && !s.isInvulnerable && !s.isShuttingDown) {
            const obsScreenX = obs.x - s.scrollOffset;
            const obsScreenY = laneY[obs.lane];

            // AABB Overlap test
            const xOverlap =
              Math.abs(s.playerX - obsScreenX) < (playerHitboxW + obs.width * 0.7) / 2;
            const yOverlap =
              Math.abs(s.playerY - obsScreenY) < (playerHitboxH + obs.height * 0.7) / 2;

            if (xOverlap && yOverlap) {
              obs.hit = true;
              s.isInvulnerable = true;
              s.invulnerableTimer = 1.2; // 1.2s invulnerability
              s.power = Math.max(0, s.power - 18);
              s.shakeTimer = 0.28;
              s.shakeIntensity = 8;
              gameAudio.playImpact();

              // Emit "-18% POWER" floating text
              s.floatingTexts.push({
                id: s.floatingIdCounter++,
                text: '-18% POWER',
                x: s.playerX,
                y: s.playerY - 28,
                alpha: 1.0,
                color: '#ef4444',
              });

              // Collision impact particles
              for (let p = 0; p < 12; p++) {
                s.particles.push({
                  x: s.playerX,
                  y: s.playerY,
                  vx: (Math.random() - 0.5) * 240,
                  vy: (Math.random() - 0.5) * 200,
                  size: 3 + Math.random() * 3,
                  color: '#f97316',
                  alpha: 1.0,
                  life: 0.4,
                  maxLife: 0.4,
                });
              }
            }
          }
        });

        // B. Battery Pickups
        s.batteries.forEach((bat) => {
          if (!bat.collected && !s.isShuttingDown) {
            const batScreenX = bat.x - s.scrollOffset;
            const batScreenY = laneY[bat.lane];

            const xOverlap =
              Math.abs(s.playerX - batScreenX) < (playerHitboxW + bat.width) / 2;
            const yOverlap =
              Math.abs(s.playerY - batScreenY) < (playerHitboxH + bat.height) / 2;

            if (xOverlap && yOverlap) {
              bat.collected = true;
              s.batteriesCollected++;
              s.power = Math.min(100, s.power + 25);
              gameAudio.playPowerPickup();

              // Emit "+25% POWER" floating text
              s.floatingTexts.push({
                id: s.floatingIdCounter++,
                text: '+25% POWER',
                x: s.playerX,
                y: s.playerY - 32,
                alpha: 1.0,
                color: '#38bdf8',
              });

              // Battery collection sparkles
              for (let p = 0; p < 14; p++) {
                s.particles.push({
                  x: s.playerX,
                  y: s.playerY,
                  vx: (Math.random() - 0.5) * 200,
                  vy: (Math.random() - 0.5) * 200,
                  size: 2.5 + Math.random() * 3,
                  color: '#38bdf8',
                  alpha: 1.0,
                  life: 0.5,
                  maxLife: 0.5,
                });
              }
            }
          }
        });

        // -----------------------------------------------------
        // 5. UPDATE PARTICLES & FLOATING TEXTS
        // -----------------------------------------------------
        s.particles.forEach((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          p.alpha = Math.max(0, p.life / p.maxLife);
        });
        s.particles = s.particles.filter((p) => p.life > 0);

        s.floatingTexts.forEach((ft) => {
          ft.y -= 38 * dt; // Float upward
          ft.alpha -= dt * 1.4;
        });
        s.floatingTexts = s.floatingTexts.filter((ft) => ft.alpha > 0);

        // Prune offscreen obstacles and batteries
        s.obstacles = s.obstacles.filter((obs) => obs.x - s.scrollOffset > -120);
        s.batteries = s.batteries.filter((bat) => bat.x - s.scrollOffset > -120);

        // Sync state to React HUD every few frames
        setTelemetry({
          power: Math.round(s.power),
          maxPower: 100,
          distance: Math.round(s.distance),
          speed: Math.round(s.scrollSpeed * 0.12),
          batteriesCollected: s.batteriesCollected,
          currentLane: s.currentLane,
          isInvulnerable: s.isInvulnerable,
          isGameOver: s.isGameOver,
          isPaused,
          destination,
        });
      }

      // -------------------------------------------------------
      // 6. RENDER PASS
      // -------------------------------------------------------
      ctx.save();

      // Screen shake translation
      if (s.shakeTimer > 0 && !reduceMotion) {
        const shakeMagnitude = (s.shakeTimer / 0.28) * s.shakeIntensity;
        const shakeX = (Math.random() - 0.5) * shakeMagnitude * 2;
        const shakeY = (Math.random() - 0.5) * shakeMagnitude * 2;
        ctx.translate(shakeX, shakeY);
      }

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render Parallax Background & Surface Tracks
      envRenderer.renderBackground(
        ctx,
        width,
        height,
        s.scrollOffset,
        theme,
        currentTime / 1000
      );

      // Render Batteries
      s.batteries.forEach((bat) => {
        const screenX = bat.x - s.scrollOffset;
        if (screenX > -60 && screenX < width + 60) {
          envRenderer.renderBattery(
            ctx,
            { ...bat, x: screenX, y: laneY[bat.lane] },
            currentTime / 1000
          );
        }
      });

      // Render Obstacles
      s.obstacles.forEach((obs) => {
        const screenX = obs.x - s.scrollOffset;
        if (screenX > -80 && screenX < width + 80) {
          envRenderer.renderObstacle(
            ctx,
            { ...obs, x: screenX, y: laneY[obs.lane] },
            theme,
            currentTime / 1000
          );
        }
      });

      // Render Particles
      s.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Playable NASA Artifact Sprite
      drawArtifactSprite(selectedArtifact, {
        ctx,
        x: s.playerX,
        y: s.playerY,
        width: 90,
        height: 60,
        time: currentTime / 1000,
        tiltAngle: s.tiltAngle,
        isInvulnerable: s.isInvulnerable,
        powerPercent: s.power,
      });

      // Render Floating Notification Texts (+25% POWER / -18% POWER)
      s.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.font = 'bold 13px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 8;
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [destination, envRenderer, isPaused, reduceMotion, selectedArtifact, theme]);

  return (
    <div
      className="relative w-full h-screen bg-black overflow-hidden select-none font-mono"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 2D HTML5 Canvas Game Stage */}
      <canvas ref={canvasRef} className="w-full h-full block cursor-default" />

      {/* ------------------------------------------------------------- */}
      {/* IN-GAME HUD: Top Telemetry Bar                                */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Left: Artifact & Environment Identification */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950/85 border border-white/15 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-bold text-xs uppercase tracking-wider">
              {selectedArtifact.name}
            </span>
            <span className="text-slate-400 text-[11px] font-normal">
              // {destination.toUpperCase()}
            </span>
          </div>

          <div className="bg-slate-950/85 border border-white/15 px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-2 text-slate-300 text-xs shadow-lg">
            <span className="text-sky-400 font-bold">{telemetry.distance}</span>
            <span className="text-[10px] text-slate-400 uppercase">METERS</span>
          </div>
        </div>

        {/* Center: High-Clarity Battery & Power Meter */}
        <div className="bg-slate-950/85 border border-white/15 px-5 py-2 rounded-full backdrop-blur-md flex items-center gap-3.5 shadow-2xl">
          <div className="flex items-center gap-1.5">
            <Zap
              className={`w-4 h-4 ${
                telemetry.power < 25
                  ? 'text-red-500 animate-bounce'
                  : 'text-amber-400 fill-amber-400'
              }`}
            />
            <span className="text-xs text-slate-300 font-bold">POWER:</span>
          </div>

          {/* Dynamic Power Bar Container */}
          <div className="w-32 sm:w-44 h-3 bg-slate-900 rounded-full overflow-hidden border border-white/15 p-0.5 relative">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                telemetry.power > 50
                  ? 'bg-gradient-to-r from-emerald-500 to-sky-400'
                  : telemetry.power > 25
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                  : 'bg-gradient-to-r from-red-600 to-red-500 animate-pulse'
              }`}
              style={{ width: `${telemetry.power}%` }}
            />
          </div>

          <span
            className={`text-xs font-bold font-mono min-w-[3rem] text-right ${
              telemetry.power < 25 ? 'text-red-400' : 'text-white'
            }`}
          >
            {telemetry.power}%
          </span>
        </div>

        {/* Right: Sound & Pause Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsMuted(gameAudio.toggleMute())}
            className="p-2 rounded-full bg-slate-950/85 border border-white/15 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer backdrop-blur-md shadow-lg"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-sky-400" />}
          </button>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-2 rounded-full bg-slate-950/85 border border-white/15 hover:bg-slate-900 text-slate-300 hover:text-white transition-colors cursor-pointer backdrop-blur-md shadow-lg"
            title="Pause Game (P or Esc)"
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-amber-400" />}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* ON-SCREEN MOBILE TOUCH CONTROLS (Bottom Right)                */}
      {/* ------------------------------------------------------------- */}
      <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2.5 sm:hidden">
        <button
          onClick={() => changeLane('up')}
          className="w-14 h-14 rounded-full bg-slate-950/90 border-2 border-sky-400/60 active:bg-sky-500/30 flex items-center justify-center text-sky-400 shadow-xl"
        >
          <ChevronUp className="w-7 h-7" />
        </button>
        <button
          onClick={() => changeLane('down')}
          className="w-14 h-14 rounded-full bg-slate-950/90 border-2 border-sky-400/60 active:bg-sky-500/30 flex items-center justify-center text-sky-400 shadow-xl"
        >
          <ChevronDown className="w-7 h-7" />
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* INITIAL RUN CONTROL TUTORIAL OVERLAY                          */}
      {/* ------------------------------------------------------------- */}
      {showTutorial && !gameOver && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none animate-fadeIn">
          <div className="bg-slate-950/90 border border-white/15 px-6 py-2.5 rounded-full backdrop-blur-md flex items-center gap-3 text-xs text-slate-200 shadow-2xl">
            <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-sky-400">↑ / W</span>
            <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-sky-400">↓ / S</span>
            <span className="text-slate-400">NAVIGATE LANES</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-bold">COLLECT CELLS TO MAINTAIN POWER</span>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* PAUSE SCREEN OVERLAY                                          */}
      {/* ------------------------------------------------------------- */}
      {isPaused && !gameOver && (
        <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-white/20 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <h2 className="text-xl font-orbitron font-black text-white tracking-widest uppercase">
              MISSION PAUSED
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <button
                onClick={() => setIsPaused(false)}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-all shadow-lg cursor-pointer"
              >
                RESUME RUN
              </button>

              <button
                onClick={handleRestart}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition-all cursor-pointer"
              >
                RESTART RUN (R)
              </button>

              <button
                onClick={() => setReduceMotion(!reduceMotion)}
                className="w-full py-2 rounded-xl bg-slate-900 border border-white/10 hover:bg-slate-800 text-slate-400 text-[11px] transition-colors cursor-pointer"
              >
                SCREEN SHAKE: {reduceMotion ? 'OFF' : 'ON'}
              </button>

              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-red-950/40 border border-red-500/30 hover:bg-red-900/60 text-red-300 font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>RETURN TO ARCHIVE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* CLEAN GAME-OVER RESULTS SCREEN                                */}
      {/* ------------------------------------------------------------- */}
      {gameOver && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-9 max-w-lg w-full text-center space-y-6 shadow-[0_0_60px_rgba(245,158,11,0.2)]">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-mono tracking-widest uppercase">
                <ShieldAlert className="w-4 h-4" />
                <span>POWER DEPLETED // THE LAST SIGNAL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-white tracking-wide">
                MISSION CONCLUDED
              </h2>
            </div>

            {/* Run Statistics Grid */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-left">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  DISTANCE TRAVERSED
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-white">
                  {telemetry.distance} <span className="text-xs font-normal text-slate-400">m</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  POWER CELLS COLLECTED
                </span>
                <span className="text-xl sm:text-2xl font-bold font-mono text-sky-400">
                  {telemetry.batteriesCollected}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  SPACECRAFT VEHICLE
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {selectedArtifact.name}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono block">
                  CELESTIAL REALM
                </span>
                <span className="text-xs font-bold text-slate-200">
                  {destination.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Historical Fact Archival Box */}
            <div className="p-4 rounded-xl bg-slate-900/40 border border-white/5 text-left text-xs text-slate-300 font-sans leading-relaxed flex gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-mono text-[10px] text-sky-400 font-bold block uppercase tracking-wider mb-1">
                  NASA HISTORICAL RECORD
                </span>
                <p>{ARTIFACT_FACTS[selectedArtifact.id] || selectedArtifact.tagline}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 font-mono text-xs">
              <button
                onClick={handleRestart}
                className="w-full sm:flex-1 py-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold uppercase transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>PLAY AGAIN (R)</span>
              </button>

              <button
                onClick={onExit}
                className="w-full sm:flex-1 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>RETURN TO ARCHIVE</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
