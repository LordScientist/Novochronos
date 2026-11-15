import React, { useState } from 'react';
import { ARTIFACTS } from '../../data/artifacts';
import { Artifact, CelestialBody } from '../../types/artifact';
import { CinematicArtifactCard } from './CinematicArtifactCard';
import { CinematicArtifactExpanded } from './CinematicArtifactExpanded';

interface CinematicArtifactDiscoveryProps {
  onBackToCorridor?: () => void;
  onReplayIntro?: () => void;
  onLaunchGame?: (artifact: Artifact) => void;
}

export const CinematicArtifactDiscovery: React.FC<CinematicArtifactDiscoveryProps> = ({
  onBackToCorridor,
  onReplayIntro,
  onLaunchGame,
}) => {
  const [filter, setFilter] = useState<'ALL' | CelestialBody>('ALL');
  const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);

  const filteredArtifacts = ARTIFACTS.filter((art) => {
    if (filter === 'ALL') return true;
    return art.celestialBody === filter;
  });

  const handleSelectCard = (artifact: Artifact, rect: DOMRect) => {
    setOriginRect(rect);
    setSelectedArtifact(artifact);
  };

  const handleCloseExpanded = () => {
    setSelectedArtifact(null);
    setOriginRect(null);
  };

  // Ensure Lenis smooth scroll recalculates page dimensions on mount and filter changes
  React.useEffect(() => {
    const lenis = (window as any).__lenis;
    lenis?.start();
    lenis?.resize();
    window.dispatchEvent(new Event('resize'));
  }, [filter]);

  // Prevent background page scrolling while an artifact is expanded
  React.useEffect(() => {
    const lenis = (window as any).__lenis;
    if (selectedArtifact) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      lenis?.stop();
      return () => {
        document.body.style.overflow = originalOverflow;
        lenis?.start();
        lenis?.resize();
      };
    }
  }, [selectedArtifact]);

  return (
    <div className="relative min-h-screen bg-deepSpace text-lunarWhite select-none px-3 xs:px-5 sm:px-8 md:px-16 py-8 sm:py-10 md:py-16 flex flex-col justify-between">
      {/* Background Subtle Radial Depth */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,24,42,0.45)_0%,_rgba(5,7,13,0.98)_70%)]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Editorial Top Navigation & Header */}
        <div className="border-b border-titanium/15 pb-6 sm:pb-10 mb-8 sm:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <span className="w-2 h-2 rounded-full bg-signalGreen animate-pulse" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.22em] text-nebulaCyan uppercase font-semibold">
                ECHOES OF EXPLORATION // PERMANENT MONUMENTS
              </span>
            </div>

            <h1 className="type-section text-lunarWhite font-extrabold tracking-tight leading-none mb-3 sm:mb-4">
              THE EIGHT SENTINELS
            </h1>

            <p className="type-subhead max-w-2xl leading-relaxed text-dustGrey font-normal">
              Humanity's off-world pioneers resting in eternal stillness across the Moon, Mars, and deep space.
              Select any sentinel to inspect its mechanical architecture, sensor arrays, and spoken history.
            </p>
          </div>

          {/* Celestial Filter Tabs (horizontally scrollable without scrollbar on mobile) */}
          <div className="flex items-center gap-1.5 p-1 sm:p-1.5 rounded-full bg-obsidian/85 border border-titanium/15 backdrop-blur-xl shadow-xl shrink-0 self-start lg:self-auto font-mono max-w-full overflow-x-auto no-scrollbar">
            {(['ALL', 'Mars', 'Moon', 'Asteroid / Deep Space'] as const).map((cat) => {
              const count =
                cat === 'ALL'
                  ? ARTIFACTS.length
                  : ARTIFACTS.filter((a) => a.celestialBody === cat).length;
              const isActive = filter === cat;
              const label = cat === 'Asteroid / Deep Space' ? 'Deep Space' : cat;

              return (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-[10px] sm:text-[11px] tracking-wider transition-all flex items-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-stellarBlue text-lunarWhite font-semibold shadow-[0_0_15px_rgba(26,47,251,0.4)]'
                      : 'text-dustGrey hover:text-lunarWhite hover:bg-cosmicNavy/50'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-deepSpace/40 text-lunarWhite font-bold' : 'bg-cosmicNavy text-dustGrey'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Artifact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-7">
          {filteredArtifacts.map((artifact, idx) => (
            <CinematicArtifactCard
              key={artifact.id}
              artifact={artifact}
              index={idx}
              total={filteredArtifacts.length}
              onSelect={handleSelectCard}
              isDimmed={selectedArtifact !== null && selectedArtifact.id !== artifact.id}
            />
          ))}
        </div>
      </div>

      {/* Expanded Shared-Element Cinematic View Modal */}
      {selectedArtifact && originRect && (
        <CinematicArtifactExpanded
          artifact={selectedArtifact}
          originRect={originRect}
          onClose={handleCloseExpanded}
          onLaunchGame={(art) => {
            handleCloseExpanded();
            onLaunchGame?.(art);
          }}
        />
      )}

      {/* Bottom Editorial Footer */}
      <div className="relative z-10 max-w-7xl w-full mx-auto mt-20 pt-8 border-t border-titanium/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-dustGrey font-mono text-[11px] tracking-wider">
        <div className="flex items-center gap-3">
          <img src="/nasa-logo.svg" alt="NASA" className="w-7 h-5 object-contain" />
          <span>NASA SPACE APPS CHALLENGE 2026 // NOVOCHRONOS</span>
        </div>

        <div className="flex items-center gap-5">
          {onBackToCorridor && (
            <button
              onClick={onBackToCorridor}
              className="text-dustGrey hover:text-nebulaCyan transition-colors cursor-pointer"
            >
              ← 3D Shuttle Corridor
            </button>
          )}

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="text-dustGrey hover:text-nebulaCyan transition-colors cursor-pointer"
            >
              Replay Introduction
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
