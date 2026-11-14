export type JourneyStage = 
  | 'intro'             // Stage 0: Cinematic 3D Opening Sequence
  | 'corridor'          // Stage 1: Space Shuttle & 3D Helical Sentinel Corridor (Primary Archive)
  | 'terminal'          // Stage 2: NASA Command Terminal Boot
  | 'command-center'    // Stage 3: Mission Control Dashboard
  | 'launch'            // Stage 4: Rocket Ignition & Atmospheric Ascent
  | 'video-overview'    // Stage 5: Cinematic Hardware Video Montage
  | 'gallery'           // Stage 6: Project Picture Cards Overview
  | 'podium-detail';    // Stage 7: 3D Model & Interactive Audio Placard

export type IntroScene = 
  | 'awakening'        // Scene 1: Pitch black, emerging circular architecture & starlight
  | 'sentinels'        // Scene 2: Sequential dramatic mechanical reveals of the 8 machines
  | 'grand-exhibition' // Scene 3: All 8 sentinels in circular formation, panoramic orbital camera
  | 'planetary-reveal' // Scene 4: Transition to 3D Martian landscape with historical accuracy note
  | 'title-reveal';    // Scene 5: Monumental Novochronos title & "Enter the Archive" CTA

export interface IntroState {
  currentScene: IntroScene;
  progress: number; // 0 to 1 overall progress
  activeSentinelIndex: number; // 0 to 7
  isPlaying: boolean;
  isMuted: boolean;
  timeRemainingSec: number;
}
