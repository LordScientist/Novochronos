import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';

export const App: React.FC = () => {
  const { progress, velocity, scrollToProgress } = useSmoothScroll();
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const handleNavigateStep = (direction: 'prev' | 'next') => {
    const step = 1 / 7;
    const currentStepIndex = Math.round(progress / step);
    const targetStep = direction === 'next' ? currentStepIndex + 1 : currentStepIndex - 1;
    scrollToProgress(targetStep * step);
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-100 overflow-x-hidden selection:bg-sky-500 selection:text-black">
      {/* 
        3D WebGL Canvas Layer (Fixed full-viewport stage)
        Features the Space Shuttle central launch stack, ambient space background,
        stars, nebulae, Earth atmospheric limb, and the 3D helical card formation.
      */}
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
          <color attach="background" args={['#010409']} />
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

      {/* Mission Control HUD Overlay (NASA Logo, Telemetry, Beginner Guide, Step Navigators) */}
      <MissionControlHUD
        scrollProgress={progress}
        scrollVelocity={velocity}
        activeFilter={activeFilter}
        onFilterChange={(filter) => setActiveFilter(filter)}
        selectedSentinelId={selectedSentinelId}
        onResetSelection={() => setSelectedSentinelId(null)}
        onNavigateStep={handleNavigateStep}
      />

      {/* Sentinel Dossier Inspection Modal with Narration Audio Readout */}
      <SentinelDetailModal
        sentinelId={selectedSentinelId}
        onClose={() => setSelectedSentinelId(null)}
      />

      {/* 
        Lenis Scroll Track:
        Provides the virtual height needed for smooth inertial scroll progression
      */}
      <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
    </div>
  );
};

export default App;
