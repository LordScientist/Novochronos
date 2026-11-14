import React, { useState } from 'react';
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
import { Navbar } from './components/ui/Navbar';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';

export const App: React.FC = () => {
  // Master Journey State: Stage 0 is the default initial state
  const [currentStage, setCurrentStage] = useState<JourneyStage>('intro');
  // Selected artifact for Stage 6 Podium Detail
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact>(ARTIFACTS[0]);

  // Navigate to next / previous artifact in Stage 6
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
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col">
      {/* Global Navbar (Active across Stages 1 to 6) */}
      <Navbar
        currentStage={currentStage}
        onSelectStage={(stage) => setCurrentStage(stage)}
        onReplayIntro={() => setCurrentStage('intro')}
      />

      <main className="flex-1 flex flex-col">
        {/* STAGE 0: Dedicated Cinematic 3D Opening Sequence */}
        {currentStage === 'intro' && (
          <CinematicIntro
            onComplete={() => setCurrentStage('terminal')}
          />
        )}

        {/* STAGE 1: NASA Command Terminal Boot */}
        {currentStage === 'terminal' && (
          <CommandTerminal
            onProceed={() => setCurrentStage('command-center')}
            onReplayIntro={() => setCurrentStage('intro')}
          />
        )}

        {/* STAGE 2: Mission Control Dashboard */}
        {currentStage === 'command-center' && (
          <MissionControl
            onInitiateLaunch={() => setCurrentStage('launch')}
            onGoToGallery={() => setCurrentStage('gallery')}
            onReplayIntro={() => setCurrentStage('intro')}
          />
        )}

        {/* STAGE 3: Atmospheric Rocket Launch Ascent */}
        {currentStage === 'launch' && (
          <LaunchScene
            onComplete={() => setCurrentStage('video-overview')}
          />
        )}

        {/* STAGE 4: Cinematic Video Overview */}
        {currentStage === 'video-overview' && (
          <VideoOverview
            onComplete={() => setCurrentStage('gallery')}
          />
        )}

        {/* STAGE 5: Exhibition Gallery Grid */}
        {currentStage === 'gallery' && (
          <GalleryView
            onSelectArtifact={(art) => {
              setSelectedArtifact(art);
              setCurrentStage('podium-detail');
            }}
          />
        )}

        {/* STAGE 6: 3D Museum Podium & Deep-Dive Detail View */}
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
