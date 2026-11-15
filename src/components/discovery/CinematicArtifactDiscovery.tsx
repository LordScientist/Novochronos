import React, { useState } from 'react';
import { ARTIFACTS } from '../../data/artifacts';
import { Artifact, CelestialBody } from '../../types/artifact';
import { CinematicArtifactCard } from './CinematicArtifactCard';
import { CinematicArtifactExpanded } from './CinematicArtifactExpanded';

interface CinematicArtifactDiscoveryProps {
  onBackToCorridor?: () => void;
  onReplayIntro?: () => void;
}

export const CinematicArtifactDiscovery: React.FC<CinematicArtifactDiscoveryProps> = ({
  onBackToCorridor,
  onReplayIntro,
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

  return (
    <div className="relative min-h-screen bg-[#030611] text-slate-100 select-none px-4 sm:px-6 md:px-12 py-8 md:py-12 flex flex-col justify-between">
      {/* Background Subtle Radial Glow & Deep Space Fog */}
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_rgba(15,23,42,0.6)_0%,_rgba(3,6,17,0.95)_70%)]" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto">
        {/* Editorial Top Navigation & Header */}
        <div className="border-b border-white/10 pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.25em] text-amber-400 uppercase font-bold">
                ECHOES OF EXPLORATION // ARTIFACT ARCHIVE
              </span>
            </div>

            <h1 className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-wide leading-tight">
              THE EIGHT SENTINELS
            </h1>

            <p className="font-sans text-xs sm:text-sm text-slate-300 font-light mt-2.5 max-w-2xl leading-relaxed">
              Humanity's off-world pioneers resting in eternal stillness across the Moon, Mars, and deep space.
              Click any artifact card to expand into an immersive 3D inspection and voice-acted story.
            </p>
          </div>

          {/* Celestial Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/70 border border-white/10 backdrop-blur-md shadow-xl shrink-0 self-start md:self-auto">
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
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-950/30 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        />
      )}

      {/* Bottom Editorial Footer */}
      <div className="relative z-10 max-w-7xl w-full mx-auto mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[11px]">
        <div className="flex items-center gap-3">
          <img src="/nasa-logo.svg" alt="NASA" className="w-7 h-5 object-contain" />
          <span>NASA SPACE APPS CHALLENGE 2026 // NOVOCHRONOS</span>
        </div>

        <div className="flex items-center gap-4">
          {onBackToCorridor && (
            <button
              onClick={onBackToCorridor}
              className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              ← Return to 3D Space Shuttle Corridor
            </button>
          )}

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Replay 3D Intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
