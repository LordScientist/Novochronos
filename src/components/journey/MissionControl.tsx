import React, { useState, useEffect } from 'react';
import { Rocket, RotateCcw } from 'lucide-react';
import { ARTIFACTS } from '../../data/artifacts';

interface MissionControlProps {
  onInitiateLaunch: () => void;
  onGoToGallery: () => void;
  onReplayIntro: () => void;
}

export const MissionControl: React.FC<MissionControlProps> = ({
  onInitiateLaunch,
  onGoToGallery,
  onReplayIntro,
}) => {
  const [missionTime, setMissionTime] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => setMissionTime((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatMET = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `+${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const marsCount = ARTIFACTS.filter((a) => a.celestialBody === 'Mars').length;
  const moonCount = ARTIFACTS.filter((a) => a.celestialBody === 'Moon').length;
  const deepSpaceCount = ARTIFACTS.filter((a) => a.celestialBody === 'Asteroid / Deep Space').length;

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between p-6 md:p-10 select-none">
      {/* Top Header Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-4">
          <img src="/nasa-logo.svg" alt="NASA" className="w-12 h-10 object-contain" />
          <div>
            <h2 className="font-orbitron text-lg font-bold tracking-wider text-white">
              NOVOCHRONOS MISSION CONTROL
            </h2>
            <p className="font-mono text-xs text-slate-400">
              Johnson Space Center // Deep Space Operations Center
            </p>
          </div>
        </div>

        {/* Clocks & Controls */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="bg-slate-900/90 border border-slate-800 rounded-lg px-4 py-2">
            <span className="text-[10px] text-slate-500 uppercase block">Mission Elapsed Time</span>
            <span className="text-amber-400 text-sm font-bold">{formatMET(missionTime)}</span>
          </div>

          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>3D INTRO</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 max-w-6xl w-full mx-auto">
        {/* Sector 1: Mars */}
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-martian flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-martian font-bold uppercase tracking-wider">
                SECTOR 01 // MARS
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-martian/20 text-martian font-bold">
                {marsCount} SENTINELS
              </span>
            </div>
            <h3 className="font-orbitron text-xl font-bold text-white mb-2">Red Planet Relics</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Opportunity, Ingenuity, InSight, and Sojourner resting across Jezero Crater, Endeavour Crater, and Elysium Planitia.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-500 flex justify-between">
            <span>SURFACE TEMP: -63°C</span>
            <span className="text-emerald-400">ORBITS SYNCED</span>
          </div>
        </div>

        {/* Sector 2: The Moon */}
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-lunar-glow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-wider">
                SECTOR 02 // THE MOON
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/20 text-sky-300 font-bold">
                {moonCount} SENTINELS
              </span>
            </div>
            <h3 className="font-orbitron text-xl font-bold text-white mb-2">Lunar Monuments</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Apollo 11 Descent Stage with ALSEP Retroreflector, Apollo 15 LRV Moon Buggy, and Surveyor 3 Scout.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-500 flex justify-between">
            <span>REGOLITH STABLE</span>
            <span className="text-emerald-400">LASER RETRO ACTIVE</span>
          </div>
        </div>

        {/* Sector 3: Deep Space */}
        <div className="glass-panel p-6 rounded-2xl border-t-4 border-t-cosmic-purple flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">
                SECTOR 03 // DEEP SPACE
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-purple-500/20 text-purple-300 font-bold">
                {deepSpaceCount} SENTINEL
              </span>
            </div>
            <h3 className="font-orbitron text-xl font-bold text-white mb-2">Interstellar Drift</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Pioneer 10 carrying humanity’s golden plaque across the heliosphere toward the star Aldebaran.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800/80 font-mono text-[11px] text-slate-500 flex justify-between">
            <span>DISTANCE: ~80 AU</span>
            <span className="text-purple-400">PERPETUAL FLIGHT</span>
          </div>
        </div>
      </div>

      {/* Central Launch CTA */}
      <div className="max-w-4xl w-full mx-auto glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-mono text-[11px] text-amber-400 uppercase tracking-widest block font-bold">
            STAGE 2 → STAGE 3 TRANSITION READY
          </span>
          <h4 className="font-orbitron text-lg font-bold text-white mt-1">
            Atmospheric Rocket Ignition & Ascent
          </h4>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Experience the 3D rocket ascent pierce through Earth's atmosphere into interplanetary space.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onGoToGallery}
            className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-mono text-xs tracking-wider uppercase transition-colors"
          >
            Direct to Gallery
          </button>

          <button
            onClick={onInitiateLaunch}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-orbitron font-extrabold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(245,158,11,0.8)] flex items-center gap-2 group"
          >
            <Rocket className="w-4 h-4 fill-current group-hover:-translate-y-0.5 transition-transform" />
            <span>INITIATE LAUNCH SEQUENCE</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800/60 pt-4 mt-6">
        <span>STAGE 2 // MISSION CONTROL COMMAND CENTER</span>
        <span>NOVOCHRONOS TELEMETRY GATEWAY</span>
      </div>
    </div>
  );
};
