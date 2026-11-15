import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
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
import { Grid, Orbit, Flame, RotateCcw } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation views:
  // - 'intro': Stage 0 dedicated 3D cinematic opening with narration
  // - 'corridor': 3D Space Shuttle launch stack & helical sentinel card corridor
  // - 'discovery': Lusion-inspired cinematic artifact discovery gallery with shared-element card-to-detail expansion
  const [currentView, setCurrentView] = useState<'intro' | 'corridor' | 'discovery'>('intro');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Cinematic Rocket Launch & Power Run Game State
  const [launchState, setLaunchState] = useState<LaunchState>('GALLERY');
  const [activeGameArtifact, setActiveGameArtifact] = useState<Artifact>(ARTIFACTS[0]);

  // Lenis smooth momentum scroll for the 3D Space Shuttle Corridor
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();

  // Control Lenis: activate in both 'corridor' and 'discovery' views when no modal is open and not in launch/game sequence
  useEffect(() => {
    const isModalOpen = Boolean(selectedSentinelId);
    const isGalleryActive = launchState === 'GALLERY';
    const isScrollableView = currentView === 'corridor' || currentView === 'discovery';

    if (isScrollableView && !isModalOpen && !isTransitioning && isGalleryActive) {
      lenis?.start();
      lenis?.resize();
    } else {
      lenis?.stop();
    }
  }, [currentView, selectedSentinelId, isTransitioning, launchState, lenis]);

  // Smooth cinematic transition from Intro into Corridor
  const handleTransitionToCorridor = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('corridor');
      window.scrollTo({ top: 0, behavior: 'instant' });
      lenis?.scrollTo(0, { immediate: true });
      lenis?.resize();
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
      lenis?.scrollTo(0, { immediate: true });
      lenis?.resize();
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
      window.scrollTo({ top: 0, behavior: 'instant' });
      lenis?.scrollTo(0, { immediate: true });
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
    <div className="min-h-screen bg-deepSpace text-lunarWhite flex flex-col selection:bg-stellarBlue selection:text-lunarWhite">
      {/* 
        STAGE 0: Dedicated Cinematic 3D Opening Sequence
        When the user finishes the intro or clicks "ENTER THE ARCHIVE", 
        it smoothly transitions directly to the Space Shuttle corridor or Discovery Gallery!
      */}
      {currentView === 'intro' && (
        <CinematicIntro
          onComplete={handleTransitionToCorridor}
          onPlayGame={() => handleStartGame()}
        />
      )}

      {/* Global Astronomical Navigation Bar */}
      {currentView !== 'intro' && launchState === 'GALLERY' && (
        <div className="fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)] flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 rounded-full bg-obsidian/90 border border-titanium/15 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <button
            onClick={() => handleSwitchView('corridor')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'corridor'
                ? 'bg-stellarBlue text-lunarWhite font-semibold shadow-[0_0_20px_rgba(26,47,251,0.5)]'
                : 'text-dustGrey hover:text-lunarWhite hover:bg-cosmicNavy/60'
            }`}
          >
            <Orbit className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden xs:inline">3D </span>CORRIDOR</span>
          </button>

          <button
            onClick={() => handleSwitchView('discovery')}
            className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              currentView === 'discovery'
                ? 'bg-stellarBlue text-lunarWhite font-semibold shadow-[0_0_20px_rgba(26,47,251,0.5)]'
                : 'text-dustGrey hover:text-lunarWhite hover:bg-cosmicNavy/60'
            }`}
          >
            <Grid className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden sm:inline">ARTIFACT </span>EXHIBITION</span>
          </button>

          <div className="w-px h-3.5 sm:h-4 bg-titanium/20 mx-0.5 shrink-0" />

          {/* On Cards/Exhibition page: Return to Intro; On 3D Corridor: Play Game */}
          {currentView === 'discovery' ? (
            <button
              onClick={handleReplayIntro}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-cosmicNavy/90 hover:bg-stellarBlue/30 text-lunarWhite font-mono font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(26,47,251,0.3)] cursor-pointer active:scale-95 border border-titanium/20 whitespace-nowrap"
              title="Return to Stage 0 Cinematic Introduction"
            >
              <RotateCcw className="w-3.5 h-3.5 text-nebulaCyan shrink-0" />
              <span><span className="hidden sm:inline">RETURN TO </span>INTRO</span>
            </button>
          ) : (
            <button
              onClick={() => handleStartGame()}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-stellarBlue via-indigo-600 to-blue-700 hover:brightness-110 text-lunarWhite font-mono font-bold text-[10px] sm:text-[11px] tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(26,47,251,0.5)] cursor-pointer active:scale-95 border border-nebulaCyan/40 whitespace-nowrap"
            >
              <Flame className="w-3.5 h-3.5 text-nebulaCyan shrink-0" />
              <span>PLAY<span className="hidden xs:inline"> GAME</span></span>
            </button>
          )}
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
                onReturnToIntro={handleReplayIntro}
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
