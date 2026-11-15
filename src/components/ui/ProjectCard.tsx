import React from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Artifact } from '../../types/artifact';

interface ProjectCardProps {
  artifact: Artifact;
  onSelect: (artifact: Artifact) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ artifact, onSelect }) => {
  const celestialColor =
    artifact.celestialBody === 'Mars'
      ? '#E26D5C'
      : artifact.celestialBody === 'Moon'
      ? '#54C9F5'
      : '#9DB4FF';

  return (
    <div
      onClick={() => onSelect(artifact)}
      className="group relative rounded-2xl bg-gradient-to-b from-cosmicNavy/40 via-obsidian/90 to-deepSpace/98 border border-titanium/15 hover:border-nebulaCyan/45 p-6 cursor-pointer select-none transition-all duration-400 hover:shadow-[0_20px_50px_rgba(26,47,251,0.22),0_0_30px_rgba(84,201,245,0.15)] flex flex-col justify-between"
    >
      {/* Precision Corner Reticle Indicators */}
      <div className="absolute top-2 left-2 pointer-events-none z-10 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute top-2 right-2 pointer-events-none z-10 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none z-10 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none z-10 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3 font-mono">
          <span
            className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold"
            style={{
              backgroundColor: 'rgba(16, 24, 42, 0.85)',
              color: celestialColor,
              border: `1px solid ${celestialColor}45`,
            }}
          >
            {artifact.celestialBody}
          </span>

          <div className="flex items-center gap-1.5 text-[10px] text-dustGrey border border-titanium/15 px-2 py-0.5 rounded-full bg-deepSpace/60">
            <span className="w-1.5 h-1.5 rounded-full bg-signalGreen animate-pulse shadow-[0_0_8px_#00F5A0]" />
            <span className="uppercase tracking-widest">{artifact.status}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-lunarWhite group-hover:text-nebulaCyan transition-colors duration-300 tracking-tight leading-snug">
          {artifact.name}
        </h3>

        {/* Tagline */}
        <p className="text-xs text-dustGrey font-sans mt-2 line-clamp-2 leading-relaxed">
          {artifact.tagline}
        </p>
      </div>

      {/* Details & Coordinates */}
      <div className="mt-6 pt-4 border-t border-titanium/10 text-[11px] font-mono text-dustGrey space-y-2">
        <div className="flex items-center gap-1.5 truncate">
          <Compass className="w-3.5 h-3.5 text-dustGrey shrink-0" />
          <span className="truncate text-[10px]">{artifact.landingSite}</span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[10px] text-dustGrey/80">{artifact.missionLifespan.actual.split('(')[0].trim()}</span>
          <div className="flex items-center gap-1 text-nebulaCyan group-hover:translate-x-0.5 transition-transform font-semibold text-[10px] uppercase tracking-wider">
            <span>Inspect 3D</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
