import React from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Artifact } from '../../types/artifact';

interface ProjectCardProps {
  artifact: Artifact;
  onSelect: (artifact: Artifact) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ artifact, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(artifact)}
      className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-amber-500/50 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${artifact.accentColor}20`,
              color: artifact.accentColor,
              border: `1px solid ${artifact.accentColor}40`,
            }}
          >
            {artifact.celestialBody}
          </span>

          <span className="text-[10px] font-mono text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
            {artifact.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-orbitron text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
          {artifact.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-slate-300 font-sans mt-2 line-clamp-2 leading-relaxed">
          {artifact.tagline}
        </p>
      </div>

      {/* Details & Coordinates */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] font-mono text-slate-400 space-y-1.5">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Compass className="w-3.5 h-3.5 text-slate-500" />
          <span className="truncate">{artifact.landingSite}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-slate-500">{artifact.missionLifespan.actual}</span>
          <span className="text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform flex items-center gap-0.5 font-bold">
            Inspect 3D <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
