import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { LusionHeroPage } from './components/lusion/LusionHeroPage';
import { CinematicIntro } from './components/journey/CinematicIntro';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';
import { CinematicArtifactDiscovery } from './components/discovery/CinematicArtifactDiscovery';
import { RocketLaunchTransition } from './components/game/RocketLaunchTransition';
import { PowerRunGame } from './components/game/PowerRunGame';
import { LaunchState } from './types/game';
import { Artifact } from './types/artifact';
import { ARTIFACTS } from './data/artifacts';
import { Grid, Orbit, Flame } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation views:
  // - 'lusion-hero': Splash screen with Lusion-inspired 3D floating astronaut, Earth horizon & hyperspace dive
  // - 'intro': Stage 0 dedicated 3D cinematic opening with narration
  // - 'corridor': 3D Space Shuttle launch stack & helical sentinel card corridor
  // - 'discovery': Lusion-inspired cinematic artifact discovery gallery with shared-element card-to-detail expansion
  const [currentView, setCurrentView] = useState<'lusion-hero' | 'intro' | 'corridor' | 'discovery'>('lusion-hero');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Audio Engine State for Splash Screen
  const [isAudioAllowed, setIsAudioAllowed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const handleCompleteLusionHero = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('intro');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 300);
  }, []);

  // Cinematic Rocket Launch & Power Run Game State
  const [launchState, setLaunchState] = useState<LaunchState>('GALLERY');
  const [activeGameArtifact, setActiveGameArtifact] = useState<Artifact>(ARTIFACTS[0]);

  // Lenis smooth momentum scroll for the 3D Space Shuttle Corridor
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();

  // Control Lenis: activate strictly when in 'corridor' view, no modal is open, and not in launch/game sequence
  useEffect(() => {
    if (
      currentView === 'corridor' &&
      !selectedSentinelId &&
      !isTransitioning &&
      launchState === 'GALLERY'
    ) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [currentView, selectedSentinelId, isTransitioning, launchState, lenis]);

  // Smooth cinematic transition from Intro into Corridor
  const handleTransitionToCorridor = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('corridor');
      lenis?.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  }, [lenis]);

  // Transition to Discovery Gallery
  const handleSwitchView = (view: 'corridor' | 'discovery') => {
    if (view === currentView) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'instant' });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 300);
  };

  // Replay 3D Intro
  const handleReplayIntro = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('intro');
      setTimeout(() => {
        setIsTransitioning(false);
      }, 250);
    }, 300);
  };

  // Stepper navigation along the 3D helix
  const handleNavigateStep = (direction: 'prev' | 'next') => {
    const step = 1 / 7;
    const currentStepIndex = Math.round(progress / step);
    const targetStep = direction === 'next' ? currentStepIndex + 1 : currentStepIndex - 1;
    scrollToProgress(targetStep * step);
  };

  // -------------------------------------------------------------
  // Cinematic Rocket Launch & Game Initiation
  // -------------------------------------------------------------
  const handleStartGame = (artifact?: Artifact, directPlay = false) => {
    // Keep user's chosen artifact, or currently selected card, or fallback to first
    const chosen =
      artifact ||
      ARTIFACTS.find((a) => a.id === selectedSentinelId) ||
      activeGameArtifact ||
      ARTIFACTS[0];

    setActiveGameArtifact(chosen);
    setSelectedSentinelId(null);
    setCurrentView('corridor');
    if (directPlay) {
      setLaunchState('PLAYING');
    } else {
      setLaunchState('LAUNCH_PREPARATION');
    }
  };

  // Direct game access via query param ?game or auto-launch
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('game')) {
      handleStartGame(undefined, true);
    }
  }, []);

  const handleLaunchComplete = () => {
    setLaunchState('PLAYING');
  };

  const handleReturnToArchive = () => {
    setLaunchState('GALLERY');
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-sky-500 selection:text-black">
      {/* 
        STAGE 0: Splash Screen with Lusion Floating iPad & 3D Astronaut Dive
      */}
      {currentView === 'lusion-hero' && (
        <LusionHeroPage
          onComplete={handleCompleteLusionHero}
          isAudioAllowed={isAudioAllowed}
          isMuted={isMuted}
          onEnableAudio={() => {
            setIsAudioAllowed(true);
            setIsMuted(false);
          }}
          onToggleMute={() => setIsMuted((prev) => !prev)}
        />
      )}

      {/* 
        STAGE 1: Dedicated Cinematic 3D Opening Sequence
        When the user finishes the intro or clicks "ENTER THE ARCHIVE", 
        it smoothly transitions directly to the Space Shuttle corridor or Discovery Gallery!
      */}
      {currentView === 'intro' && (
        <CinematicIntro
          onComplete={handleTransitionToCorridor}
          onPlayGame={() => handleStartGame()}
        />
      )}

      {/* Global View Switcher Bar (Visible outside Splash & Intro, hidden during active launch & game) */}
      {currentView !== 'intro' && currentView !== 'lusion-hero' && launchState === 'GALLERY' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/85 border border-white/15 backdrop-blur-md shadow-2xl">
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentView('lusion-hero');
                setTimeout(() => setIsTransitioning(false), 200);
              }, 200);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-xs text-slate-400 hover:text-white hover:bg-slate-900/60 transition-all cursor-pointer"
            title="Return to Splash Screen"
          >
            <span>SPLASH</span>
          </button>
          <button
            onClick={() => handleSwitchView('corridor')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              currentView === 'corridor'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span>3D CORRIDOR</span>
          </button>

          <button
            onClick={() => handleSwitchView('discovery')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-mono text-xs transition-all cursor-pointer ${
              currentView === 'discovery'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>ARTIFACT DISCOVERY</span>
          </button>

          <div className="w-px h-5 bg-white/15 mx-0.5" />

          {/* Primary High-Visibility "PLAY GAME" Trigger */}
          <button
            onClick={() => handleStartGame()}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-orbitron font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.6)] cursor-pointer active:scale-95 border border-amber-300"
          >
            <Flame className="w-3.5 h-3.5 fill-current text-slate-950" />
            <span>PLAY GAME</span>
          </button>
        </div>
      )}

      {/* 
        STAGE 1: 3D Space Shuttle Corridor & Cinematic Launch View
        Features the central Space Shuttle stack, orbiting sentinel cards, Lenis momentum scroll!
        When PLAY GAME is clicked, the surrounding cards fade away and the rocket launch sequence unfolds!
      */}
      {currentView === 'corridor' && launchState !== 'PLAYING' && (
        <div className="relative min-h-screen bg-black text-slate-100 overflow-x-hidden">
          {/* 3D WebGL Canvas Layer (Fixed full-viewport stage) */}
          <div className="fixed inset-0 z-0 pointer-events-auto">
            <Canvas
              camera={{ position: [0, 0.4, 10.5], fov: 45, near: 0.1, far: 200 }}
              gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
              }}
              dpr={[1, 2]}
            >
              <color attach="background" args={['#000000']} />
              <Suspense fallback={null}>
                {launchState === 'GALLERY' ? (
                  <SentinelCarouselScene
                    scrollProgress={progress}
                    scrollVelocity={velocity}
                    selectedSentinelId={selectedSentinelId}
                    onSelectSentinel={(id) => {
                      setSelectedSentinelId(id);
                      const art = ARTIFACTS.find((a) => a.id === id);
                      if (art) setActiveGameArtifact(art);
                    }}
                  />
                ) : (
                  <RocketLaunchTransition
                    launchState={launchState}
                    selectedArtifact={activeGameArtifact}
                    onLaunchProgress={(nextState) => setLaunchState(nextState)}
                    onLaunchComplete={handleLaunchComplete}
                  />
                )}
              </Suspense>
            </Canvas>
          </div>

          {/* Cinematic Radial Vignette Overlay */}
          <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_42%,_rgba(0,0,0,0.85)_100%)]" />

          {/* Normal Gallery Corridor HUD (Fade out when launch sequence initiates) */}
          {launchState === 'GALLERY' && (
            <>
              <MissionControlHUD
                scrollProgress={progress}
                scrollVelocity={velocity}
                onNavigateStep={handleNavigateStep}
                onPlayGame={() => handleStartGame()}
              />

              <SentinelDetailModal
                sentinelId={selectedSentinelId}
                onClose={() => setSelectedSentinelId(null)}
                onLaunchGame={(id) => {
                  const art = ARTIFACTS.find((a) => a.id === id);
                  handleStartGame(art);
                }}
              />

              {/* Lenis Momentum Scroll Track */}
              <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
            </>
          )}
        </div>
      )}

      {/* 
        STAGE 2: Lusion-Inspired Cinematic Artifact Discovery Gallery
        Features the balanced grid, mouse parallax tilt, and smooth shared-element card-to-detail expansion!
      */}
      {currentView === 'discovery' && launchState === 'GALLERY' && (
        <CinematicArtifactDiscovery
          onBackToCorridor={() => handleSwitchView('corridor')}
          onReplayIntro={handleReplayIntro}
          onLaunchGame={(art) => handleStartGame(art)}
        />
      )}

      {/* 
        STAGE 3: Interactive POWER RUN Gameplay Realm
        Transitions into the Moon, Mars, or Deep Space environment based on the chosen artifact!
      */}
      {launchState === 'PLAYING' && (
        <PowerRunGame
          selectedArtifact={activeGameArtifact}
          onExit={handleReturnToArchive}
          onRestart={() => setLaunchState('PLAYING')}
        />
      )}

      {/* End-to-End Cinematic Stage Dissolve Transition Overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-300 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default App;
