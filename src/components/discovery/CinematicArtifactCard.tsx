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

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`group relative rounded-2xl bg-obsidian/85 border border-titanium/15 overflow-hidden cursor-pointer select-none flex flex-col justify-between transition-all duration-500 shadow-[0_16px_40px_rgba(0,0,0,0.7)] hover:border-nebulaCyan/40 hover:shadow-[0_24px_50px_rgba(26,47,251,0.25)] ${
        isDimmed ? 'opacity-20 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Specular Sheen (Follows mouse cursor) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 300px at ${mousePos.x}% ${mousePos.y}%, rgba(84, 201, 245, 0.12), transparent 75%)`,
        }}
      />

      {/* Top Media Showcase Container - Full edge-to-edge as in commit 32707ae */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-deepSpace">
        <img
          src={imagePath}
          alt={artifact.name}
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Horizon Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-deepSpace/40 pointer-events-none" />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none font-mono">
          <span className="text-[10px] tracking-widest text-dustGrey font-medium bg-deepSpace/80 border border-titanium/15 backdrop-blur-md px-2.5 py-1 rounded-full">
            {indexStr}
          </span>

          <span
            className="text-[9px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(16, 24, 42, 0.85)',
              color: artifact.accentColor || '#54C9F5',
              border: `1px solid ${artifact.accentColor || '#54C9F5'}40`,
            }}
          >
            {artifact.celestialBody}
          </span>
        </div>
      </div>

      {/* Editorial Content Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Status & Lifespan Micro-Row */}
          <div className="flex items-center gap-2 mb-2 font-mono">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: artifact.accentColor || '#54C9F5' }}
            />
            <span className="text-[10px] text-dustGrey tracking-wider uppercase">
              {artifact.status} • {artifact.missionLifespan.actual.split('(')[0].trim()}
            </span>
          </div>

          {/* Canonical Headline Name */}
          <h3 className="font-display text-lg font-bold text-lunarWhite group-hover:text-nebulaCyan transition-colors tracking-tight leading-snug">
            {artifact.name.split('(')[0].trim()}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="font-sans text-xs text-dustGrey font-normal mt-2 line-clamp-2 leading-relaxed">
            {artifact.tagline}
          </p>
        </div>

        {/* Card Footer: Resting Coordinates & Action Pill */}
        <div className="mt-5 pt-3.5 border-t border-titanium/10 flex items-center justify-between text-dustGrey font-mono text-[11px]">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <Compass className="w-3.5 h-3.5 text-dustGrey shrink-0" />
            <span className="truncate text-dustGrey text-[10px]">{artifact.landingSite.split(',')[0]}</span>
          </div>

          <div className="flex items-center gap-1 text-nebulaCyan font-semibold group-hover:translate-x-0.5 transition-all">
            <span className="text-[10px] uppercase tracking-wider">Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
