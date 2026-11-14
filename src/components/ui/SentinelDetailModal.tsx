import React, { useState, useEffect } from 'react';
import { X, Play, Square, Volume2, Sparkles, Bookmark } from 'lucide-react';
import narrationScripts from '../../data/narrationScripts.json';

interface SentinelDetailModalProps {
  sentinelId: string | null;
  onClose: () => void;
}

export const SentinelDetailModal: React.FC<SentinelDetailModalProps> = ({
  sentinelId,
  onClose,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynth, setSpeechSynth] = useState<SpeechSynthesis | null>(null);

  const sentinel = narrationScripts.find((s) => s.id === sentinelId);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynth(window.speechSynthesis);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
    };
  }, [sentinelId]);

  if (!sentinel) return null;

  const handleToggleVoiceover = () => {
    if (!speechSynth) return;

    if (isPlaying) {
      speechSynth.cancel();
      setIsPlaying(false);
    } else {
      speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(sentinel.ttsCleanScript);
      utterance.rate = 0.95; // Slightly deliberate storytelling cadence
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      speechSynth.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950/95 border border-sky-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(56,189,248,0.2)] text-slate-100 font-mono">
        {/* Close Button */}
        <button
          onClick={() => {
            if (speechSynth) speechSynth.cancel();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          aria-label="Close dossier"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
          <span className="px-2.5 py-1 rounded bg-sky-500/20 text-sky-300 border border-sky-400/30">
            {sentinel.celestialBody.toUpperCase()}
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {sentinel.characterArchetype}
          </span>
          <span className="text-slate-400 ml-auto flex items-center gap-1">
            <Bookmark className="w-3.5 h-3.5 text-sky-400" />
            EST. RUNTIME: {sentinel.estimatedDurationSec}s
          </span>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
          {sentinel.name}
        </h2>

        {/* Audio Narration Playback Strip */}
        <div className="my-5 p-4 rounded-xl bg-sky-950/40 border border-sky-500/30 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleVoiceover}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold tracking-wide transition-all ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.4)]'
              }`}
            >
              {isPlaying ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  <span>STOP NARRATION</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>PLAY VOICE-OVER NARRATION</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-2 text-xs text-sky-300">
              <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-sky-400' : 'text-slate-500'}`} />
              <span>{isPlaying ? 'READING SENTINEL MONOLOGUE...' : 'SYNTHESIZED VOICE READY'}</span>
            </div>
          </div>

          {/* Sound Effect Badges */}
          <div className="flex flex-wrap gap-1.5">
            {sentinel.soundEffects.map((sfx, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300"
              >
                ♪ {sfx}
              </span>
            ))}
          </div>
        </div>

        {/* Student Takeaway Card */}
        <div className="mb-6 p-4 rounded-xl bg-amber-950/20 border border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Core Takeaway for Young Explorers</span>
          </div>
          <p className="text-sm text-amber-100/90 leading-relaxed font-sans">
            {sentinel.takeawayForKids}
          </p>
        </div>

        {/* Master Director Narration Script */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/10 pb-2">
            <span className="font-bold tracking-widest text-sky-400 uppercase">
              AUTHENTIC SCRIPT & DIRECTOR CUES
            </span>
            <span>FIRST-PERSON ARTIFACT PERSPECTIVE</span>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-sans">
            {sentinel.directorScript}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              if (speechSynth) speechSynth.cancel();
              onClose();
            }}
            className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold tracking-wider transition-colors"
          >
            RETURN TO SHUTTLE CORRIDOR
          </button>
        </div>
      </div>
    </div>
  );
};
