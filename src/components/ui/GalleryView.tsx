import React, { useState } from 'react';
import { ARTIFACTS } from '../../data/artifacts';
import { Artifact, CelestialBody } from '../../types/artifact';
import { ProjectCard } from './ProjectCard';

interface GalleryViewProps {
  onSelectArtifact: (artifact: Artifact) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onSelectArtifact }) => {
  const [filter, setFilter] = useState<'ALL' | CelestialBody>('ALL');

  const filteredArtifacts = ARTIFACTS.filter((art) => {
    if (filter === 'ALL') return true;
    return art.celestialBody === filter;
  });

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 p-6 md:p-12 select-none">
      {/* Header & Celestial Filter Tabs */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-8 mb-8">
        <div>
          <span className="font-mono text-xs tracking-[0.25em] text-amber-400 uppercase font-semibold block mb-2">
            STAGE 5 // EXHIBITION ARCHIVE
          </span>
          <h2 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white tracking-wide">
            THE EIGHT SILENT SENTINELS
          </h2>
          <p className="text-sm text-slate-400 mt-2 font-sans max-w-xl">
            Select any rover, lander, or deep-space probe to enter the 3D museum podium, inspect its engineering, and listen to its voice-acted story.
          </p>
        </div>

        {/* Celestial Filter Pills */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
          {(['ALL', 'Mars', 'Moon', 'Asteroid / Deep Space'] as const).map((cat) => {
            const count =
              cat === 'ALL'
                ? ARTIFACTS.length
                : ARTIFACTS.filter((a) => a.celestialBody === cat).length;
            const isActive = filter === cat;

            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-mono text-xs transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <span>{cat === 'Asteroid / Deep Space' ? 'Deep Space' : cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Artifact Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArtifacts.map((artifact) => (
          <ProjectCard
            key={artifact.id}
            artifact={artifact}
            onSelect={onSelectArtifact}
          />
        ))}
      </div>
    </div>
  );
};
