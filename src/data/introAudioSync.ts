import { IntroScene } from '../types/journey';

export interface AudioSyncCue {
  id: string;
  startSec: number;
  endSec: number;
  scene: IntroScene;
  sentinelIndex?: number;
  spokenWords: string;
  visualSubject: string;
  visualAction: string;
  cameraMovement: string;
  spotlightTarget?: number;
}

export const INTRO_AUDIO_DURATION = 82.991;

/**
 * Authoritative Synchronization Timeline
 * Transcribed from: public/audio/intro-narration.mp3 (WhatsApp_Audio_2026-11-14_at_16.26.55.mpeg)
 */
export const INTRO_AUDIO_SYNC_TIMELINE: AudioSyncCue[] = [
  // 1. Prologue / Awakening
  {
    id: 'prologue-1',
    startSec: 0.0,
    endSec: 3.5,
    scene: 'awakening',
    spokenWords: 'Long before our boots touched alien soil,',
    visualSubject: 'Cosmic Void & Stars',
    visualAction: 'Starlight intensifies in deep space; circular hall silhouette begins to emerge.',
    cameraMovement: 'Slow forward dolly from high exterior toward the circular amphitheater.',
  },
  {
    id: 'prologue-2',
    startSec: 3.5,
    endSec: 7.2,
    scene: 'awakening',
    spokenWords: 'we sent our machines ahead into the cold dark,',
    visualSubject: 'Circular Exhibition Architecture',
    visualAction: 'Amphitheater floor and titanium ribs illuminate with ambient floor lighting.',
    cameraMovement: 'Camera descends through the upper truss into the interior of the hall.',
  },
  {
    id: 'prologue-3',
    startSec: 7.2,
    endSec: 11.8,
    scene: 'awakening',
    spokenWords: 'built to endure and never to return.',
    visualSubject: 'Concentric Floor Rings & Pedestals',
    visualAction: 'Neon perimeter floor rings power on; 8 sentinel pedestals come into view.',
    cameraMovement: 'Camera sweeps low across the central observation disc toward the first pedestal.',
  },

  // 2. The Eight Sentinels Sequential Showcase
  {
    id: 'sentinel-opportunity',
    startSec: 11.8,
    endSec: 18.2,
    scene: 'sentinels',
    sentinelIndex: 0,
    spotlightTarget: 0,
    spokenWords: 'Opportunity, marching an Olympic marathon through 15 years of Martian dust.',
    visualSubject: 'Opportunity Rover (MER-B / "Oppy")',
    visualAction: 'Primary key spotlight illuminates Opportunity; solar panels, Pancam mast, and rocker-bogie wheels highlighted.',
    cameraMovement: 'Camera orbits smoothly around Opportunity’s front quarter; lower-third title card appears.',
  },
  {
    id: 'sentinel-ingenuity',
    startSec: 18.2,
    endSec: 23.5,
    scene: 'sentinels',
    sentinelIndex: 1,
    spotlightTarget: 1,
    spokenWords: 'Ingenuity, daring 72 flights through an impossible sky,',
    visualSubject: 'Ingenuity Mars Helicopter ("Ginny")',
    visualAction: 'Spotlight smoothly shifts to Ingenuity; twin coaxial blades spin at 2,500 RPM; Wright Flyer fabric visible.',
    cameraMovement: 'Camera glides along circular track to center on Ingenuity; lower-third title card updates.',
  },
  {
    id: 'sentinel-apollo11',
    startSec: 23.5,
    endSec: 29.2,
    scene: 'sentinels',
    sentinelIndex: 2,
    spotlightTarget: 2,
    spokenWords: "Apollo's golden descent stage, our eternal foundation on the Moon,",
    visualSubject: 'Apollo 11 Lunar Module Descent Stage & ALSEP',
    visualAction: 'Spotlight illuminates golden Mylar foil base, tubular struts, and quartz laser retroreflector prism.',
    cameraMovement: 'Camera moves in close to the descent engine bell and commemorative plaque.',
  },
  {
    id: 'sentinel-insight',
    startSec: 29.2,
    endSec: 33.8,
    scene: 'sentinels',
    sentinelIndex: 3,
    spotlightTarget: 3,
    spokenWords: 'InSight, listening to the quiet heartbeat of a red planet.',
    visualSubject: 'InSight Geophysical Lander',
    visualAction: 'Spotlight reveals twin circular UltraFlex solar fan wings and golden SEIS seismometer dome.',
    cameraMovement: 'Camera glides to InSight, tilting slightly to emphasize the fan array symmetry.',
  },
  {
    id: 'sentinel-apollo15-lrv',
    startSec: 33.8,
    endSec: 38.6,
    scene: 'sentinels',
    sentinelIndex: 4,
    spotlightTarget: 4,
    spokenWords: 'The Apollo rover parked forever at the edge of Hadley Rille,',
    visualSubject: 'Apollo 15 Lunar Roving Vehicle (LRV-1)',
    visualAction: 'Spotlight illuminates open aluminum chassis, woven wire-mesh wheels, T-bar joystick, and high-gain dish antenna.',
    cameraMovement: 'Camera tracks past wire-mesh wheels toward the upright color TV camera.',
  },
  {
    id: 'sentinel-sojourner',
    startSec: 38.6,
    endSec: 44.2,
    scene: 'sentinels',
    sentinelIndex: 5,
    spotlightTarget: 5,
    spokenWords: 'Sojourner, the modest scout that gave Mars its first rolling wheels,',
    visualSubject: 'Sojourner Rover & Mars Pathfinder',
    visualAction: 'Spotlight illuminates microwave-sized titanium body, dark GaAs solar top deck, and rear APXS arm.',
    cameraMovement: 'Camera drops low to emphasize Sojourner’s small brave scale against the arena.',
  },
  {
    id: 'sentinel-pioneer10',
    startSec: 44.2,
    endSec: 50.0,
    scene: 'sentinels',
    sentinelIndex: 6,
    spotlightTarget: 6,
    spokenWords: 'Pioneer 10, sailing into interstellar infinity with a greeting from Earth,',
    visualSubject: 'Pioneer 10 Deep Space Probe',
    visualAction: 'Spotlight illuminates 2.74-meter parabolic dish antenna, extended RTG booms, and Carl Sagan’s Golden Plaque.',
    cameraMovement: 'Camera swoops past the golden plaque toward the dish rim.',
  },
  {
    id: 'sentinel-surveyor3',
    startSec: 50.0,
    endSec: 55.5,
    scene: 'sentinels',
    sentinelIndex: 7,
    spotlightTarget: 7,
    spokenWords: 'and Surveyor, touching lunar soil so human footprints could safely follow.',
    visualSubject: 'Surveyor 3 Robot Scout',
    visualAction: 'Spotlight illuminates tripod landing struts, center vertical mast, and mechanical soil scoop claw.',
    cameraMovement: 'Camera tracks from the scoop claw up toward the planar solar panel.',
  },

  // 3. The Grand Exhibition / Sacred Monuments
  {
    id: 'grand-exhibition-monuments',
    startSec: 55.5,
    endSec: 65.5,
    scene: 'grand-exhibition',
    spokenWords: 'They are not abandoned junk. They are sacred monuments of human daring, standing in eternal stillness where their missions ceased.',
    visualSubject: 'The Grand Exhibition (All 8 Sentinels)',
    visualAction: 'All 8 spotlights swell into balanced exhibition gallery illumination; the entire circular amphitheater is revealed.',
    cameraMovement: 'Majestic 360° orbital panoramic sweep rising above the collection.',
  },

  // 4. The Planetary Reveal / Across Three Silent Worlds
  {
    id: 'planetary-staging',
    startSec: 65.5,
    endSec: 74.5,
    scene: 'planetary-reveal',
    spokenWords: 'Across three silent worlds, their batteries have gone cold, but the trail they blazed will never fade.',
    visualSubject: 'Planetary 3D Martian Landscape',
    visualAction: 'Environment transforms into expansive 3D Martian terrain with geological depth, rocks, and red horizon dust.',
    cameraMovement: 'Sweeping panoramic camera tracking low over Martian dunes showing all sentinels under low sun.',
  },

  // 5. Title Reveal & Call-to-Action
  {
    id: 'title-reveal-cta',
    startSec: 74.5,
    endSec: 83.0,
    scene: 'title-reveal',
    spokenWords: 'Novochronos, echoes of exploration, step into the archive, and remember the machines we left behind.',
    visualSubject: 'Monumental Hero Composition',
    visualAction: 'Camera settles into hero composition framing sentinels and horizon; Enter the Archive CTA activates.',
    cameraMovement: 'Slow majestic drift toward horizon; subtle floating particles.',
  },
];

/**
 * Returns the active sync cue for any given timestamp in seconds
 */
export function getCueForTimestamp(timeSec: number): AudioSyncCue {
  const clamped = Math.max(0, Math.min(timeSec, INTRO_AUDIO_DURATION));
  for (const cue of INTRO_AUDIO_SYNC_TIMELINE) {
    if (clamped >= cue.startSec && clamped < cue.endSec) {
      return cue;
    }
  }
  return INTRO_AUDIO_SYNC_TIMELINE[INTRO_AUDIO_SYNC_TIMELINE.length - 1];
}
