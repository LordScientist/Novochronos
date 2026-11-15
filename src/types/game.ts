export type LaunchState =
  | 'GALLERY'
  | 'LAUNCH_PREPARATION'
  | 'ENGINE_IGNITION'
  | 'LIFTOFF'
  | 'ASCENT'
  | 'SPACE_TRANSITION'
  | 'GAME_INTRO'
  | 'PLAYING';

export interface GameTelemetry {
  power: number;          // 0 to 100 percentage
  maxPower: number;
  distance: number;       // Meters traversed
  speed: number;          // km/h or m/s
  samplesCollected: number;
  boostAvailable: boolean;
  isGameOver: boolean;
  destination: 'Moon' | 'Mars' | 'Deep Space';
}

export interface PlayerControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  boost: boolean;
}
