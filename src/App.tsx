import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { CinematicIntro } from './components/journey/CinematicIntro';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';

export const App: React.FC = () => {
  // App begins on the 3D Cinematic Opening Sequence ('intro')
  // When user enters the archive, transitions smoothly to 'archive' (Shuttle & Cards)
  const [currentView, setCurrentView] = useState<'intro' | 'archive'>('intro');
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Lenis smooth momentum scroll for the 3D Space Shuttle Corridor
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();

  // Control Lenis: activate strictly when in 'archive' view and no dossier modal is open
  useEffect(() => {
    if (currentView === 'archive' && !selectedSentinelId && !isTransitioning) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [currentView, selectedSentinelId, isTransitioning, lenis]);

  // Smooth cinematic ease transition from Intro into Archive
  const handleTransitionToArchive = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('archive');
      lenis?.scrollTo(0, { immediate: true });
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, 500);
  }, [lenis]);

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
        it smoothly transitions directly to the Space Shuttle and helical card animation!
      */}
      {currentView === 'intro' && (
        <CinematicIntro
          onComplete={handleTransitionToArchive}
        />
      )}

      {/* 
        STAGE 1: 3D Space Shuttle & Helical Sentinel Corridor (Primary Archive Experience)
        Features the central Space Shuttle stack, orbiting sentinel cards, Lenis momentum scroll,
        Active Theory card transitions, 3D artifact model inspection, and authentic audio!
      */}
      {currentView === 'archive' && (
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

          {/* Sentinel Dossier Inspection Modal with Active Theory Transitions, 3D Podium & Audio */}
          <SentinelDetailModal
            sentinelId={selectedSentinelId}
            onClose={() => setSelectedSentinelId(null)}
          />

          {/* Lenis Momentum Scroll Track */}
          <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
        </div>
      )}

      {/* End-to-End Cinematic Stage Dissolve Transition Overlay */}
      <div
        className={`pointer-events-none fixed inset-0 z-50 bg-black transition-opacity duration-500 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};

export default App;
