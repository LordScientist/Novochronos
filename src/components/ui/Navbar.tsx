import React from 'react';
import { JourneyStage } from '../../types/journey';
import { RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentStage: JourneyStage;
  onSelectStage: (stage: JourneyStage) => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentStage,
  onSelectStage,
  onReplayIntro,
}) => {
  if (currentStage === 'intro') {
    // Stage 0 renders its own dedicated full-bleed cinematic overlay
    return null;
  }

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3.5 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: NASA Insignia & Brand */}
        <div
          onClick={() => onSelectStage('gallery')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <img src="/nasa-logo.svg" alt="NASA" className="w-10 h-8 object-contain" />
          <div className="border-l border-slate-800 pl-3">
            <h1 className="font-orbitron text-sm font-black tracking-wider text-white group-hover:text-amber-400 transition-colors">
              NOVOCHRONOS
            </h1>
            <p className="font-mono text-[10px] text-slate-400">
              NASA SPACE APPS 2026
            </p>
          </div>
        </div>

        {/* Center: Stage Navigation Quick Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-full px-3 py-1 font-mono text-xs">
          <button
            onClick={() => onSelectStage('terminal')}
            className={`px-3 py-1 rounded-full transition-all ${
              currentStage === 'terminal' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            01 Terminal
          </button>
          <button
            onClick={() => onSelectStage('command-center')}
            className={`px-3 py-1 rounded-full transition-all ${
              currentStage === 'command-center' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            02 Control
          </button>
          <button
            onClick={() => onSelectStage('launch')}
            className={`px-3 py-1 rounded-full transition-all ${
              currentStage === 'launch' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            03 Launch
          </button>
          <button
            onClick={() => onSelectStage('video-overview')}
            className={`px-3 py-1 rounded-full transition-all ${
              currentStage === 'video-overview' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            04 Video
          </button>
          <button
            onClick={() => onSelectStage('gallery')}
            className={`px-3 py-1 rounded-full transition-all ${
              currentStage === 'gallery' || currentStage === 'podium-detail' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            05 Gallery
          </button>
        </nav>

        {/* Right: Replay 3D Intro Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-mono text-xs tracking-wider transition-all shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>REPLAY 3D INTRO</span>
          </button>
        </div>
      </div>
    </header>
  );
};
