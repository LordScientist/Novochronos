import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, FileText, X, Gauge } from 'lucide-react';
import { Artifact } from '../../types/artifact';

interface AudioNarratorProps {
  artifact: Artifact;
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({ artifact }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [isUsingSpeechSynth, setIsUsingSpeechSynth] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Reset audio when artifact changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [artifact.id]);

  // Handle Play/Pause
  const handleTogglePlay = () => {
    if (isPlaying) {
      if (isUsingSpeechSynth && 'speechSynthesis' in window) {
        window.speechSynthesis.pause();
      } else if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      // Try playing MP3 audio file first
      const audioPath = `/audio/${artifact.id}.mp3`;
      if (!audioRef.current) {
        audioRef.current = new Audio(audioPath);
        audioRef.current.playbackRate = playbackRate;

        audioRef.current.ontimeupdate = () => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        };
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setCurrentTime(0);
        };
        audioRef.current.onerror = () => {
          // Fallback to Web Speech API if MP3 is missing or offline
          fallbackToSpeechSynthesis();
        };
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsUsingSpeechSynth(false);
        })
        .catch(() => {
          fallbackToSpeechSynthesis();
        });
    }
  };

  const fallbackToSpeechSynthesis = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(artifact.ttsCleanScript);
    utterance.rate = playbackRate;
    utterance.onend = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsUsingSpeechSynth(true);
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const nextSpeed = speeds[nextIdx];
    setPlaybackRate(nextSpeed);
    if (audioRef.current) audioRef.current.playbackRate = nextSpeed;
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <>
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/80 flex items-center justify-between gap-4 max-w-xl w-full select-none shadow-xl">
        {/* Play/Pause Button */}
        <button
          onClick={handleTogglePlay}
          className="p-3.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(245,158,11,0.5)] shrink-0"
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        {/* Audio scrubber & Timestamps */}
        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{isUsingSpeechSynth ? 'Web Speech Synth' : 'ElevenLabs Voice Guide'}</span>
            </span>
            <span>
              {formatSeconds(currentTime)} / {formatSeconds(artifact.audioDurationSec)}
            </span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all"
              style={{
                width: `${Math.min((currentTime / artifact.audioDurationSec) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* Speed & Transcript buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={cycleSpeed}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 font-mono text-xs flex items-center gap-1 transition-colors"
          >
            <Gauge className="w-3 h-3 text-slate-400" />
            <span>{playbackRate}x</span>
          </button>

          <button
            onClick={() => setShowTranscript(true)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            title="Read Transcript"
          >
            <FileText className="w-4 h-4 text-sky-400" />
          </button>
        </div>
      </div>

      {/* Read-Along Transcript Modal */}
      {showTranscript && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6">
          <div className="glass-panel p-6 md:p-8 rounded-3xl max-w-2xl w-full border border-slate-700 max-h-[80vh] flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">
                  Narration Transcript
                </span>
                <h3 className="font-orbitron text-xl font-bold text-white">
                  {artifact.name}
                </h3>
              </div>
              <button
                onClick={() => setShowTranscript(false)}
                className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-6 overflow-y-auto pr-2 text-sm text-slate-300 font-sans leading-relaxed space-y-4">
              <p>{artifact.ttsCleanScript}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowTranscript(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
