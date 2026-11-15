# 🚀 Novochronos: Team Roles, Responsibilities & Execution Roadmap
> **2026 NASA Space Apps Challenge**  
> **Challenge:** *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*  
> **Repository:** [https://github.com/LordScientist/Novochronos](https://github.com/LordScientist/Novochronos)

---

## 🏛️ Executive Summary

**Novochronos** is an interactive 3D digital museum and narrative chronicle that brings NASA’s dormant off-world hardware (on the Moon, Mars, and deep space) back to life for school-age space enthusiasts and casual learners. 

Instead of traditional flat articles or complex technical databases, Novochronos presents these historical robotic explorers on **tactile 3D exhibition podiums**. As visitors scroll, a protective stasis shroud dissolves to uncover the machine, cinematic lights illuminate the hull, and an emotional, voice-acted audio guide narrates the story of the science that unlocked our solar system.

All data, scripts, coordinates, and historical context have already been curated locally in [`docs/NARRATION_SCRIPTS.md`](./NARRATION_SCRIPTS.md) and [`src/data/narrationScripts.json`](../src/data/narrationScripts.json)—**no external API calls are required**, allowing the entire team to focus 100% on visual polish, audio emotion, and seamless UI/UX.

---

## 👥 Team Assignments & Core Objectives

```
                                  ┌──────────────────────────────┐
                                  │      NOVOCHRONOS TEAM        │
                                  └──────────────┬───────────────┘
                                                 │
        ┌───────────────────────┬────────────────┴───────────────────────┬───────────────────────┐
        ▼                       ▼                                        ▼                       ▼
┌───────────────┐       ┌───────────────┐                        ┌───────────────┐       ┌───────────────┐
│    ROLAND     │       │    JUSTICE    │                        │    JOSEPH     │       │    ISHMAEL    │
├───────────────┤       ├───────────────┤                        ├───────────────┤       ├───────────────┤
│ 3D Motion &   │       │ ElevenLabs &  │                        │ Frontend UI/UX│       │ Voice Eng. &  │
│ Stage Design  │       │ Voice Eng.    │                        │ Practice &    │       │ Frontend      │
│ Lead          │       │ Lead          │                        │ Design Lead   │       │ Co-Lead       │
└───────────────┘       └───────────────┘                        └───────────────┘       └───────────────┘
```

---

### 0. Stage 0 — Dedicated Cinematic 3D Opening Sequence ("Echoes of Exploration")
* **Status:** Implemented (`src/components/journey/CinematicIntro.tsx`, `IntroScene3D.tsx`, `IntroCameraController.tsx`).
* **Lifecycle:** Positioned as Stage 0 before the NASA Command Terminal. Features 5 scenes:
  1. *Awakening:* Atmospheric darkness, stars, circular amphitheater emerging.
  2. *The Eight Sentinels:* Sequential mechanical reveals for Opportunity, Ingenuity, Apollo 11, InSight, Apollo 15 LRV, Sojourner, Pioneer 10, Surveyor 3.
  3. *Grand Exhibition:* 360° orbital panoramic sweep of all eight sentinels.
  4. *Planetary Staging:* Transition into 3D Martian terrain with geological depth and historical accuracy notes.
  5. *Title Reveal:* Novochronos identity + "ENTER THE ARCHIVE" CTA, with skip intro and replay options.

---

### 1. Roland — 3D Motion Inspiration & 3D Stage Design Lead

#### 🎯 Role Overview
Roland is the visual architect of the 3D exhibition space. He is responsible for how the museum looks and feels in 3D—the physical pedestal, lighting dynamics, particle systems, 3D model appearances, and camera choreography.

#### 📌 Key Responsibilities & Objectives
1. **The Museum Podium & Stasis Stage:**
   * Build the physical 3D pedestal mesh in `src/components/canvas/PodiumStage.tsx`.
   * Create the **"Uncover" reveal visual effect**: As users scroll into focus, the stasis field / protective atmospheric shroud dissolves or sweeps away to reveal the relic underneath.
   * Add dynamic neon edge emitters that pulse and change accent color to match the celestial body (Lunar Silver, Martian Rust/Orange, Deep Space Cyan).

2. **3D Relic Models & Geometry:**
   * Curate, design, or assemble 3D representations for each key artifact in `src/components/canvas/ArtifactModel.tsx`:
     * **Opportunity Rover:** Solar panel deck, mast camera, rocker-bogie wheels.
     * **Ingenuity Helicopter:** Dual counter-rotating carbon blades, square fuselage, landing legs.
     * **Apollo 11 Descent Stage:** Octagonal golden foil core, 4 landing struts, ALSEP retroreflector prism.
     * **InSight Lander:** Twin circular solar wings, golden SEIS seismometer dome.
     * **Apollo 15 LRV:** Chassis, wire-mesh wheels, high-gain umbrella dish antenna.
     * **Sojourner:** Compact microwave-sized frame, knobby wheels, solar top.
     * **Pioneer 10:** Large parabolic dish antenna, magnetometer boom, golden plaque.
     * **Surveyor 3:** Tripod legs, mast, mechanical soil scoop.

3. **Atmospheric Lighting & Particle FX:**
   * Set up an overhead museum gallery spotlight that focuses intently on the active podium.
   * Build celestial particle systems floating around the stage:
     * **Moon:** Crisp white/silver lunar regolith dust particles.
     * **Mars:** Drifting reddish-amber atmospheric dust.
     * **Deep Space:** Faint cosmic stardust and starfield depth.

4. **Cinematic Camera Choreography:**
   * Implement smooth camera orbits and scroll-triggered camera lerping between exhibits.
   * Constrain OrbitControls so users can orbit 360° around the model without clipping into the floor.

#### ✅ Roland's Definition of Done
* [ ] The podium looks futuristic, premium, and distinct for Moon, Mars, and Deep Space.
* [ ] The uncover effect transitions smoothly from hidden/stasis to revealed when triggered.
* [ ] Each featured artifact has an instantly recognizable 3D silhouette that rotates smoothly.
* [ ] Lighting and shadows create high visual contrast and an immersive museum atmosphere.

---

### 2. Justice — Lead Voice Engineer & ElevenLabs Specialist

#### 🎯 Role Overview
Justice is the voice of Novochronos. He is responsible for transforming the scripts in [`docs/NARRATION_SCRIPTS.md`](./NARRATION_SCRIPTS.md) into world-class, emotionally stirring audio performances using **ElevenLabs** neural voice synthesis.

#### 📌 Key Responsibilities & Objectives
1. **ElevenLabs Voice Selection & Casting:**
   * Select and test distinct, character-appropriate neural voices in ElevenLabs for each artifact:
     * **Opportunity ("Oppy"):** Warm, youthful, resilient, bittersweet (*"My battery is low and it's getting dark"*).
     * **Ingenuity ("Ginny"):** Energetic, defiant, proud aviator voice.
     * **Apollo 11 Descent Stage:** Deep, cinematic, majestic, timeless documentary narrator.
     * **InSight Lander:** Gentle, quiet, empathetic, like a caring planetary doctor.
     * **Apollo 15 LRV:** Upbeat, spirited, adventurous road-trip storyteller.
     * **Sojourner Rover:** Cheerful, plucky, inspirational pioneer.
     * **Pioneer 10:** Vast, philosophical, poetic, echoing into interstellar space.
     * **Surveyor 3:** Grateful, humble scout surprised by human visitors.

2. **Voice Generation & Prosody Tuning:**
   * Use ElevenLabs Voice Design or Voice Library to tune **Stability**, **Clarity/Similarity**, and **Style Exaggeration**.
   * Follow the director notes in `docs/NARRATION_SCRIPTS.md` (pauses, whispers, breath, and volume shifts).
   * Ensure crystal-clear pronunciation of technical and historical terms (e.g., *Meridiani Planum*, *ALSEP*, *Jezero Crater*, *Hadley Rille*, *Sojourner Truth*, *retroreflector*).

3. **Audio Post-Production & Sound Design:**
   * Normalize audio levels across all tracks (target: -14 LUFS to -16 LUFS for web playback).
   * Layer subtle background sound design / foley underneath the voice:
     * Martian wind whistling softly during Opportunity and InSight.
     * Distant Apollo radio static and laser ping chimes for Apollo 11.
     * Subtle rotor spin-up whoosh for Ingenuity.
   * Export crisp, compressed MP3 files (128 kbps, 44.1 kHz) into `public/audio/<artifact-id>.mp3`.

#### ✅ Justice's Definition of Done
* [ ] All 8 master scripts generated as high-quality MP3s with emotional depth and accurate pacing.
* [ ] Voices feel like distinct characters rather than monotone robotic text reading.
* [ ] Audio tracks are mixed, normalized, and saved cleanly in `public/audio/`.
* [ ] Audio timing aligns closely with the estimated durations in `src/data/narrationScripts.json`.

---

### 3. Joseph — Frontend UI/UX Design & Practice Lead

#### 🎯 Role Overview
Joseph is the experience director. He is responsible for the overall layout, visual aesthetics, typography, museum placard design, and ensuring the interface is intuitive, accessible, and delightful for school-age students and hackathon judges.

#### 📌 Key Responsibilities & Objectives
1. **Podium-Style Scroll Architecture:**
   * Design the split-screen or overlay layout in `src/App.tsx`:
     * Desktop: 3D canvas stage anchored on one side/background, narrative scroll bays on the other.
     * Mobile/Tablet: Responsive stacked layout with full touch-scroll support.
   * Calculate scroll progress so the active exhibit smoothly updates and communicates with Roland's 3D stage.

2. **The Museum Placard Component (`src/components/ui/MuseumPlaque.tsx`):**
   * Craft the museum exhibit placard using Tailwind CSS with futuristic glassmorphism (`backdrop-blur`).
   * Implement an intuitive 3-tab layout on each placard:
     * **Tab 1: The Story** — The core emotional narrative and the "Why Was It Left Behind?" callout box.
     * **Tab 2: Hardware & Science** — Breakthroughs bullet points and scientific instrument cards.
     * **Tab 3: Young Explorers Dossier** — "Did You Know?" fun cosmic facts, launch/landing badges, and coordinates.

3. **Aerospace Design System & Polish:**
   * Establish consistent typography (`Orbitron` / `Space Mono` for titles and telemetry, `Inter` for clean reading).
   * Color-code badges by status: *Permanent Monument* (emerald), *Dormant* (amber), *Perpetual Drift* (purple), *Rotor Retired* (rose).
   * Design the top header (`Navbar.tsx`) with celestial filter buttons (**All**, **Moon**, **Mars**, **Deep Space**) and exhibition progress counter (e.g. *Exhibit 02 / 08*).

4. **Accessibility & Kids UX:**
   * Ensure high-contrast text readability against dark space backgrounds (WCAG AA compliant).
   * Add large, friendly click targets and smooth scroll-anchor navigation.

#### ✅ Joseph's Definition of Done
* [ ] Clean, responsive layout that looks breathtaking on both desktop and mobile screens.
* [ ] Museum placard tabs switch instantly with smooth micro-animations.
* [ ] Filtering by Moon, Mars, or Deep Space re-indexes the exhibits smoothly.
* [ ] Typography and spacing feel like a curated Smithsonian or NASA interactive exhibit.

---

### 4. Ishmael — Voice Engineering & Frontend Design Co-Lead

#### 🎯 Role Overview
Ishmael serves as the crucial bridge between audio production and frontend implementation. He works directly with **Justice** on the ElevenLabs voice generation pipeline and collaborates with **Joseph** on interactive audio HUD components and UI features.

#### 📌 Key Responsibilities & Objectives
1. **Voice Pipeline & Quality Assurance (with Justice):**
   * Co-direct and test ElevenLabs voice outputs alongside Justice.
   * Verify audio sync with the scripts in `src/data/narrationScripts.json`.
   * Ensure clean file naming, metadata consistency, and fallback handling (if an audio file is buffering or offline).

2. **Interactive Audio Player HUD (`src/components/ui/AudioNarrator.tsx`):**
   * Build the dedicated audio guide player integrated directly into Joseph's museum placard.
   * Implement core audio controls:
     * Large, tactile **Play / Pause** toggle.
     * Scrubbable **Progress Bar** showing current timestamp and total duration.
     * **Playback Speed Multiplier** button (`1x`, `1.25x`, `1.5x`).
     * **Read-Along Transcript Drawer / Modal** so students can read the script while listening.
   * Provide a seamless Web Speech API fallback so the audio player still speaks if an MP3 file is loading.

3. **Frontend Polish & Visual Accents (with Joseph):**
   * Build the **Exhibition Quick-Jump Rail** (a vertical dot navigator along the right screen margin allowing users to jump directly to any exhibit).
   * Implement animated scroll hints (e.g. glowing down-arrow or *"Scroll down to uncover the next sentinel"*).
   * Assist Joseph with sound-reactive or pulse animations on the audio player when narration is active.

#### ✅ Ishmael's Definition of Done
* [ ] The Audio Narrator widget looks polished, responsive, and easy for kids to operate.
* [ ] Play, pause, scrub, and speed toggles function reliably with zero audio clipping.
* [ ] The read-along transcript modal opens and displays the exact spoken script.
* [ ] Smooth coordination between audio playback state and active visual exhibit.

---

## 📅 Suggested Sprint Roadmap & Milestone Plan

| Phase | Focus | Roland (3D) | Justice (Voice) | Joseph (UI/UX) | Ishmael (Audio/UI) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Phase 1: Foundation** | Setup & Asset Drafts | Build podium base & lighting rig in R3F | Cast ElevenLabs voices for Oppy & Ginny | Layout main App shell & Museum Placard HTML | Build AudioPlayer component & test Web Audio |
| **Phase 2: Core Build** | Implementation | Model key artifacts & uncover dissolve shader | Batch-generate all 8 ElevenLabs audio tracks | Build Placard tabs (Story, Science, Kids) | Wire AudioPlayer with ElevenLabs MP3s & transcripts |
| **Phase 3: Integration** | Unification | Sync scroll trigger with 3D camera & podium uncover | Normalize audio, mix foley & background wind | Add Celestial filters (Moon/Mars) & quick-jump dots | Add scrub bar, speed toggle & mobile polish |
| **Phase 4: Final Polish** | Hackathon Delivery | Tune bloom, particle dust, and lighting contrasts | Final audio audit & quality check | Cross-browser testing & responsive audit | End-to-end user testing & presentation rehearsal |

---

## 🛠️ Git Collaboration & Branching Guidelines

To ensure the team works smoothly without merge conflicts, each member should create and work on their own feature branch:

```bash
# Roland: 3D stage and motion
git checkout -b feature/3d-podium-and-models

# Justice: ElevenLabs audio assets
git checkout -b feature/elevenlabs-audio-tracks

# Joseph: Frontend UI/UX and museum placards
git checkout -b feature/ui-museum-placards

# Ishmael: Audio player HUD and UI integration
git checkout -b feature/audio-player-hud
```

When ready to merge:
1. Fetch latest main: `git checkout main && git pull origin main`
2. Rebase or merge feature branch: `git merge feature/<your-branch>`
3. Verify production build: `npm run build`
4. Push to remote: `git push origin main`
