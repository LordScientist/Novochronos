// POWER RUN: The Last Signal — Game Type Definitions

export type LaunchState =
  | 'GALLERY'
  | 'LAUNCH_PREPARATION'
  | 'ENGINE_IGNITION'
  | 'LIFTOFF'
  | 'ASCENT'
  | 'SPACE_TRANSITION'
  | 'COUNTDOWN'
  | 'PLAYING';

export type GameLane = 0 | 1 | 2; // 0 = Top, 1 = Middle, 2 = Bottom

export interface GameTelemetry {
  power: number;            // 0 to 100 percentage
  maxPower: number;
  distance: number;         // Meters traversed
  speed: number;            // Display speed in km/h
  batteriesCollected: number;
  currentLane: GameLane;
  isInvulnerable: boolean;
  isGameOver: boolean;
  isPaused: boolean;
  destination: 'Moon' | 'Mars' | 'Deep Space';
}

export interface Obstacle {
  id: number;
  lane: GameLane;
  x: number;
  y?: number;
  width: number;
  height: number;
  type: 'rock' | 'crater' | 'debris' | 'boulder' | 'hazard';
  hit: boolean;
}

export interface BatteryPickup {
  id: number;
  lane: GameLane;
  x: number;
  y?: number;
  width: number;
  height: number;
  collected: boolean;
  pulsePhase: number;
}

export interface FloatingText {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
  color: string;
}

export interface GameParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}
