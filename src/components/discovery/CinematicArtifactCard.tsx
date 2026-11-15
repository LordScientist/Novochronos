import React, { useRef, useState, useCallback } from 'react';
import { ArrowUpRight, Compass } from 'lucide-react';
import { Artifact } from '../../types/artifact';

interface CinematicArtifactCardProps {
  artifact: Artifact;
  index: number;
  total: number;
  onSelect: (artifact: Artifact, originRect: DOMRect) => void;
  isDimmed?: boolean;
}

export const CinematicArtifactCard: React.FC<CinematicArtifactCardProps> = ({
  artifact,
  index,
  total,
  onSelect,
  isDimmed = false,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState<number>(0);
  const [rotateY, setRotateY] = useState<number>(0);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Mouse Parallax & 3D Tilt calculation (subtle 5 degree max for high-craft feel)
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    setRotateX(-normalizedY * 5);
    setRotateY(normalizedX * 5);
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setMousePos({ x: 50, y: 50 });
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    onSelect(artifact, rect);
  };

  const imagePath = `/images/sentinels/${artifact.id}.jpg`;
  const indexStr = `${String(index + 1).padStart(2, '0')} // ${String(total).padStart(2, '0')}`;

  // Celestial color styling
  const celestialColor =
    artifact.celestialBody === 'Mars'
      ? '#E26D5C'
      : artifact.celestialBody === 'Moon'
      ? '#54C9F5'
      : '#9DB4FF';

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative rounded-2xl bg-gradient-to-b from-cosmicNavy/40 via-obsidian/90 to-deepSpace/98 border border-titanium/15 overflow-hidden cursor-pointer select-none flex flex-col justify-between transition-all duration-500 shadow-[0_16px_40px_rgba(0,0,0,0.8)] hover:border-nebulaCyan/45 hover:shadow-[0_24px_55px_rgba(26,47,251,0.22),0_0_35px_rgba(84,201,245,0.18)] ${
        isDimmed ? 'opacity-20 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Precision Corner Reticle Indicators (Scientific Viewfinder Ticks) */}
      <div className="absolute top-2 left-2 pointer-events-none z-30 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute top-2 right-2 pointer-events-none z-30 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute bottom-2 left-2 pointer-events-none z-30 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>
      <div className="absolute bottom-2 right-2 pointer-events-none z-30 text-[9px] font-mono leading-none text-titanium/25 group-hover:text-nebulaCyan/70 transition-colors duration-300">
        +
      </div>

      {/* Dynamic Specular Sheen (Follows mouse cursor) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 320px at ${mousePos.x}% ${mousePos.y}%, rgba(84, 201, 245, 0.12), transparent 75%)`,
        }}
      />

      {/* Top Media Showcase Container */}
      <div className="relative w-full aspect-[16/11] overflow-hidden bg-deepSpace">
        <img
          src={imagePath}
          alt={artifact.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Horizon Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-deepSpace/40 pointer-events-none" />

        {/* Top Scanline Laser Telemetry Accent */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-nebulaCyan/40 to-transparent pointer-events-none" />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none font-mono">
          <span className="text-[10px] tracking-widest text-dustGrey font-medium bg-deepSpace/80 border border-titanium/15 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
            {indexStr}
          </span>

          <span
            className="text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm"
            style={{
              backgroundColor: 'rgba(9, 13, 22, 0.85)',
              color: celestialColor,
              border: `1px solid ${celestialColor}45`,
            }}
          >
            {artifact.celestialBody}
          </span>
        </div>
      </div>

      {/* Editorial Content Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status & Archetype Micro-Row */}
          <div className="flex items-center justify-between gap-2 mb-2 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-signalGreen animate-pulse shadow-[0_0_8px_#00F5A0]" />
              <span className="text-[9px] text-dustGrey tracking-widest uppercase font-medium">
                {artifact.status}
              </span>
            </div>

            <span className="text-[9px] text-titanium/60 tracking-wider uppercase truncate max-w-[50%] font-mono">
              {artifact.characterArchetype}
            </span>
          </div>

          {/* Canonical Headline Name */}
          <h3 className="font-display text-lg sm:text-xl font-bold text-lunarWhite group-hover:text-nebulaCyan transition-colors duration-300 tracking-tight leading-snug">
            {artifact.name.split('(')[0].trim()}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="font-sans text-xs text-dustGrey font-normal mt-2 line-clamp-2 leading-relaxed">
            {artifact.tagline}
          </p>

          {/* Micro Telemetry Strip */}
          <div className="mt-3 grid grid-cols-2 gap-2 p-2 rounded-lg bg-deepSpace/50 border border-titanium/10 font-mono text-[9px] text-dustGrey">
            <div>
              <span className="text-titanium/50 block text-[8px] uppercase tracking-wider">LIFESPAN</span>
              <span className="text-lunarWhite/90 font-medium truncate block">
                {artifact.missionLifespan.actual.split('(')[0].trim()}
              </span>
            </div>
            <div>
              <span className="text-titanium/50 block text-[8px] uppercase tracking-wider">COORDINATES</span>
              <span className="text-nebulaCyan/90 font-medium truncate block">
                {artifact.coordinates || artifact.landingSite.split(',')[0]}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Resting Coordinates & Action Pill */}
        <div className="mt-5 pt-3.5 border-t border-titanium/10 flex items-center justify-between text-dustGrey font-mono text-[11px]">
          <div className="flex items-center gap-1.5 truncate max-w-[55%]">
            <Compass className="w-3.5 h-3.5 text-dustGrey shrink-0" />
            <span className="truncate text-dustGrey text-[10px]">{artifact.landingSite.split(',')[0]}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cosmicNavy/60 group-hover:bg-stellarBlue/25 border border-titanium/15 group-hover:border-nebulaCyan/40 text-nebulaCyan font-semibold transition-all duration-300 shadow-sm">
            <span className="text-[10px] uppercase tracking-wider">INSPECT</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};
