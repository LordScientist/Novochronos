import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';

export const App: React.FC = () => {
  const { progress, velocity } = useSmoothScroll();
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  return (
    <div className="relative min-h-screen bg-black text-slate-100 overflow-x-hidden selection:bg-sky-500 selection:text-black">
      {/* 
        3D WebGL Canvas Layer (Fixed full-viewport stage)
        Features the Space Shuttle central spine, orbiting sentinel cards, and cosmic dust.
      */}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0.8, 10.5], fov: 45, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
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

      {/* Mission Control HUD Overlay (NASA Logo, Telemetry, Region Selector) */}
      <MissionControlHUD
        scrollProgress={progress}
        scrollVelocity={velocity}
        activeFilter={activeFilter}
        onFilterChange={(filter) => setActiveFilter(filter)}
        selectedSentinelId={selectedSentinelId}
        onResetSelection={() => setSelectedSentinelId(null)}
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
