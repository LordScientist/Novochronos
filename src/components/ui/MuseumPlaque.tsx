import React, { useState } from 'react';
import { BookOpen, Cpu, Sparkles, AlertCircle, Award } from 'lucide-react';
import { Artifact } from '../../types/artifact';

interface MuseumPlaqueProps {
  artifact: Artifact;
}

export const MuseumPlaque: React.FC<MuseumPlaqueProps> = ({ artifact }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'science' | 'kids'>('story');

  return (
    <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-700/80 shadow-2xl max-w-xl w-full flex flex-col justify-between select-none">
      {/* Placard Header */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-2">
          <span
            className="px-3 py-0.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${artifact.accentColor}25`,
              color: artifact.accentColor,
              border: `1px solid ${artifact.accentColor}50`,
            }}
          >
            {artifact.celestialBody} // {artifact.status}
          </span>
          <span className="font-mono text-xs text-slate-400">
            {artifact.callsign}
          </span>
        </div>

        <h2 className="font-orbitron text-2xl md:text-3xl font-extrabold text-white tracking-wide">
          {artifact.name}
        </h2>
        <p className="text-xs text-amber-300 font-mono mt-1">
          {artifact.characterArchetype}
        </p>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 mt-5 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('story')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'story'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Story</span>
          </button>

          <button
            onClick={() => setActiveTab('science')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'science'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Hardware</span>
          </button>

          <button
            onClick={() => setActiveTab('kids')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-mono transition-all ${
              activeTab === 'kids'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kids Dossier</span>
          </button>
        </div>
      </div>

      {/* Tab Content Body */}
      <div className="mt-5 min-h-[220px] max-h-[340px] overflow-y-auto pr-2">
        {/* Tab 1: The Story */}
        {activeTab === 'story' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-sans">
              {artifact.ttsCleanScript.slice(0, 320)}...
            </p>

            {/* Why Was It Left Behind Callout */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs">
              <div className="flex items-center gap-2 text-amber-400 font-mono font-bold mb-1">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>WHY WAS IT LEFT BEHIND?</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11px] md:text-xs">
                {artifact.whyLeftBehind}
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Hardware & Science */}
        {activeTab === 'science' && (
          <div className="space-y-4 animate-fade-in text-xs">
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold mb-2">
                Landmark Breakthroughs
              </span>
              <ul className="space-y-1.5 font-sans text-slate-300">
                {artifact.breakthroughs.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="font-mono text-[10px] text-sky-400 uppercase tracking-widest block font-bold mb-2">
                Scientific Instruments
              </span>
              <div className="grid grid-cols-1 gap-2">
                {artifact.instruments.map((inst, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <strong className="text-slate-100 font-mono text-[11px] block">{inst.name}</strong>
                    <span className="text-[10px] text-slate-400">{inst.role}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Young Explorers Dossier */}
        {activeTab === 'kids' && (
          <div className="space-y-4 animate-fade-in text-xs">
            {/* Takeaway for kids */}
            <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-500/30">
              <span className="font-mono text-[10px] text-sky-400 uppercase tracking-widest block font-bold mb-1">
                Takeaway for Young Explorers
              </span>
              <p className="text-slate-200 font-sans text-xs italic">
                "{artifact.takeawayForKids}"
              </p>
            </div>

            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase tracking-widest block font-bold mb-2">
                Did You Know?
              </span>
              <ul className="space-y-2 font-sans text-slate-300">
                {artifact.didYouKnow.map((fact, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-mono text-[10px] mt-0.5">★</span>
                    <span className="text-[11px] md:text-xs">{fact}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-400">
              <div>
                <span className="text-slate-500 block">LAUNCH DATE:</span>
                <span className="text-slate-200">{artifact.launchDate}</span>
              </div>
              <div>
                <span className="text-slate-500 block">LANDING DATE:</span>
                <span className="text-slate-200">{artifact.landingDate}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
