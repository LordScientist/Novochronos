import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Radio, Play, RotateCcw } from 'lucide-react';

interface CommandTerminalProps {
  onProceed: () => void;
  onReplayIntro: () => void;
}

export const CommandTerminal: React.FC<CommandTerminalProps> = ({
  onProceed,
  onReplayIntro,
}) => {
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [isBootComplete, setIsBootComplete] = useState<boolean>(false);

  const TERMINAL_LOGS = [
    '[NOVOCHRONOS DEEP-SPACE TELEMETRY INITIALIZED]',
    '> CONNECTING TO DEEP SPACE NETWORK (DSN)... GOLDSTONE // CANBERRA // MADRID',
    '> PINGING DSN SUB-REFLECTOR ARRAYS: 8/8 NODES RESPONDING (0.42ms)',
    '> QUERYING OFF-WORLD ARTIFACT REGISTRY [CATALOG V2026.4]...',
    '> RETRIEVED 8 PERMANENT ARCHAEOLOGICAL SENTINELS ACROSS 3 WORLDS',
    '> TELEMETRY LINK: SECURE / 256-BIT QUANTUM ENCRYPTION ACTIVE',
    '> VERIFYING CREDENTIALS: NASA SCIENCE MISSION DIRECTORATE (SMD)',
    '> AUTHENTICATION VERIFIED. WELCOME, FLIGHT DIRECTOR.',
    '> READY TO INITIALIZE MISSION CONTROL ARCHIVE.'
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < TERMINAL_LOGS.length) {
        setBootLines((prev) => [...prev, TERMINAL_LOGS[currentLine]]);
        currentLine++;
      } else {
        setIsBootComplete(true);
        clearInterval(interval);
      }
    }, 350);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen bg-space-950 flex flex-col justify-between p-6 md:p-12 crt-overlay font-mono select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Terminal className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-xs tracking-widest text-slate-300 uppercase">
            NASA DSN TERMINAL // NOVOCHRONOS BOOT SEQUENCE
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <Radio className="w-3.5 h-3.5 animate-spin" /> DSN LINK ACTIVE
          </span>
          <button
            onClick={onReplayIntro}
            className="flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors ml-4 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1 rounded"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="text-[10px]">REPLAY 3D INTRO</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="max-w-4xl w-full mx-auto my-8 glass-panel p-6 md:p-8 rounded-2xl border border-slate-800/80 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-800 text-[11px] text-slate-500">
          <span className="w-3 h-3 rounded-full bg-rose-500/60 inline-block" />
          <span className="w-3 h-3 rounded-full bg-amber-500/60 inline-block" />
          <span className="w-3 h-3 rounded-full bg-emerald-500/60 inline-block" />
          <span className="ml-2">tty1-dsn-interplanetary-gateway</span>
        </div>

        <div className="space-y-2.5 text-xs md:text-sm leading-relaxed">
          {bootLines.map((line, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2 ${
                line.includes('VERIFIED')
                  ? 'text-emerald-400 font-bold'
                  : line.includes('CONNECTING')
                  ? 'text-sky-300'
                  : line.includes('READY')
                  ? 'text-amber-400 font-bold'
                  : 'text-slate-300'
              }`}
            >
              <span className="text-slate-600 select-none">[{String(idx).padStart(2, '0')}]</span>
              <span>{line}</span>
            </div>
          ))}

          {!isBootComplete && (
            <div className="flex items-center gap-2 text-amber-400 animate-pulse mt-4">
              <span className="text-slate-600">[..]</span>
              <span>_ LOADING ARTIFACT DATASTREAMS...</span>
            </div>
          )}
        </div>

        {/* Action Button after boot completes */}
        {isBootComplete && (
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>SECURITY CLEARANCE CONFIRMED</span>
            </div>

            <button
              onClick={onProceed}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-orbitron font-bold text-xs tracking-wider uppercase transition-all duration-300 shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] flex items-center gap-2 group"
            >
              <span>ENTER MISSION CONTROL</span>
              <Play className="w-3.5 h-3.5 fill-current group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60 pt-4">
        <span>STAGE 1 // NASA COMMAND TERMINAL BOOT</span>
        <span>NOVOCHRONOS // 2026 NASA SPACE APPS CHALLENGE</span>
      </div>
    </div>
  );
};
