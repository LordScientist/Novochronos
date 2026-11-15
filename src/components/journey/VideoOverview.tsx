import React, { useState } from 'react';
import { Play, Pause, ArrowRight, Film, Radio, Volume2 } from 'lucide-react';

interface VideoOverviewProps {
  onComplete: () => void;
}

export const VideoOverview: React.FC<VideoOverviewProps> = ({ onComplete }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between p-6 md:p-12 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Film className="w-5 h-5 text-amber-400" />
          <div>
            <span className="font-mono text-[10px] text-amber-400 block tracking-widest uppercase">
              STAGE 4 // CINEMATIC OVERVIEW
            </span>
            <h2 className="font-orbitron text-sm md:text-base font-bold text-white tracking-wider">
              THE SILENT SENTINELS OF SPACE
            </h2>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
        >
          <span>EXHIBITION GALLERY</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Center Widescreen Documentary Frame */}
      <div className="max-w-5xl w-full mx-auto my-8">
        <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-slate-700/80 shadow-2xl flex flex-col justify-between p-8 bg-gradient-to-b from-slate-900/60 via-slate-950/80 to-black">
          {/* Top Frame Watermark */}
          <div className="flex items-center justify-between z-10">
            <span className="font-mono text-xs tracking-widest text-slate-400 uppercase flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
              ARCHIVAL TRANSMISSION // 2026 RECONSTRUCTION
            </span>
            <span className="font-mono text-xs text-amber-400/90 font-bold">
              1080P // AUDIO SYNCHRONIZED
            </span>
          </div>

          {/* Center Cinematic Documentary Text */}
          <div className="text-center max-w-2xl mx-auto z-10">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-mono uppercase tracking-wider mb-4 inline-block">
              Humanity's Off-World Relics
            </span>
            <h3 className="font-orbitron text-2xl md:text-4xl font-extrabold text-white tracking-wide leading-tight">
              "We didn't leave trash. We built humanity's first monuments on other worlds."
            </h3>
            <p className="text-slate-300 text-xs md:text-sm font-sans mt-4 leading-relaxed">
              From the sea of tranquility where Neil's bootprints remain forever unweathered, to the dust-choked red sands of Endeavour Crater where Opportunity slept after 5,000 Martian sunrises.
            </p>
          </div>

          {/* Bottom Video Controls Bar */}
          <div className="glass-panel p-4 rounded-2xl flex items-center justify-between gap-4 z-10 border border-slate-800">
            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-3 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
            </button>

            {/* Video scrub simulator */}
            <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-400 h-full w-2/3" />
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span>01:14 / 01:50</span>
              <Volume2 className="w-4 h-4 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA to Gallery */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl w-full mx-auto">
        <p className="font-mono text-xs text-slate-400">
          Ready to explore all 8 sentinels up close in 3D?
        </p>
        <button
          onClick={onComplete}
          className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2"
        >
          <span>ENTER 3D EXHIBITION GALLERY</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
