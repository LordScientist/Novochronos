export type CelestialBody = 'Mars' | 'Moon' | 'Asteroid / Deep Space';

export type SentinelStatus = 
  | 'Permanent Monument' 
  | 'Dormant' 
  | 'Perpetual Drift' 
  | 'Rotor Retired';

export interface ScientificInstrument {
  name: string;
  role: string;
}

export interface Artifact {
  id: string;
  name: string;
  callsign: string;
  celestialBody: CelestialBody;
  status: SentinelStatus;
  landingSite: string;
  coordinates: string;
  launchDate: string;
  landingDate: string;
  missionLifespan: {
    planned: string;
    actual: string;
  };
  characterArchetype: string;
  tagline: string;
  modelPath?: string;
  modelScale: [number, number, number];
  modelRotation: [number, number, number];
  modelPosition: [number, number, number];
  soundEffects: string[];
  takeawayForKids: string;
  whyLeftBehind: string;
  breakthroughs: string[];
  instruments: ScientificInstrument[];
  didYouKnow: string[];
  ttsCleanScript: string;
  directorScript: string;
  audioDurationSec: number;
  accentColor: string; // Hex color for lighting & badges
}
