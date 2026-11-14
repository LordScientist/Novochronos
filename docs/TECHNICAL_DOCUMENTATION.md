# 🛠️ Novochronos: Technical Architecture & System Documentation
> **Living Technical Specification — 2026 NASA Space Apps Challenge**  
> **Repository:** [https://github.com/LordScientist/Novochronos](https://github.com/LordScientist/Novochronos)

---

## 1. System Architecture & Technology Stack

Novochronos is architected as a high-performance, responsive single-page web application combining declarative 3D WebGL rendering with a modern DOM HUD layer:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DOM Application Layer                           │
│  • Command Interface (Boot)         • Mission Control Dashboard HUD   │
│  • Video Overview Controller        • Museum Placards (Story/Science) │
│  • Interactive Audio Narrator       • Responsive Navigation Header    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Sync via Scroll & State
┌───────────────────────────────────┴────────────────────────────────────┐
│                    WebGL / 3D Canvas Layer (R3F)                       │
│  • Three.js Viewport                • Dramatic 3-Point Lighting Rig    │
│  • Tiered Titanium Podium Plinth    • Stasis Shroud Dissolve Shader    │
│  • 8 Spacecraft 3D Models (.GLB)    • Ambient Celestial Particle Dust  │
│  • Smooth Camera Rig & OrbitControls• Space Launch Atmospheric Ascent  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies

| Technology | Version | Purpose in Project |
| :--- | :--- | :--- |
| **React** | `18.3.1` | Component composition, declarative UI, and state synchronization. |
| **TypeScript** | `5.6.3` | Type-safe data models for celestial coordinates, telemetry, and 3D props. |
| **Three.js** | `0.169.0` | Low-level WebGL scene graph, geometries, materials, lights, and shaders. |
| **@react-three/fiber** | `8.17.10` | Declarative React wrapper for Three.js rendering loops and hooks. |
| **@react-three/drei** | `9.120.4` | Helper utilities: `useGLTF`, `Stars`, `OrbitControls`, `Html` overlays. |
| **Tailwind CSS** | `3.4.14` | Aerospace design system, custom grid layouts, and glassmorphic blurs. |
| **Lucide React** | `0.454.0` | Lightweight aerospace and UI iconography. |
| **Vite** | `5.4.10` | Instant HMR development server and optimized ES module bundler. |
| **ElevenLabs** | — | Neural voice synthesis pipeline for emotionally resonant narrations. |

---

## 2. Directory Structure & Organization

```
Novochronos/
├── public/
│   ├── audio/                        # ElevenLabs MP3 voiceover tracks
│   ├── models/                       # Downloaded NASA .GLB 3D assets
│   └── nasa-logo.svg                 # Authentic NASA Meatball vector insignia
├── docs/
│   ├── 3D_HARDWARE_MODELS_AND_REFERENCES.md # Official NASA 3D links & specs
│   ├── DESIGN_TOKENS_EXTRACTION_WORKFLOW.md # Dissect token extraction guide
│   ├── EXTRACTED_3D_DESIGN_TOKENS.md # Reverse-engineered easing curves & grid
│   ├── NARRATION_SCRIPTS.md          # Master scripts with emotional stage cues
│   ├── TEAM_ROLES_AND_ROADMAP.md     # Team task assignments & roadmap
│   └── TECHNICAL_DOCUMENTATION.md    # This living technical specification
├── specs/                            # Reverse-engineered reference bundles
├── scripts/
│   └── generate_tts.py               # Local Python audio synthesis utility
├── src/
│   ├── main.tsx                      # React DOM mount point
│   ├── App.tsx                       # Master journey orchestrator & scroll manager
│   ├── index.css                     # Global styles, glassmorphism, easing curves
│   ├── types/
│   │   ├── artifact.ts               # Relic metadata, coordinates, audio schemas
│   │   └── journey.ts                # Stage states (Terminal, Command, Launch, etc.)
│   ├── data/
│   │   ├── artifacts.ts              # Curated datasets for all 8 sentinels
│   │   └── narrationScripts.json     # Clean TTS scripts & director cues
│   ├── components/
│   │   ├── canvas/                   # 3D WebGL components
│   │   │   ├── MuseumScene.tsx       # Canvas wrapper, camera, lights, stars
│   │   │   ├── PodiumStage.tsx       # Plinth, stasis ring, particle dust
│   │   │   ├── ArtifactModel.tsx     # 3D models & procedural fallbacks
│   │   │   └── LaunchScene.tsx       # Rocket liftoff ascent sequence
│   │   ├── journey/                  # Cinematic sweep sequence components
│   │   │   ├── CommandTerminal.tsx   # Stage 1: Boot-up terminal
│   │   │   ├── MissionControl.tsx    # Stage 2: Mission Control room HUD
│   │   │   └── VideoOverview.tsx     # Stage 4: Cinematic video overview
│   │   └── ui/                       # Exhibition HUD & placard components
│   │       ├── Navbar.tsx            # Header with NASA logo & celestial filters
│   │       ├── ProjectCard.tsx       # Stage 5: Gallery picture card
│   │       ├── MuseumPlaque.tsx      # Stage 6: 3-tab deep-dive placard
│   │       └── AudioNarrator.tsx     # Stage 6: Voiceover player & transcript
│   └── hooks/
│       ├── useScrollProgress.ts      # Tracks scroll progress between stages
│       └── useAudioGuide.ts          # Manages playback, scrubbing, and speed
├── OVERVIEW.md                       # High-level architecture & user journey
├── README.md                         # Project documentation and quickstart
└── package.json                      # Dependencies and build scripts
```

---

## 3. State Management & Journey Lifecycle

The user journey transitions across 8 continuous stages governed by the master stage state:

```typescript
export type JourneyStage = 
  | 'intro'          // Stage 0: Cinematic 3D Opening Sequence (Echoes of Exploration)
  | 'terminal'       // Stage 1: NASA Command Terminal Boot
  | 'command-center' // Stage 2: Mission Control Dashboard
  | 'launch'         // Stage 3: Rocket Ignition & Atmospheric Ascent
  | 'video-overview' // Stage 4: Cinematic Hardware Video Montage
  | 'gallery'        // Stage 5: Project Picture Cards Overview
  | 'podium-detail'; // Stage 6: 3D Model & Interactive Audio Placard
```

### Stage 0: Cinematic 3D Introduction Architecture
Stage 0 is a dedicated, self-contained 3D opening sequence positioned as the very first experience visitors encounter. It operates through its own isolated camera controller (`IntroCameraController.tsx`) and WebGL scene (`IntroScene3D.tsx`), ensuring zero camera ownership conflicts or state contamination with the subsequent stages.

```
┌────────────────────────────────────────────────────────────────────────┐
│               Stage 0: 5-Scene Cinematic Sequence                      │
├────────────────────────────────────────────────────────────────────────┤
│ Scene 1: Awakening (Darkness, emerging circular architecture & stars)  │
│ Scene 2: The Eight Sentinels (Sequential mechanical spotlight reveals) │
│ Scene 3: The Grand Exhibition (Panoramic circular orbital sweep)       │
│ Scene 4: The Planetary Reveal (3D Martian landscape & staging notice)  │
│ Scene 5: Title Reveal (Novochronos hero title & "ENTER THE ARCHIVE")   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ "ENTER THE ARCHIVE" / Skip Intro
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               Stage 1: NASA Command Terminal Boot                      │
└────────────────────────────────────────────────────────────────────────┘
```

#### Stage 0 Audio-Driven Master Clock & Timecode Synchronization:

The cinematic introduction visual timeline is directly governed by an authentic narration audio master clock (`public/audio/intro-narration.mp3`, duration `82.991s`). Camera choreography, dynamic key/fill/rim spotlighting, and animated lower-third name cards are keyed to speech intervals via `src/data/introAudioSync.ts`:

| Interval (Timecode) | Scene / Subject | Spoken Words | Visual Action & Camera Choreography |
| :--- | :--- | :--- | :--- |
| `00:00.000 – 00:03.500` | Awakening / Cosmic Void | *"Long before our boots touched alien soil..."* | Starlight intensifies; high exterior push-in toward the hall. |
| `00:03.500 – 00:07.200` | Awakening / Circular Hall | *"we sent our machines ahead into the cold dark..."* | Hall ribs and floor glow; camera descends through the upper truss. |
| `00:07.200 – 00:11.800` | Awakening / Concentric Rings | *"built to endure and never to return."* | Perimeter floor rings ignite; camera sweeps low across central observation disc. |
| `00:11.800 – 00:18.200` | **Sentinel 0: Opportunity** | *"Opportunity, marching an Olympic marathon through 15 years of Martian dust."* | Key spotlight isolates Opportunity; camera frames rover quarter view; lower-third title card appears. |
| `00:18.200 – 00:23.500` | **Sentinel 1: Ingenuity** | *"Ingenuity, daring 72 flights through an impossible sky,"* | Spotlight shifts to Ingenuity; twin coaxial rotors spinning; camera glides to center on Ginny. |
| `00:23.500 – 00:29.200` | **Sentinel 2: Apollo 11** | *"Apollo's golden descent stage, our eternal foundation on the Moon,"* | Golden foil base & ALSEP illuminated; camera moves in close to the descent engine bell & plaque. |
| `00:29.200 – 00:33.800` | **Sentinel 3: InSight** | *"InSight, listening to the quiet heartbeat of a red planet."* | Circular UltraFlex solar fans and SEIS dome illuminated; camera glides to highlight fan symmetry. |
| `00:33.800 – 00:38.600` | **Sentinel 4: Apollo 15 LRV** | *"The Apollo rover parked forever at the edge of Hadley Rille,"* | Wire-mesh wheels and lawn-chair chassis illuminated; camera tracks past wheels toward upright color TV camera. |
| `00:38.600 – 00:44.200` | **Sentinel 5: Sojourner** | *"Sojourner, the modest scout that gave Mars its first rolling wheels,"* | Compact titanium body & solar deck illuminated; camera drops low to emphasize small, brave scale. |
| `00:44.200 – 00:50.000` | **Sentinel 6: Pioneer 10** | *"Pioneer 10, sailing into interstellar infinity with a greeting from Earth,"* | 2.74m parabolic dish & Golden Plaque illuminated; camera swoops past plaque toward the dish rim. |
| `00:50.000 – 00:55.500` | **Sentinel 7: Surveyor 3** | *"and Surveyor, touching lunar soil so human footprints could safely follow."* | Tripod landing struts and soil scoop illuminated; camera tracks from scoop claw up to the solar mast. |
| `00:55.500 – 00:65.500` | **Scene 3: Sacred Monuments** | *"They are not abandoned junk. They are sacred monuments of human daring, standing in eternal stillness where their missions ceased."* | All 8 spotlights swell into balanced exhibition gallery illumination; majestic 360° orbital sweep rising above the collection. |
| `00:65.500 – 00:74.500` | **Scene 4: Across Three Worlds** | *"Across three silent worlds, their batteries have gone cold, but the trail they blazed will never fade."* | Dynamic transition into 3D Martian landscape with geological terrain; panoramic tracking low over dunes. |
| `00:74.500 – 00:83.000` | **Scene 5: Title Reveal & CTA** | *"Novochronos, echoes of exploration, step into the archive, and remember the machines we left behind."* | Camera settles into monumental hero composition; title reveal and glowing **ENTER THE ARCHIVE** CTA. |

#### Intro Transition & Control Mechanics:
1. **Fresh Visitor Landing:** Arrives at Stage 0 (`intro`) by default.
2. **Audio-Driven Master Clock:** The HTML5 audio element serves as the single source of truth for timeline progress (`currentTime`), driving camera positions, spotlight rig lerp values, and lower-third typography.
3. **Interactive Timeline Scrubber:** Visitors can scrub or click anywhere along the bottom timeline (`00:00 – 01:23`) with sentinel marker ticks to immediately jump the audio and visuals to any point in the narrative.
4. **Interactive Controls:** Visitors can pause/play narration, mute/unmute, or press **SKIP INTRO** at any time.
5. **Completion Action:** Clicking **ENTER THE ARCHIVE** in Scene 5 smoothly transitions the visitor into Stage 1 (`terminal`) without page reloads.
6. **Replay Anywhere:** A persistent **REPLAY 3D INTRO** action in the terminal, mission control, and global navbar allows visitors to re-enter Stage 0 seamlessly.
7. **Historical Accuracy Staging Notice:** In Scene 4, a dedicated notice clarifies that Mars is a cinematic staging environment; Opportunity, Ingenuity, InSight, and Sojourner rest on Mars, Apollo 11, Apollo 15 LRV, and Surveyor 3 reside on the Moon, and Pioneer 10 drifts in deep space.

### Subsequent Transition Mechanics:
1. **Stage 1 → Stage 2:** Auto-scrolls upon terminal boot completion (duration: ~3s) or via instant user click.
2. **Stage 2 → Stage 3:** Clicking "Initiate Mission" triggers the rocket launch countdown and camera ascent.
3. **Stage 3 → Stage 4:** Reaching orbital altitude transitions the camera into the widescreen video overview.
4. **Stage 4 → Stage 5:** Scrolling down or video completion smoothly glides into the exhibition gallery.
5. **Stage 5 → Stage 6:** Clicking any project card triggers a camera zoom-in, elevating the 3D podium and uncovering the relic.
6. **Stage 6 → Next Exhibit:** Scrolling out of the placard smoothly collapses the podium and sweeps the camera into the next project card.

---

## 4. 3D Model Loading & Fallback Strategy

To guarantee the site loads instantly on any internet connection or school Chromebook, a dual-layer 3D rendering strategy is employed:

1. **Official NASA `.glb` Models:**
   * Loaded asynchronously via `@react-three/drei`'s `useGLTF()` hook.
   * Cached by browser HTTP cache.
2. **Instant Procedural Fallback Geometry:**
   * Built using native Three.js primitives (`boxGeometry`, `cylinderGeometry`, `torusGeometry`).
   * Renders at **0ms load time** with zero external network dependencies while the high-res GLTF loads in the background.

---

## 5. Audio Pipeline & Narration Architecture

* **Source Files:** Placed in `public/audio/<artifact-id>.mp3`.
* **Mastering Standards:** 128 kbps stereo MP3, normalized to `-14 LUFS` to match broadcast web standards.
* **Dual-Engine Player:**
  1. Primary: Plays the pre-synthesized ElevenLabs MP3.
  2. Fallback: If an MP3 fails to load or the user is offline, the component automatically falls back to the browser's native **Web Speech API (`speechSynthesis`)**, reading the verbatim script from `src/data/narrationScripts.json` with zero interruption.

---

## 6. Development & Build Commands

```bash
# Start local development server (with HMR)
npm run dev

# Run TypeScript type-check and build production bundle
npm run build

# Preview the production bundle locally
npm run preview
```
