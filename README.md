# <img src="public/nasa-logo.svg" width="38" height="32" alt="NASA" style="vertical-align: middle; display: inline-block; margin-right: 8px;" /> Novochronos: The Silent Sentinels

> **2026 NASA Space Apps Challenge**  
> *Category:* Astrophysics, Planets & Moons, Space Exploration  
> *Challenge:* **Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**  
> *Repository:* [https://github.com/LordScientist/Novochronos](https://github.com/LordScientist/Novochronos)

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black.svg)](https://threejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🏛️ Project Manifesto: Why We Built Novochronos

When a space mission concludes, humanity does not pack up its hardware and bring it home. Descent stages remain resting in the lunar dust of the Sea of Tranquility. Solar-powered rovers stand frozen in the iron sands of Endeavour Crater. Robotic arms and soil claws remain extended into alien regolith, forever holding the ground they claimed for human knowledge.

Too often, history treats these machines as abandoned debris or forgotten footnotes in dusty textbooks. 

We refuse to accept that framing.

We built **Novochronos** to turn these silent sentinels into living legends. These machines are not junk. They are monuments to human courage, precision engineering, and insatiable curiosity. Every scorched descent skirt, every snapped rover wheel, and every solar panel buried under Martian dust represents an answered question that made future exploration possible.

Novochronos is a museum-grade, fully interactive 3D digital odyssey. We designed it from the ground up for school-age students, educators, and space enthusiasts worldwide. Instead of building a static website, we engineered a seamless cinematic journey that takes you from ground telemetry directly to the surface of the Moon and Mars, letting you inspect every bolt, hear their stories, and honor their sacrifices.

---

## 🎬 The 8-Stage Cinematic User Journey

The entire experience flows as a continuous cinematic arc without jarring page reloads:

```
[ Stage 0: 3D Opening ] ──> [ Stage 1: DSN Terminal ] ──> [ Stage 2: Mission Control ]
                                                                      │
                                                                      ▼
[ Stage 5: Discovery Cards ] <── [ Stage 4: Video Overview ] <── [ Stage 3: Launch & Game ]
            │
            ▼
[ Stage 6: 3D Museum Stage ] ──> [ Stage 7: Smooth Orbit Exit ] ──> (Next Sentinel)
```

### Stage 0: Cinematic 3D Introduction ("Echoes of Exploration")
* **Atmospheric Awakening:** The experience opens in a pitch-black cosmic void. Monumental titanium architectural ribs emerge from shadows as the camera glides into a circular amphitheater.
* **The Eight Sentinel Reveals:** Dramatic spotlights sequentially ignite, focusing on Opportunity's mast, Ingenuity's coaxial rotors, Apollo 11's golden descent stage, InSight's solar wings, Apollo 15's wire wheels, Sojourner's rocker-bogie chassis, Pioneer 10's golden plaque, and Surveyor 3's soil claw.
* **Planetary Staging Notice:** The amphitheater expands to reveal a 3D Martian terrain with realistic geological depth, accompanied by an explicit historical staging notice clarifying that Mars serves as our unified digital museum for artifacts across the Moon, Mars, and Deep Space.
* **Master Title Reveal:** Monolithic **NOVOCHRONOS** branding emerges with real-time synthesized audio frequencies and a direct "ENTER THE ARCHIVE" launchpad.

### Stage 1: NASA Command Terminal (The Handshake)
* **Visual Direction:** Retro-futuristic command line interface (`#030712` obsidian background, phosphor scanline glow, monospace telemetry font).
* **Deep Space Network Telemetry:** Initiates an authentic real-time handshake with NASA DSN ground stations:
  ```text
  [NOVOCHRONOS TELEMETRY INITIALIZED]
  > CONNECTING TO DEEP SPACE NETWORK (DSN)...
  > RETRIEVING OFF-WORLD ARTIFACT REGISTRY...
  > AUTHENTICATION VERIFIED: NASA SCIENCE MISSION DIRECTORATE
  ```
* **Seamless Flow:** Automatically transitions into the Mission Control center upon verification or via the instant override key.

### Stage 2: Mission Control Command Center
* **Flight Operations HUD:** Modeled after NASA flight director consoles, featuring orbital ground tracks, mission elapsed timers, subsystem telemetry, and the official NASA Insignia.
* **Global Navigation:** Celestial body jump coordinates allowing visitors to filter hardware by planetary location (Moon, Mars, Deep Space).

### Stage 3: Space Launch Experience & "POWER RUN" Arcade Rework
* **Atmospheric Ascent:** 3D WebGL rocket launch with volumetric smoke plumes, dynamic camera shake, and stage separation into orbital velocity.
* **POWER RUN: The Last Signal (2D Retro Arcade Game):**
  * A fast-paced, custom-built canvas survival game set on the surface of Mars.
  * Players pilot a solar rover across hazardous terrain, dodging dust devils, basalt craters, and boulder fields.
  * Collect solar power cells and high-density battery packs to maintain power before the red sun dips below the horizon.
  * Features a custom Web Audio API chiptune synthesizer generating engine hums, thruster rumbles, and telemetry beeps with zero network overhead.

### Stage 4: Cinematic Video Overview
* **Narrative Showcase:** An evocative documentary montage introducing the historical context of humanity's off-world hardware.
* **Curated Direction:** Bridges historical archival footage with modern planetary science, establishing why these eight relics were chosen and what they gifted to science.

### Stage 5: Exhibition Discovery Bay (Project Cards)
* **Tactile Gallery Cards:** High-resolution archival imagery, celestial location badges, planetary coordinates, and evocative mission summaries.
* **Interactive Hover States:** Cards elevate on a 16-column responsive grid with aerospace glassmorphism, inviting visitors to select any sentinel for full 3D inspection.

### Stage 6: The 3D Museum Stage & Deep-Dive Detail View
* **The Physical Stasis Plinth:** The selected artifact elevates onto an illuminated titanium podium beneath a dramatic three-point spotlight rig.
* **Interactive 3D Model Inspection:**
  * Visitors can orbit 360 degrees around authentic NASA 3D models.
  * Inspect individual components up close, including solar cell layouts, high-gain dishes, and scientific payloads.
* **The Curated Museum Placard:**
  * **Tab 1: The Story:** Engaging character-driven narrative recounting the machine's greatest triumphs and final moments.
  * **Tab 2: Hardware & Science:** Technical breakdown of instruments, scientific discoveries, and operational longevity.
  * **Tab 3: Young Explorers Dossier:** Fun educational facts, mission milestones, and discovery timestamps crafted specifically for school-age students.
* **Interactive Audio Guide:** Voiceover narrations paired with live synchronized transcript highlighting, allowing visitors to read and listen simultaneously.

### Stage 7: Seamless Orbit Exit & Continuous Exploration
* **Smooth Camera Transitions:** Scrolling while inside an exhibition placard automatically lowers the podium plinth, sweeps the camera back into the gallery bay, and docks smoothly onto the adjacent project card.

---

## 🛰️ The 8 Featured Sentinels

We selected eight machines that represent the pinnacle of NASA planetary science, robotic mobility, and human exploration:

| # | Sentinel / Mission | Celestial Body | Resting Site | Historic Science Legacy |
|---|---|---|---|---|
| 1 | **Opportunity Rover (MER-B)** | Mars | Perseverance Valley, Endeavour Crater | Drove 45.16 kilometers (a full off-world marathon) over 14 years; discovered hematite "blueberries" proving ancient acidic liquid water. |
| 2 | **Ingenuity Mars Helicopter** | Mars | Valinor Hills, Jezero Crater | First powered flight on another planet; achieved 72 flights through 1% atmospheric density carrying a fabric swatch from the Wright Brothers 1903 Flyer. |
| 3 | **Apollo 11 Descent Stage & ALSEP** | Moon | Sea of Tranquility | Base for humanity's first lunar landing; deployed the Lunar Laser Ranging Retroreflector which scientists still fire lasers at today to measure lunar drift. |
| 4 | **InSight Geophysical Lander** | Mars | Elysium Planitia | The first planetary stethoscope; operated the ultra-sensitive SEIS seismometer, detecting over 1,300 Marsquakes to map the Martian crust, mantle, and molten core. |
| 5 | **Apollo 15 Lunar Roving Vehicle (LRV-1)** | Moon | Hadley Rille | The first manned vehicle driven on another world; expanded astronaut traverse radius to 28 kilometers and filmed the first live television broadcast of lunar liftoff. |
| 6 | **Sojourner Rover & Mars Pathfinder** | Mars | Ares Vallis | First mobile wheeled rover on Mars; proved the rocker-bogie mobility system among boulder fields and analyzed rocks confirming ancient volcanic activity. |
| 7 | **Pioneer 10 Deep Space Probe** | Deep Space | Interstellar Space (Aldebaran bound) | First human spacecraft to cross the Asteroid Belt and fly past Jupiter; carries Carl Sagan and Frank Drake's gold-anodized greeting plaque into interstellar space. |
| 8 | **Surveyor 3 Robotic Scout** | Moon | Ocean of Storms | Dug the first robotic trenches in lunar soil to prove the surface could support human landings; visited on foot 31 months later by Apollo 12 astronauts Pete Conrad and Alan Bean. |

---

## 💻 Technical Architecture & Engineering Stack

Novochronos is built with modern web technologies to ensure 60 frames-per-second performance across all devices, including classroom laptops and mobile tablets:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DOM Application Layer                           │
│  • Command Terminal (Boot)          • Mission Control Dashboard HUD    │
│  • Video Overview Controller        • Interactive Placards & Transcripts│
│  • POWER RUN Arcade Game Canvas     • Responsive Aerospace Navigation  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ State & Scroll Synchronization
┌───────────────────────────────────┴────────────────────────────────────┐
│                    WebGL / 3D Canvas Layer (Three.js & R3F)            │
│  • Interactive 3D Orbit Controls    • Dramatic 3-Point Spotlight Rig   │
│  • Tiered Titanium Museum Plinths   • Planetary Martian Terrain Shaders│
│  • Authentic NASA 3D Models (.GLB)  • Cosmic Starfield & Dust Particles│
│  • Multi-Stage Launch Rocket Stack  • 60fps Dampened Camera Kinematics │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Technologies
* **React 18.3 & TypeScript 5.6:** Component architecture, modular UI state, and type-safe telemetry schemas.
* **Three.js & @react-three/fiber:** Low-level WebGL graphics pipeline, custom materials, dynamic lighting rigs, and declarative 3D scene graphs.
* **@react-three/drei:** Camera controllers, procedural particle systems (`Stars`, `Sparkles`), and optimized model loaders (`useGLTF`).
* **Tailwind CSS 3.4:** Aerospace design tokens, custom 16-column grids, glassmorphism, and responsive typography.
* **HTML5 Canvas & Web Audio API:** Dedicated 2D physics and retro chiptune audio synthesizer for the POWER RUN rover arcade game.
* **Vite 5.4:** Sub-second Hot Module Replacement (HMR) development and optimized Rollup production bundling.

---

## 🚀 Getting Started

Follow these steps to run Novochronos locally:

### 1. Prerequisites
Ensure you have **Node.js 18.0+** and **npm** installed on your machine.

### 2. Clone the Repository
```bash
git clone https://github.com/LordScientist/Novochronos.git
cd Novochronos
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to experience the application.

### 5. Production Build
```bash
npm run build
```
Generates an optimized, tree-shaken static production bundle in the `dist/` directory.

---

## 🏆 Honors, Mentions, and Official Credits

Novochronos was created for the **2026 NASA Space Apps Challenge**. 

We express our deepest gratitude and credit exclusively to the men, women, centers, and resources of the **National Aeronautics and Space Administration (NASA)** whose work made this project possible:

### Official NASA Centers and Missions
* **NASA Jet Propulsion Laboratory (JPL / Caltech):** For designing, building, and operating Opportunity, Ingenuity, InSight, Sojourner, Pathfinder, and the Deep Space Network.
* **NASA Johnson Space Center (JSC):** For the visionary leadership of the Apollo program, the Lunar Roving Vehicle, and lunar surface operations.
* **NASA Goddard Space Flight Center (GSFC):** For planetary science data stewardship and the Lunar Laser Ranging program.
* **NASA Ames Research Center (ARC):** For managing the historic Pioneer 10 deep-space mission.

### NASA Data and Digital Assets
* **NASA Science 3D Asset Library:** For providing authentic 3D telemetry models, mesh topology, and textures for the Apollo Lunar Module, Opportunity, Ingenuity, InSight, Pioneer 10, Space Shuttle, External Tank, and Solid Rocket Boosters.
* **NASA Planetary Data System (PDS):** For public access to mission coordinates, surface temperature records, raw telemetry logs, and landing site imaging.
* **NASA Photojournal and Archival Sound Archives:** For public domain mission photography, historical radio communications, launch audio, and mission dispatch recordings.

---

## 📜 License and Copyright

This project is open-source under the MIT License. All NASA mission imagery, 3D models, audio recordings, and technical specifications are credited to NASA and remain in the public domain in accordance with NASA Media and Data Usage Guidelines.
