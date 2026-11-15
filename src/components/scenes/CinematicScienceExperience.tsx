import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Box,
  Image as ImageIcon,
  Activity,
  Rocket,
} from 'lucide-react';
import { Artifact } from '../../types/artifact';
import { OpportunityScienceScene } from './OpportunityScienceScene';
import { IngenuityScienceScene } from './IngenuityScienceScene';
import { Apollo11ScienceScene } from './Apollo11ScienceScene';
import { InSightScienceScene } from './InSightScienceScene';
import { Apollo15LRVScienceScene } from './Apollo15LRVScienceScene';
import { SojournerScienceScene } from './SojournerScienceScene';
import { Pioneer10ScienceScene } from './Pioneer10ScienceScene';
import { Surveyor3ScienceScene } from './Surveyor3ScienceScene';

// Audio file mapping for the 8 sentinels
const ARTIFACT_AUDIO_MAP: Record<string, { path: string; duration: number }> = {
  'opportunity-rover': { path: '/audio/novo1.mp3', duration: 85.969 },
  'ingenuity-helicopter': { path: '/audio/even/Novo_2.mp3', duration: 76.513 },
  'apollo-11-descent': { path: '/audio/novo3.mp3', duration: 94.276 },
  'insight-lander': { path: '/audio/even/Novo_4.mp3', duration: 78.759 },
  'apollo-15-lrv': { path: '/audio/novo5.mp3', duration: 81.476 },
  'sojourner-pathfinder': { path: '/audio/even/Novo_6.mp3', duration: 77.322 },
  'sojourner-rover': { path: '/audio/even/Novo_6.mp3', duration: 77.322 },
  'pioneer-10': { path: '/audio/novo7.mp3', duration: 92.839 },
  'surveyor-3': { path: '/audio/even/Novo_8.mp3', duration: 76.434 },
};

// Subtitle cue transcripts for live display
const SUBTITLE_CUES: Record<string, Array<{ start: number; end: number; text: string }>> = {
  'opportunity-rover': [
    { start: 0.0, end: 2.66, text: 'They told us we had 90 days.' },
    { start: 3.28, end: 8.14, text: '90 Martian sunrises to land inside a nest of bouncing airbags,' },
    { start: 8.56, end: 12.82, text: 'roll down our metal ramps, and see if the red planet was ever alive.' },
    { start: 13.62, end: 17.34, text: '90 days? We gave humanity 15 years!' },
    { start: 17.90, end: 24.32, text: 'We climbed out of Eagle Crater with dust on our solar wings. We drove across endless red deserts.' },
    { start: 25.04, end: 35.36, text: 'We found the blueberries, tiny spheres of hematite that proved liquid water once flowed, rippled, and pooled across Mars.' },
    { start: 35.94, end: 46.76, text: 'We conquered sand dunes that tried to swallow us whole. We drove an entire Olympic marathon on another world: 28 miles, one rock at a time.' },
    { start: 47.20, end: 58.22, text: 'And then, in the summer of 2018, the sky turned dark. A global dust storm swallowed the sun. Day turned into pitch-black night.' },
    { start: 58.74, end: 67.82, text: 'With our solar panels choking on red dust, we sent our last heartbeat through the dark: My battery is low, and it is getting dark.' },
    { start: 69.18, end: 85.94, text: 'Do not mourn us, we are not lost. We are parked forever at the edge of Endeavour Crater... waiting to lead you home.' },
  ],
  'ingenuity-helicopter': [
    { start: 0.0, end: 12.5, text: "They said flight on Mars was physically impossible. The air was too thin, less than 1% of Earth's atmosphere, like flying at 100,000 feet." },
    { start: 13.0, end: 20.6, text: 'On April 19th, 2021, we spun our twin carbon fiber blades, lifted three meters off the red dirt, and hovered.' },
    { start: 21.2, end: 32.2, text: 'Four pounds of defiance, and tucked right beneath our solar panel: a tiny postage stamp piece of muslin fabric cut from the 1903 Wright Flyer.' },
    { start: 33.0, end: 41.3, text: 'We were only supposed to fly five times to prove the physics. We flew 72.' },
    { start: 42.2, end: 49.6, text: 'We soared over boulder fields, scouted pathways for our big brother rover Perseverance, and surveyed alien canyons from the air.' },
    { start: 50.1, end: 56.5, text: 'On our 72nd flight, landing in featureless ripples of sand, a rotor tip touched down hard.' },
    { start: 56.5, end: 76.5, text: 'Our flying days ended at Airfield Valinor Hills, but our computer still wakes up every morning: the sky of Mars is not a ceiling, it is a highway.' },
  ],
  'apollo-11-descent': [
    { start: 0.0, end: 12.98, text: 'Look closely at the golden platform standing in the Sea of Tranquility. Around it, in the untouched regolith, bootprints are pressed into the soil.' },
    { start: 13.88, end: 22.14, text: 'Bootprints that will remain unchanged for a million years, because here on the moon, there is no rain, there is no wind.' },
    { start: 22.86, end: 33.38, text: 'When Armstrong and Aldrin lit their rocket to return to Earth, they had to leave their lower half behind: precious weight to make it home alive.' },
    { start: 33.96, end: 47.86, text: 'This golden four-legged stage was never trash. It is the pedestal of humanity’s greatest leap. On its leg hangs a plaque: We came in peace for all mankind.' },
    { start: 48.70, end: 61.02, text: 'Just a few paces away sits something even more magical: a simple grid of 100 glass prisms called the laser retroreflector. No batteries, no wires, no computers.' },
    { start: 61.68, end: 86.42, text: 'Scientists on Earth fire green laser beams 380,000 km across space. It hits this exact relic and bounces back, proving the moon drifts away by 4 cm a year.' },
    { start: 86.42, end: 94.27, text: '50 years later, our silent Sentinel is still answering Earth’s call. Light second by light second.' },
  ],
  'insight-lander': [
    { start: 0.0, end: 5.78, text: 'In 2018, we touched down on the smooth volcanic plains of Elysium Planitia.' },
    { start: 6.44, end: 19.18, text: 'With our robotic arm, we placed a golden dome onto the dirt: the most sensitive seismometer ever built, detecting tremors smaller than a hydrogen atom.' },
    { start: 19.72, end: 33.90, text: 'For four years, Mars spoke to us: 1,300 Mars quakes rumbling through the mantle, and meteorite impacts striking like distant drumbeats.' },
    { start: 34.60, end: 44.70, text: 'We gave humanity the first ultrasound of an alien world, proving that beneath its cold desert shell, Mars has a giant molten liquid core.' },
    { start: 45.40, end: 56.44, text: 'With every passing month, red dust settled thicker over our solar wings. We had no windshield wipers, no little wheels to shake it loose.' },
    { start: 56.44, end: 78.56, text: 'When the last volt drained away, we sent our final message: My power is really low... We took the pulse of a world. Now, we sleep peacefully in crimson dust.' },
  ],
  'apollo-15-lrv': [
    { start: 0.0, end: 9.50, text: "Who says you can't go for a joy ride on the moon? Before 1971, astronauts could only explore as far as their heavy boots could walk." },
    { start: 10.06, end: 23.98, text: 'Enter the Lunar Roving Vehicle: made of aluminum tubes, woven piano-wire mesh tires, and two lawn chairs, folded like origami into the lunar lander.' },
    { start: 24.34, end: 30.46, text: 'Commander Dave Scott grabbed the T-shaped steering stick, stepped on the electric throttle, and away we went!' },
    { start: 30.98, end: 41.76, text: 'We bounced along the rim of Hadley Rille, a canyon a mile wide and a thousand feet deep, driving up mountains towering three miles into black space.' },
    { start: 42.12, end: 50.28, text: 'We covered nearly 18 miles and helped astronauts find the Genesis Rock: a chunk of the moon four billion years old.' },
    { start: 50.82, end: 67.16, text: 'Dave Scott parked us 300 feet away, pointed our color TV camera back at the lander, and millions of kids on Earth saw the rocket blast into orbit live.' },
    { start: 67.74, end: 81.47, text: 'Parked at Hadley Rille for over 50 years: the batteries are dead, but the tires will never go flat. The keys are in the ignition, and the best parking spot on the moon is reserved.' },
  ],
  'sojourner-pathfinder': [
    { start: 0.0, end: 18.60, text: 'Imagine a robot no bigger than your school backpack, weighing just 23 pounds. In 1997, critics laughed: they said a rover on Mars was pure fantasy.' },
    { start: 19.02, end: 34.54, text: 'On July 4th, 1997, our mothership bounced across an ancient riverbed in 20 giant airbags. Petals unfolded, and our six aluminum wheels rolled into red sand.' },
    { start: 35.20, end: 45.32, text: 'Named Sojourner in honor of Sojourner Truth. Built to last seven days; we survived for 83.' },
    { start: 45.94, end: 57.24, text: 'We trundled to boulders Barnacle Bill and Yogi, pressed our APXS sensor against them, and proved Mars was once washed by catastrophic torrents of water.' },
    { start: 57.90, end: 66.42, text: 'When winter cold drained our circuits, we came to rest in Ares Vallis.' },
    { start: 66.42, end: 77.04, text: 'Every giant rover roaming Mars today—Spirit, Opportunity, Curiosity, Perseverance—walks in the tiny tire tracks we left behind. Big dreams start small.' },
  ],
  'sojourner-rover': [
    { start: 0.0, end: 18.60, text: 'Imagine a robot no bigger than your school backpack, weighing just 23 pounds. In 1997, critics laughed: they said a rover on Mars was pure fantasy.' },
    { start: 19.02, end: 34.54, text: 'On July 4th, 1997, our mothership bounced across an ancient riverbed in 20 giant airbags. Petals unfolded, and our six aluminum wheels rolled into red sand.' },
    { start: 35.20, end: 45.32, text: 'Named Sojourner in honor of Sojourner Truth. Built to last seven days; we survived for 83.' },
    { start: 45.94, end: 57.24, text: 'We trundled to boulders Barnacle Bill and Yogi, pressed our APXS sensor against them, and proved Mars was once washed by catastrophic torrents of water.' },
    { start: 57.90, end: 66.42, text: 'When winter cold drained our circuits, we came to rest in Ares Vallis.' },
    { start: 66.42, end: 77.04, text: 'Every giant rover roaming Mars today—Spirit, Opportunity, Curiosity, Perseverance—walks in the tiny tire tracks we left behind. Big dreams start small.' },
  ],
  'pioneer-10': [
    { start: 0.0, end: 18.98, text: 'Travel beyond the moon, beyond Mars, beyond Jupiter, Saturn, Uranus, Neptune... where the sun is just a diamond in the black sea of space: Pioneer 10.' },
    { start: 19.76, end: 33.54, text: 'Launched in 1972, the first machine to sail into the unknown. Scientists didn’t know if a craft could pass the asteroid belt without being crushed to dust.' },
    { start: 34.16, end: 46.00, text: 'We sailed straight through without a scratch. We braved the crushing radiation belts of Jupiter to send back the first close-ups of the Great Red Spot.' },
    { start: 46.00, end: 65.08, text: 'Bolted to our antenna: a golden plaque carrying figures of a man and a woman, our home star, and the address of Earth written in pulsing pulsar clocks.' },
    { start: 65.08, end: 79.52, text: 'In 2003, our radio grew too weak to reach home. But we are coasting toward star Aldebaran in Taurus. It will take two million years to arrive.' },
    { start: 79.52, end: 92.83, text: 'Long after our creators return to stardust, we will still be carrying humanity’s postcard through the Milky Way: proof that creatures on a blue planet dared to touch the stars.' },
  ],
  'surveyor-3': [
    { start: 0.0, end: 22.52, text: 'In 1967, scientists feared the moon was a bottomless pit of pulverized cosmic dust where astronauts would sink and vanish. We were sent to touch down and find out.' },
    { start: 22.78, end: 39.52, text: 'We bounced three times in Ocean of Storms, extended a mechanical arm, and dug into the dirt: the ground was firm as damp beach sand. The ground will hold you. Come on up.' },
    { start: 40.26, end: 54.18, text: 'Two and a half years later, a thunderous roar shook the dust: Apollo 12 landed just 500 feet away!' },
    { start: 54.18, end: 64.76, text: 'Two astronauts, Pete Conrad and Alan Bean, walked right across the crater to our footpads, unbolted our TV camera, and brought it home to study deep space weathering.' },
    { start: 64.76, end: 76.43, text: 'The only robot in history visited by human travelers on an alien world. We were the scout who stayed behind, and our friends came to visit.' },
  ],
};

interface CinematicScienceExperienceProps {
  artifact: Artifact;
  onClose: () => void;
  onLaunchGame?: (artifact: Artifact) => void;
}

export const CinematicScienceExperience: React.FC<CinematicScienceExperienceProps> = ({
  artifact,
  onClose,
  onLaunchGame,
}) => {
  const audioInfo = ARTIFACT_AUDIO_MAP[artifact.id] || { path: '/audio/novo1.mp3', duration: 80 };
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [activeMode, setActiveMode] = useState<'action' | 'inspect' | 'photo'>('action');
  const [activeTab, setActiveTab] = useState<'science' | 'history' | 'hardware' | 'specs'>('science');

  // Sync animation clock with audio
  useEffect(() => {
    let animId: number;
    const updateTime = () => {
      if (audioRef.current && !audioRef.current.paused) {
        setCurrentTime(audioRef.current.currentTime);
      }
      animId = requestAnimationFrame(updateTime);
    };
    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Autoplay voiceover on mount
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 1.0;
      audio.muted = isMuted;
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [artifact.id, isMuted]);

  const handleTogglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(console.warn);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleRestart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().then(() => setIsPlaying(true)).catch(console.warn);
  }, []);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = val;
      setCurrentTime(val);
    }
  };

  // Find active live subtitle
  const cues = SUBTITLE_CUES[artifact.id] || [];
  const currentSubtitle = useMemo(() => {
    const cue = cues.find((c) => currentTime >= c.start && currentTime <= c.end);
    return cue ? cue.text : '';
  }, [cues, currentTime]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const imagePath = `/images/sentinels/${artifact.id}.jpg`;

  return (
    <div className="relative w-full h-full bg-deepSpace text-lunarWhite flex flex-col overflow-hidden select-none font-sans">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={audioInfo.path}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Top Bar: Mission Header & Mode Selector */}
      <div className="relative z-30 min-h-14 sm:h-16 px-3 sm:px-6 py-1.5 sm:py-0 bg-obsidian/90 border-b border-titanium/15 backdrop-blur-xl flex items-center justify-between gap-1.5 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 truncate max-w-[40%] xs:max-w-[50%] sm:max-w-none">
          <span className="font-mono text-[9px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded bg-stellarBlue/15 border border-stellarBlue/30 text-nebulaCyan font-semibold uppercase tracking-wider shrink-0 hidden xs:inline-block">
            {artifact.celestialBody}
          </span>
          <div className="truncate">
            <h1 className="font-display text-xs sm:text-base font-bold text-lunarWhite tracking-tight truncate">
              {artifact.name.split('(')[0].trim()}
            </h1>
            <span className="font-mono text-[9px] sm:text-[10px] text-dustGrey tracking-wider truncate block">
              {artifact.landingSite.split(',')[0]}
            </span>
          </div>
        </div>

        {/* View Mode Toggle: SCIENCE ACTION / 3D INSPECT / PHOTO */}
        <div className="flex items-center gap-1 p-0.5 sm:p-1 rounded-full bg-deepSpace/90 border border-titanium/20 shrink-0">
          <button
            onClick={() => setActiveMode('action')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              activeMode === 'action'
                ? 'bg-stellarBlue text-lunarWhite font-medium shadow-[0_0_15px_rgba(26,47,251,0.5)]'
                : 'text-dustGrey hover:text-lunarWhite'
            }`}
            title="Science Action View"
          >
            <Activity className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">SCIENCE ACTION</span>
          </button>

          <button
            onClick={() => setActiveMode('inspect')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              activeMode === 'inspect'
                ? 'bg-stellarBlue text-lunarWhite font-medium shadow-[0_0_15px_rgba(26,47,251,0.5)]'
                : 'text-dustGrey hover:text-lunarWhite'
            }`}
            title="3D Inspection View"
          >
            <Box className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">3D INSPECTION</span>
          </button>

          <button
            onClick={() => setActiveMode('photo')}
            className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full font-mono text-[10px] sm:text-xs cursor-pointer transition-all ${
              activeMode === 'photo'
                ? 'bg-stellarBlue text-lunarWhite font-medium shadow-[0_0_15px_rgba(26,47,251,0.5)]'
                : 'text-dustGrey hover:text-lunarWhite'
            }`}
            title="Archival Photography View"
          >
            <ImageIcon className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">ARCHIVAL PHOTO</span>
          </button>
        </div>

        {/* Action Controls & Close Button */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {onLaunchGame && (
            <button
              onClick={() => onLaunchGame(artifact)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full bg-solarAmber hover:bg-solarAmber/90 text-deepSpace font-mono text-[10px] sm:text-xs font-bold uppercase transition-all shadow-[0_0_20px_rgba(245,166,35,0.4)] cursor-pointer active:scale-95"
            >
              <Rocket className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
              <span className="hidden sm:inline">LAUNCH IN POWER RUN</span>
              <span className="sm:hidden">LAUNCH</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-cosmicNavy/80 hover:bg-cosmicNavy text-titanium hover:text-lunarWhite border border-titanium/20 font-mono text-[10px] sm:text-xs transition-colors cursor-pointer"
            title="Close Experience"
            aria-label="Close Experience"
          >
            <span className="hidden sm:inline text-[11px] font-semibold tracking-wider">CLOSE</span>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: 3D Stage (60%) + Curatorial Intelligence (40%) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left: 3D Canvas Stage */}
        <div className="relative flex-1 lg:flex-[1.4] h-[45vh] lg:h-full bg-deepSpace overflow-hidden flex flex-col justify-between">
          {activeMode !== 'photo' ? (
            <div className="absolute inset-0">
              <Canvas
                shadows
                camera={{ position: [0, 1.4, 4.5], fov: 45 }}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
              >
                <color attach="background" args={['#05070D']} />

                {/* OrbitControls active in 'inspect' mode or secondary in action mode */}
                <OrbitControls
                  makeDefault
                  ref={(controls: any) => {
                    if (controls) {
                      controls.enablePan = false;
                      controls.enableZoom = true;
                      controls.enableRotate = true;
                      controls.minDistance = 1.4;
                      controls.maxDistance = 8.5;
                      controls.autoRotate = activeMode === 'inspect';
                      controls.autoRotateSpeed = 0.8;
                    }
                  }}
                />

                {/* Render the specific Science Action Scene */}
                {artifact.id === 'opportunity-rover' && (
                  <OpportunityScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'ingenuity-helicopter' && (
                  <IngenuityScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'apollo-11-descent' && (
                  <Apollo11ScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'insight-lander' && (
                  <InSightScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'apollo-15-lrv' && (
                  <Apollo15LRVScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {(artifact.id === 'sojourner-rover' || artifact.id === 'sojourner-pathfinder') && (
                  <SojournerScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'pioneer-10' && (
                  <Pioneer10ScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
                {artifact.id === 'surveyor-3' && (
                  <Surveyor3ScienceScene
                    artifact={artifact}
                    currentTime={currentTime}
                    duration={audioInfo.duration}
                    isPlaying={isPlaying}
                    isInspecting={activeMode === 'inspect'}
                  />
                )}
              </Canvas>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center p-8 bg-deepSpace/95">
              <img
                src={imagePath}
                alt={artifact.name}
                className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl border border-titanium/20"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl obsidian-card border border-titanium/20 backdrop-blur-md max-w-md">
                <span className="font-mono text-[10px] text-nebulaCyan uppercase tracking-widest block mb-1 font-semibold">
                  OFFICIAL NASA MISSION ARCHIVE
                </span>
                <p className="font-sans text-xs text-dustGrey">
                  Historic imagery of {artifact.name} resting at {artifact.landingSite}.
                </p>
              </div>
            </div>
          )}

          {/* Synchronized Live Subtitle Overlay */}
          {currentSubtitle && activeMode === 'action' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-xl w-full px-6 text-center pointer-events-none">
              <div className="inline-block px-5 py-2.5 rounded-full obsidian-card border border-nebulaCyan/30 backdrop-blur-xl shadow-2xl">
                <p className="font-sans text-xs sm:text-sm font-medium text-lunarWhite tracking-wide leading-relaxed">
                  "{currentSubtitle}"
                </p>
              </div>
            </div>
          )}

          {/* Audio Scrubber & Transport Bar (Docked at Bottom of 3D View) */}
          <div className="relative z-20 p-2.5 sm:p-4 m-2 sm:m-4 rounded-xl sm:rounded-2xl obsidian-card border border-titanium/15 backdrop-blur-xl shadow-2xl flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono text-titanium">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={handleTogglePlay}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stellarBlue hover:bg-stellarBlue/90 text-lunarWhite flex items-center justify-center cursor-pointer transition-transform active:scale-95 shadow-[0_0_15px_rgba(26,47,251,0.5)] shrink-0"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" /> : <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current ml-0.5" />}
                </button>
                <button
                  onClick={handleRestart}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-cosmicNavy hover:bg-stellarBlue/20 text-titanium hover:text-lunarWhite border border-titanium/20 flex items-center justify-center cursor-pointer transition-colors shrink-0"
                  title="Restart Story"
                >
                  <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </button>

                {/* Animated Equalizer Bars */}
                <div className="hidden xs:flex items-center gap-0.5 h-4 ml-1 sm:ml-2">
                  {[0.4, 0.8, 1.0, 0.6, 0.9, 0.5].map((_, i) => (
                    <span
                      key={i}
                      className="w-0.5 bg-nebulaCyan rounded-full transition-all duration-150"
                      style={{
                        height: isPlaying ? `${Math.sin(currentTime * 8 + i) * 8 + 10}px` : '4px',
                        opacity: isPlaying ? 0.9 : 0.3,
                      }}
                    />
                  ))}
                </div>

                <span className="text-nebulaCyan font-mono font-medium text-[11px] sm:text-xs ml-1">
                  {formatTime(currentTime)} / {formatTime(audioInfo.duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-dustGrey hover:text-lunarWhite cursor-pointer p-1"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            {/* Range Scrubber */}
            <input
              type="range"
              min={0}
              max={audioInfo.duration}
              step={0.1}
              value={currentTime}
              onChange={handleSeek}
              className="w-full accent-nebulaCyan cursor-pointer h-1.5 bg-cosmicNavy rounded-lg"
            />
          </div>
        </div>

        {/* Right: Curatorial Intelligence & Scientific Dossier (40% Desktop) */}
        <div className="flex-1 lg:flex-[1.0] h-[55vh] lg:h-full bg-obsidian border-t lg:border-t-0 lg:border-l border-titanium/15 flex flex-col overflow-hidden">
          {/* Dossier Tabs */}
          <div className="flex items-center border-b border-titanium/15 px-3 sm:px-4 pt-2 sm:pt-3 gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('science')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-[11px] sm:text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap tracking-wider ${
                activeTab === 'science'
                  ? 'border-stellarBlue text-lunarWhite font-bold'
                  : 'border-transparent text-dustGrey hover:text-lunarWhite'
              }`}
            >
              SCIENCE OBJECTIVES
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-[11px] sm:text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap tracking-wider ${
                activeTab === 'history'
                  ? 'border-stellarBlue text-lunarWhite font-bold'
                  : 'border-transparent text-dustGrey hover:text-lunarWhite'
              }`}
            >
              MISSION GENESIS
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-[11px] sm:text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap tracking-wider ${
                activeTab === 'hardware'
                  ? 'border-stellarBlue text-lunarWhite font-bold'
                  : 'border-transparent text-dustGrey hover:text-lunarWhite'
              }`}
            >
              INSTRUMENTS
            </button>
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-[11px] sm:text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap tracking-wider ${
                activeTab === 'specs'
                  ? 'border-stellarBlue text-lunarWhite font-bold'
                  : 'border-transparent text-dustGrey hover:text-lunarWhite'
              }`}
            >
              TELEMETRY
            </button>
          </div>

          {/* Tab Content Panel */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6" data-lenis-prevent>
            {activeTab === 'science' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-stellarBlue/10 border border-stellarBlue/25">
                  <span className="font-mono text-[10px] text-nebulaCyan font-semibold uppercase tracking-widest block mb-1">
                    PRIMARY SCIENTIFIC BREAKTHROUGHS
                  </span>
                  <p className="font-sans text-xs text-lunarWhite leading-relaxed">
                    {artifact.tagline}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-mono text-xs text-dustGrey uppercase tracking-wider">
                    Discovered Insights
                  </h3>
                  <ul className="space-y-2">
                    {artifact.breakthroughs.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-titanium leading-relaxed">
                        <span className="w-1.5 h-1.5 rounded-full bg-nebulaCyan mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <h3 className="font-mono text-xs text-dustGrey uppercase tracking-wider">
                    Educational Takeaway
                  </h3>
                  <p className="font-sans text-xs text-titanium bg-deepSpace/60 p-3.5 rounded-xl border border-titanium/15 leading-relaxed">
                    "{artifact.takeawayForKids}"
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-dustGrey uppercase tracking-wider block">
                    WHY DISCARDED OR LEFT IN SITU
                  </span>
                  <p className="font-sans text-xs text-titanium leading-relaxed bg-deepSpace/60 p-4 rounded-xl border border-titanium/15">
                    {artifact.whyLeftBehind}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-mono text-[10px] text-dustGrey uppercase tracking-wider block">
                    DID YOU KNOW?
                  </span>
                  <div className="space-y-2">
                    {artifact.didYouKnow.map((fact, i) => (
                      <div key={i} className="text-xs text-titanium bg-deepSpace/40 p-3 rounded-lg border border-titanium/15 leading-relaxed">
                        • {fact}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'hardware' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-dustGrey uppercase tracking-wider block mb-2">
                  INSTRUMENT ARCHITECTURE & ONBOARD PAYLOAD
                </span>
                {artifact.instruments.map((inst, i) => (
                  <div key={i} className="p-3.5 rounded-xl bg-deepSpace/60 border border-titanium/15 space-y-1">
                    <span className="font-mono text-xs text-lunarWhite font-semibold block">
                      {inst.name}
                    </span>
                    <p className="font-sans text-xs text-dustGrey leading-relaxed">
                      {inst.role}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-3">
                <span className="font-mono text-[10px] text-dustGrey uppercase tracking-wider block mb-2">
                  VERIFIED MISSION SPECIFICATIONS
                </span>
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-deepSpace/60 border border-titanium/15">
                    <span className="text-[10px] text-dustGrey block">LAUNCH DATE</span>
                    <span className="text-titanium">{artifact.launchDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-deepSpace/60 border border-titanium/15">
                    <span className="text-[10px] text-dustGrey block">LANDING DATE</span>
                    <span className="text-titanium">{artifact.landingDate}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-deepSpace/60 border border-titanium/15">
                    <span className="text-[10px] text-dustGrey block">PLANNED LIFESPAN</span>
                    <span className="text-titanium">{artifact.missionLifespan.planned}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-deepSpace/60 border border-titanium/15">
                    <span className="text-[10px] text-dustGrey block">ACTUAL LIFESPAN</span>
                    <span className="text-solarAmber font-semibold">{artifact.missionLifespan.actual}</span>
                  </div>
                  <div className="col-span-2 p-3 rounded-xl bg-deepSpace/60 border border-titanium/15">
                    <span className="text-[10px] text-dustGrey block">RESTING COORDINATES</span>
                    <span className="text-titanium">{artifact.coordinates}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
