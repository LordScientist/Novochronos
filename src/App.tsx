import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { JourneyStage } from './types/journey';
import { Artifact } from './types/artifact';
import { ARTIFACTS } from './data/artifacts';
import { CinematicIntro } from './components/journey/CinematicIntro';
import { CommandTerminal } from './components/journey/CommandTerminal';
import { MissionControl } from './components/journey/MissionControl';
import { LaunchScene } from './components/canvas/LaunchScene';
import { VideoOverview } from './components/journey/VideoOverview';
import { GalleryView } from './components/ui/GalleryView';
import { PodiumStage } from './components/canvas/PodiumStage';
import { MuseumPlaque } from './components/ui/MuseumPlaque';
import { AudioNarrator } from './components/ui/AudioNarrator';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';
import { Navbar } from './components/ui/Navbar';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  // Master Journey State: Stage 0 is the default initial state
  const [currentStage, setCurrentStage] = useState<JourneyStage>('intro');
  // Selected sentinel for the 3D Space Shuttle Corridor
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);
  // Selected artifact for Stage 6 Podium Detail
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>(ARTIFACTS[0]);

  // Lenis smooth momentum scroll for the 3D Space Shuttle Corridor
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();

  // Control Lenis: activate strictly when in 'corridor' stage and no modal is open
  useEffect(() => {
    if (currentStage === 'corridor' && !selectedSentinelId) {
      lenis?.start();
    } else {
      lenis?.stop();
    }
  }, [currentStage, selectedSentinelId, lenis]);

  // Stepper navigation along the 3D helix
  const handleNavigateStep = (direction: 'prev' | 'next') => {
    const step = 1 / 7;
    const currentStepIndex = Math.round(progress / step);
    const targetStep = direction === 'next' ? currentStepIndex + 1 : currentStepIndex - 1;
    scrollToProgress(targetStep * step);
  };

  // Navigate to next / previous artifact in Stage 6 Podium Detail
  const handlePrevArtifact = () => {
    const currentIdx = ARTIFACTS.findIndex((a) => a.id === selectedArtifact.id);
    const prevIdx = (currentIdx - 1 + ARTIFACTS.length) % ARTIFACTS.length;
    setSelectedArtifact(ARTIFACTS[prevIdx]);
  };

  const handleNextArtifact = () => {
    const currentIdx = ARTIFACTS.findIndex((a) => a.id === selectedArtifact.id);
    const nextIdx = (currentIdx + 1) % ARTIFACTS.length;
    setSelectedArtifact(ARTIFACTS[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col selection:bg-sky-500 selection:text-black">
      {/* Global Navbar (Active across all stages except Stage 0 intro) */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        onReplayIntro={() => setCurrentStage('intro')}
      />

      <main className="flex-1 flex flex-col relative">
        {/* 
          STAGE 0: Dedicated Cinematic 3D Opening Sequence
          When the user finishes the intro or clicks "ENTER THE ARCHIVE", 
          it smoothly transitions directly to the Space Shuttle and helical card animation!
        */}
        {currentStage === 'intro' && (
          <CinematicIntro
            onComplete={() => setCurrentStage('corridor')}
          />
        )}

        {/* 
          STAGE 1: 3D Space Shuttle & Helical Sentinel Corridor (Primary Archive Experience)
          Features the central Space Shuttle stack, orbiting sentinel cards, Lenis momentum scroll,
          Active Theory card transitions, 3D artifact model inspection, and authentic audio!
        */}
        {currentStage === 'corridor' && (
          <div className="relative min-h-[calc(100vh-65px)] bg-black text-slate-100 overflow-x-hidden">
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

            {/* Right-Hand Rail Scroll HUD */}
            <MissionControlHUD
              scrollProgress={progress}
              scrollVelocity={velocity}
              onNavigateStep={handleNavigateStep}
            />

            {/* Sentinel Dossier Inspection Modal with Active Theory Transitions & 3D Podium */}
            <SentinelDetailModal
              sentinelId={selectedSentinelId}
              onClose={() => setSelectedSentinelId(null)}
            />

            {/* Lenis Momentum Scroll Track */}
            <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
          </div>
        )}

        {/* STAGE 2: NASA Command Terminal Boot */}
        {currentStage === 'terminal' && (
          <CommandTerminal
            onProceed={() => setCurrentStage('command-center')}
            onReplayIntro={() => setCurrentStage('intro')}
          />
        )}

        {/* STAGE 3: Mission Control Dashboard */}
        {currentStage === 'command-center' && (
          <MissionControl
            onInitiateLaunch={() => setCurrentStage('launch')}
            onGoToGallery={() => setCurrentStage('gallery')}
            onReplayIntro={() => setCurrentStage('intro')}
          />
        )}

        {/* STAGE 4: Atmospheric Rocket Launch Ascent */}
        {currentStage === 'launch' && (
          <LaunchScene
            onComplete={() => setCurrentStage('video-overview')}
          />
        )}

        {/* STAGE 5: Cinematic Video Overview */}
        {currentStage === 'video-overview' && (
          <VideoOverview
            onComplete={() => setCurrentStage('gallery')}
          />
        )}

        {/* STAGE 6: Exhibition Gallery Grid */}
        {currentStage === 'gallery' && (
          <GalleryView
            onSelectArtifact={(art) => {
              setSelectedArtifact(art);
              setCurrentStage('podium-detail');
            }}
          />
        )}

        {/* STAGE 7: 3D Museum Podium & Deep-Dive Detail View */}
        {currentStage === 'podium-detail' && (
          <div className="relative flex-1 flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
            {/* Left/Background: 3D WebGL Canvas */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-auto relative">
              <PodiumStage artifact={selectedArtifact} />

              {/* Back to Gallery floating button */}
              <button
                onClick={() => setCurrentStage('gallery')}
                className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-mono text-xs backdrop-blur-md transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>BACK TO GALLERY</span>
              </button>
            </div>

            {/* Right: Curated Museum Placard & Audio Narrator HUD */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col justify-between gap-6 overflow-y-auto">
              {/* Exhibit Counter & Navigation */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs text-amber-400 uppercase tracking-widest">
                  EXHIBIT {ARTIFACTS.findIndex((a) => a.id === selectedArtifact.id) + 1} OF {ARTIFACTS.length}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevArtifact}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                    title="Previous Exhibit"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextArtifact}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                    title="Next Exhibit"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* 3-Tab Placard Component */}
              <MuseumPlaque artifact={selectedArtifact} />

              {/* Integrated Audio Narrator Player */}
              <AudioNarrator artifact={selectedArtifact} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
