import React from 'react';
import {
  BatteryCharging,
  BatteryWarning,
  RotateCcw,
  ArrowLeft,
  Flame,
  Award,
} from 'lucide-react';
import { GameTelemetry } from '../../types/game';
import { Artifact } from '../../types/artifact';

interface GameHUDProps {
  telemetry: GameTelemetry;
  selectedArtifact: Artifact;
  countdown: string | null;
  onRestart: () => void;
  onExit: () => void;
  onBoost?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  telemetry,
  selectedArtifact,
  countdown,
  onRestart,
  onExit,
  onBoost,
}) => {
  const powerPercent = Math.max(0, Math.min(100, Math.round((telemetry.power / telemetry.maxPower) * 100)));

  const getPowerColor = () => {
    if (powerPercent > 50) return 'text-emerald-400 bg-emerald-500';
    if (powerPercent > 20) return 'text-amber-400 bg-amber-500';
    return 'text-rose-500 bg-rose-500 animate-pulse';
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex flex-col justify-between p-4 sm:p-6 select-none font-mono">
      {/* Top Bar: Mission Info & Exit Button */}
      <div className="w-full flex items-center justify-between pointer-events-auto">
        <div className="flex items-center gap-3 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
          <span
            className="w-2.5 h-2.5 rounded-full animate-ping"
            style={{ backgroundColor: selectedArtifact.accentColor }}
          />
          <div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="font-bold text-amber-400 uppercase tracking-widest">
                POWER RUN // {telemetry.destination.toUpperCase()}
              </span>
              <span>•</span>
              <span className="text-slate-300">{selectedArtifact.callsign || selectedArtifact.name}</span>
            </div>
            <span className="text-xs font-bold text-white tracking-wide">
              {selectedArtifact.landingSite}
            </span>
          </div>
        </div>

        {/* Exit & Controls HUD */}
        <div className="flex items-center gap-2">
          <button
            onClick={onRestart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs backdrop-blur-md transition-colors cursor-pointer"
            title="Restart Run"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESTART</span>
          </button>

          <button
            onClick={onExit}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs backdrop-blur-md transition-colors cursor-pointer"
            title="Return to Gallery"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>RETURN TO ARCHIVE</span>
          </button>
        </div>
      </div>

      {/* Center Countdown Overlay (READY -> 3 -> 2 -> 1 -> GO!) */}
      {countdown && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center animate-bounce">
            <span className="font-orbitron text-7xl sm:text-9xl font-black text-amber-400 drop-shadow-[0_0_50px_rgba(245,158,11,0.85)] tracking-widest">
              {countdown}
            </span>
            <p className="font-mono text-sm tracking-[0.3em] text-slate-300 mt-2 uppercase font-bold">
              {countdown === 'GO!' ? 'MISSION UNDERWAY' : 'POWER METER INITIALIZING'}
            </p>
          </div>
        </div>
      )}

      {/* Game Over Summary Modal */}
      {telemetry.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md pointer-events-auto p-4 z-50">
          <div className="max-w-md w-full bg-slate-950 border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-[0_0_80px_rgba(245,158,11,0.25)] animate-fadeIn">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center mb-4">
              <Award className="w-7 h-7 text-amber-400" />
            </div>

            <h2 className="font-orbitron text-2xl font-black text-white tracking-wide">
              RUN CONCLUDED
            </h2>
            <p className="font-mono text-xs text-amber-300 mt-1 uppercase tracking-wider">
              {powerPercent <= 0 ? 'BATTERY DEPLETED IN THE REGOLITH' : 'MISSION COMPLETED'}
            </p>

            {/* Run Stats Grid */}
            <div className="grid grid-cols-2 gap-3 my-6 font-mono text-left">
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">DISTANCE REACHED</span>
                <span className="text-lg font-bold text-sky-400">{Math.round(telemetry.distance)} M</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] text-slate-500 block uppercase">SAMPLES LOGGED</span>
                <span className="text-lg font-bold text-amber-400">{telemetry.samplesCollected} UNITS</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onRestart}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold font-mono text-xs tracking-wider uppercase transition-all shadow-lg cursor-pointer"
              >
                LAUNCH AGAIN
              </button>
              <button
                onClick={onExit}
                className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                RETURN TO ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Telemetry HUD Bar */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Power Meter Battery Indicator */}
        <div className="w-full sm:w-80 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 shadow-xl">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-300 font-bold">
              {powerPercent > 20 ? (
                <BatteryCharging className="w-4 h-4 text-amber-400" />
              ) : (
                <BatteryWarning className="w-4 h-4 text-rose-500 animate-pulse" />
              )}
              <span>SOLAR POWER</span>
            </span>
            <span className={`font-bold ${powerPercent < 20 ? 'text-rose-400' : 'text-slate-200'}`}>
              {powerPercent}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-200 ${getPowerColor().split(' ')[1]}`}
              style={{ width: `${powerPercent}%` }}
            />
          </div>
          <span className="text-[9px] text-slate-500 mt-1 block">
            COLLECT GLOWING CELLS TO RECHARGE
          </span>
        </div>

        {/* Center: Live Speed & Distance Telemetry */}
        <div className="flex items-center gap-4 bg-slate-950/85 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shadow-xl">
          <div className="text-center">
            <span className="text-[9px] text-slate-500 uppercase block">DISTANCE</span>
            <span className="font-orbitron text-lg font-bold text-white">
              {Math.round(telemetry.distance)} M
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="text-[9px] text-slate-500 uppercase block">SPEED</span>
            <span className="font-orbitron text-lg font-bold text-sky-400">
              {Math.round(telemetry.speed)} KM/H
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="text-[9px] text-slate-500 uppercase block">SAMPLES</span>
            <span className="font-orbitron text-lg font-bold text-amber-400">
              {telemetry.samplesCollected}
            </span>
          </div>
        </div>

        {/* Right: Boost Button & Keyboard Shortcut Hint */}
        <div className="flex items-center gap-2">
          <button
            onClick={onBoost}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-orbitron font-extrabold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95"
          >
            <Flame className="w-4 h-4 fill-current" />
            <span>BOOST (SPACE)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
