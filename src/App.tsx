import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { CinematicIntro } from './components/journey/CinematicIntro';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';
import { CinematicArtifactDiscovery } from './components/discovery/CinematicArtifactDiscovery';
import { Grid, Orbit } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation views:
  // - 'intro': Stage 0 dedicated 3D cinematic opening with narration
  // - 'corridor': 3D Space Shuttle launch stack & helical sentinel card corridor
  // - 'discovery': Lusion-inspired cinematic artifact discovery gallery with shared-element card-to-detail expansion
  const [currentView, setCurrentView] = useState<'intro' | 'corridor' | 'discovery'>('intro');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Lenis smooth momentum scroll for the 3D Space Shuttle Corridor
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();

  // Control Lenis: activate strictly when in 'corridor' view and no modal is open
  useEffect(() => {
    if (currentView === 'corridor' && !selectedSentinelId && !isTransitioning) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [currentView, selectedSentinelId, isTransitioning, lenis]);

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

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-sky-500 selection:text-black">
      {/* 
        STAGE 0: Dedicated Cinematic 3D Opening Sequence
        When the user finishes the intro or clicks "ENTER THE ARCHIVE", 
        it smoothly transitions directly to the Space Shuttle corridor or Discovery Gallery!
      */}
      {currentView === 'intro' && (
        <CinematicIntro
          onComplete={handleTransitionToCorridor}
        />
      )}

      {/* Global View Switcher Bar (Visible outside Intro) */}
      {currentView !== 'intro' && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-950/80 border border-white/15 backdrop-blur-md shadow-2xl">
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
        </div>
      )}

      {/* 
        STAGE 1: 3D Space Shuttle & Helical Sentinel Corridor View
        Features the central Space Shuttle stack, orbiting sentinel cards, Lenis momentum scroll!
      */}
      {currentView === 'corridor' && (
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
                <SentinelCarouselScene
                  scrollProgress={progress}
                  scrollVelocity={velocity}
                  selectedSentinelId={selectedSentinelId}
                  onSelectSentinel={(id) => setSelectedSentinelId(id)}
                />
              </Suspense>
            </Canvas>
          </div>

          {/* Cinematic Radial Vignette Overlay */}
          <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_42%,_rgba(0,0,0,0.85)_100%)]" />

          {/* Clean Mission Control Telemetry & Scroll Rail HUD */}
          <MissionControlHUD
            scrollProgress={progress}
            scrollVelocity={velocity}
            onNavigateStep={handleNavigateStep}
          />

          {/* Sentinel Dossier Inspection Modal */}
          <SentinelDetailModal
            sentinelId={selectedSentinelId}
            onClose={() => setSelectedSentinelId(null)}
          />

          {/* Lenis Momentum Scroll Track */}
          <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
        </div>
      )}

      {/* 
        STAGE 2: Lusion-Inspired Cinematic Artifact Discovery Gallery
        Features the balanced grid, mouse parallax tilt, and smooth shared-element card-to-detail expansion!
      */}
      {currentView === 'discovery' && (
        <CinematicArtifactDiscovery
          onBackToCorridor={() => handleSwitchView('corridor')}
          onReplayIntro={handleReplayIntro}
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
