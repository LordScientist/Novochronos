import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { SentinelCarouselScene } from './components/canvas/SentinelCarouselScene';
import { MissionControlHUD } from './components/ui/MissionControlHUD';
import { SentinelDetailModal } from './components/ui/SentinelDetailModal';

export const App: React.FC = () => {
  const { lenis, progress, velocity, scrollToProgress } = useSmoothScroll();
  const [selectedSentinelId, setSelectedSentinelId] = useState<string | null>(null);

  // Freeze main background helix scroll while sentinel dossier is open
  useEffect(() => {
    if (selectedSentinelId) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [selectedSentinelId, lenis]);

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
        Pure obsidian #000000 background with native depth fog and space lighting
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

      {/* 
        Cinematic Radial Vignette Overlay (Active Theory & Space Trash Signs Token)
        Tapers viewport corners into pitch black #000000, creating massive focal depth
      */}
      <div className="pointer-events-none fixed inset-0 z-10 bg-[radial-gradient(ellipse_at_center,_transparent_42%,_rgba(0,0,0,0.85)_100%)]" />

      {/* Minimal Clean HUD Overlay */}
      <MissionControlHUD
        scrollProgress={progress}
        scrollVelocity={velocity}
        onNavigateStep={handleNavigateStep}
      />

      {/* Sentinel Dossier Inspection Modal with Voiceover Readout */}
      <SentinelDetailModal
        sentinelId={selectedSentinelId}
        onClose={() => setSelectedSentinelId(null)}
      />

      {/* Lenis Momentum Scroll Track */}
      <div className="relative z-10 w-full h-[600vh] pointer-events-none" />
    </div>
  );
};

export default App;
