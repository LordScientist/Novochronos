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

  // Mouse Parallax & 3D Tilt calculation
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    // Constrained subtle tilt angles (max 6 degrees for premium, non-gimmicky feel)
    setRotateX(-normalizedY * 6);
    setRotateY(normalizedX * 6);
    setMousePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

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
  const indexStr = `${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;

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
      className={`group relative rounded-2xl bg-[#080d1a] border border-white/10 overflow-hidden cursor-pointer select-none flex flex-col justify-between transition-opacity duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:border-white/30 hover:shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(56,189,248,0.15)] ${
        isDimmed ? 'opacity-20 scale-95 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Dynamic Specular Sheen (Follows mouse cursor) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle 280px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.12), transparent 80%)`,
        }}
      />

      {/* Top Media Showcase Container */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-black/60">
        <img
          src={imagePath}
          alt={artifact.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Vignette Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-black/40 pointer-events-none" />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 z-10 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-[10px] tracking-widest text-slate-400 font-semibold bg-black/60 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-full">
            {indexStr}
          </span>

          <span
            className="font-mono text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full backdrop-blur-md"
            style={{
              backgroundColor: `${artifact.accentColor}25`,
              color: artifact.accentColor,
              border: `1px solid ${artifact.accentColor}50`,
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
          <div className="flex items-center gap-2 mb-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: artifact.accentColor }}
            />
            <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase">
              {artifact.status} • {artifact.missionLifespan.actual.split('(')[0].trim()}
            </span>
          </div>

          {/* Canonical Headline Name */}
          <h3 className="font-orbitron text-lg font-bold text-white group-hover:text-amber-300 transition-colors tracking-wide leading-snug">
            {artifact.name.split('(')[0].trim()}
          </h3>

          {/* Subtitle / Tagline */}
          <p className="font-sans text-xs text-slate-400 font-light mt-2 line-clamp-2 leading-relaxed">
            {artifact.tagline}
          </p>
        </div>

        {/* Card Footer: Resting Coordinates & Action Pill */}
        <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-slate-400 font-mono text-[11px]">
          <div className="flex items-center gap-1.5 truncate max-w-[65%]">
            <Compass className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate text-slate-400 text-[10px]">{artifact.landingSite.split(',')[0]}</span>
          </div>

          <div className="flex items-center gap-1 text-amber-400 group-hover:text-amber-300 font-bold group-hover:translate-x-0.5 transition-all">
            <span className="text-[10px] uppercase tracking-wider">Inspect</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
