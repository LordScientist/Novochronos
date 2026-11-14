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

The user journey transitions across 7 continuous stages governed by the master stage state:

```typescript
export type JourneyStage = 
  | 'terminal'       // Stage 1: NASA Command Terminal Boot
  | 'command-center' // Stage 2: Mission Control Dashboard
  | 'launch'         // Stage 3: Rocket Ignition & Atmospheric Ascent
  | 'video-overview' // Stage 4: Cinematic Hardware Video Montage
  | 'gallery'        // Stage 5: Project Picture Cards Overview
  | 'podium-detail'; // Stage 6: 3D Model & Interactive Audio Placard
```

### Transition Mechanics:
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

## 5. Active Theory & Space Trash Signs 3D Depth Architecture

The scene fuses reverse-engineered design tokens from **Active Theory** (`specs/activetheory-net-reverse-spec/`), **Space Trash Signs** (`specs/spacetrashsigns-org-reverse-spec/`), and **Iventions** (`specs/iventions-com-reverse-spec/`):

* **Obsidian Black Void (#000000):** True 21:1 contrast ratio backdrop without washed-out ambient grays.
* **Three.js Native Depth Fog (`<fog args={['#000000', 8.5, 23.0]} />`):** Seamlessly dissolves distant background geometry and receding cards into the infinite black void, providing genuine atmospheric perspective depth.
* **Concentric Orbital Perspective Rings (`OrbitalDepthRings.tsx`):** Geometric distance rings (radii 3.8 to 8.5) establishing spatial plane depth cues against the black void (Space Trash Signs token).
* **Cinematic Radial Vignette:** Viewport corners darken toward pitch-black `#000000` via a CSS radial gradient overlay (`bg-[radial-gradient(ellipse_at_center,_transparent_42%,_rgba(0,0,0,0.85)_100%)]`), concentrating focal light onto the 3D launch stack and foreground card.
* **Stage Spotlight & Shadow Falloff:** Targeted stage key light (`intensity: 3.4`) paired with electric blue planetary rim light, casting sharp specular highlights against the obsidian void.

---

## 6. Audio Pipeline & Narration Architecture

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
