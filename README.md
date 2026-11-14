# <img src="public/nasa-logo.svg" width="38" height="32" alt="NASA" style="vertical-align: middle; display: inline-block; margin-right: 8px;" /> Novochronos: The Silent Sentinels

> **2026 NASA Space Apps Challenge**  
> *Category:* Astrophysics, Planets & Moons, Space Exploration  
> *Challenge:* **Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars**  
> *Repository:* [https://github.com/LordScientist/Novochronos](https://github.com/LordScientist/Novochronos)

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r169-black.svg)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg)](https://tailwindcss.com/)

---

## 🏛️ Project Vision: The Cinematic Odyssey

Since the 1960s, humanity has sent intrepid machines to the Moon, Mars, and deep space. When their primary missions conclude, their descent stages, rovers, landers, and scientific payloads remain behind—standing as silent monuments to human curiosity.

**Novochronos** is an interactive 3D digital museum and narrative chronicle designed to inspire school-age space enthusiasts and casual learners. The experience is engineered as a **continuous cinematic sweep**:

0. **Cinematic 3D Opening (Stage 0):** "Echoes of Exploration" circular amphitheater, 8 mechanical sentinel reveals, 3D Martian terrain, and title reveal with "ENTER THE ARCHIVE".
1. **NASA Command Terminal:** Initial boot-up sequence and deep-space telemetry handshake.
2. **Mission Control Command Center:** Orbital tracking dashboards and mission clocks featuring the official NASA Insignia.
3. **Space Launch Sequence:** Rocket ignition and atmospheric ascent into the dark vacuum of space.
4. **Cinematic Video Overview:** A compelling montage introducing humanity's off-world hardware.
5. **Exhibition Picture Cards:** Visual preview cards for each featured sentinel across the Moon, Mars, and Deep Space.
6. **3D Museum Podium & Deep-Dive:** Clicking a card elevates the 3D stasis plinth, uncovers the machine with realistic spotlights, and unlocks an interactive audio player with ElevenLabs character narrations.
7. **Continuous Scroll-Out Transitions:** Scrolling while reading smoothly collapses the active podium and sweeps the camera into the next project card.

---

## 🛰️ The 8 Featured Sentinels

| # | Sentinel / Mission | Celestial Body | Resting Site | Key Science Legacy |
|---|---|---|---|---|
| 1 | **Opportunity Rover (MER-B / "Oppy")** | Mars | Perseverance Valley, Endeavour Crater | Proved ancient liquid water with hematite "blueberries"; drove 45 km marathon. |
| 2 | **Ingenuity Mars Helicopter ("Ginny")** | Mars | Airfield Valinor Hills, Jezero Crater | First powered flight on another planet; 72 flights carrying Wright Flyer fabric. |
| 3 | **Apollo 11 Descent Stage & ALSEP** | Moon | Sea of Tranquility | Golden launch base; quartz retroreflector still measures lunar drift today. |
| 4 | **InSight Geophysical Lander** | Mars | Elysium Planitia | Planetary stethoscope; recorded 1,300+ Marsquakes and mapped core thickness. |
| 5 | **Apollo 15 Lunar Roving Vehicle (LRV-1)** | Moon | Hadley Rille | First car on the Moon; expanded radius to 28 km; filmed live rocket liftoff. |
| 6 | **Sojourner Rover & Mars Pathfinder** | Mars | Ares Vallis | First mobile rover on Mars; proved mobility in boulder fields with rocker-bogie. |
| 7 | **Pioneer 10 Deep Space Probe** | Deep Space | Interstellar Space (Aldebaran bound) | First to cross the Asteroid Belt; carries Carl Sagan's golden greeting plaque. |
| 8 | **Surveyor 3 Robot Scout** | Moon | Ocean of Storms | Proved lunar soil could support humans; visited on foot by Apollo 12. |

---

## 📚 Living Project Documentation

* **[`OVERVIEW.md`](OVERVIEW.md)** — Architectural design and the 7-stage user journey.
* **[`docs/TECHNICAL_DOCUMENTATION.md`](docs/TECHNICAL_DOCUMENTATION.md)** — Living developer guide, tech stack, and state lifecycle.
* **[`docs/TEAM_ROLES_AND_ROADMAP.md`](docs/TEAM_ROLES_AND_ROADMAP.md)** — Task assignments for Roland, Justice, Joseph, and Ishmael.
* **[`docs/NARRATION_SCRIPTS.md`](docs/NARRATION_SCRIPTS.md)** — Master voiceover scripts with emotional stage cues.
* **[`docs/3D_HARDWARE_MODELS_AND_REFERENCES.md`](docs/3D_HARDWARE_MODELS_AND_REFERENCES.md)** — NASA Science 3D downloads and modeling directives.
* **[`docs/EXTRACTED_3D_DESIGN_TOKENS.md`](docs/EXTRACTED_3D_DESIGN_TOKENS.md)** — Reverse-engineered easing curves, 16-column grid, and lighting rigs.

---

## 👥 Team Roles

* **Roland:** 3D Motion Inspiration & Stage Design Lead (Three.js / R3F podium, models, shaders, lighting).
* **Justice:** Lead Voice Engineer & ElevenLabs Specialist (Neural voice casting, emotion tuning, audio mastering).
* **Joseph:** Frontend UI/UX Design & Practice Lead (Command center, dashboard, gallery cards, placard HUD).
* **Ishmael:** Voice Engineering & Frontend Design Co-Lead (Audio player HUD, transcript sync, video overview).

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
