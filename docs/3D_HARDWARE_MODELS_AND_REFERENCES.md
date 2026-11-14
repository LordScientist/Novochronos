# 🛰️ 3D Hardware Reference Catalog & Modeling Instructions
> **Novochronos Project — 2026 NASA Space Apps Challenge**  
> **Source Examined:** [NASA Science 3D Resources (`science.nasa.gov/3d-resources/`)](https://science.nasa.gov/3d-resources/)

This document catalogues the exact 3D models and official NASA imagery for **only our 8 selected equipment** featured in the narration scripts, along with technical modeling instructions for **Roland** to optimize and integrate them into our 3D podium exhibition.

---

## 📋 The 8 Featured Sentinels — Asset Matrix

| # | Selected Equipment | Celestial Body | 3D Model on `science.nasa.gov` | Direct Official 3D Download (.GLB) | High-Res Reference Images |
|---|---|---|---|---|---|
| **1** | **Opportunity Rover (MER-B)** | Mars | [View on NASA Science](https://science.nasa.gov/3d-resources/mars-exploration-rover-opportunity-mer-b/) | [Download Official .GLB](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-exploration-rover---opportunity-(mer-b)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb) | [NASA Image Archive](https://images.nasa.gov/details/PIA04422) |
| **2** | **Ingenuity Mars Helicopter** | Mars | [View on NASA Science](https://science.nasa.gov/3d-resources/ingenuity-mars-helicopter/) | [Download Official .GLB](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/ingenuity-mars-helicopter/Ingenuity%20Mars%20Helicopter.glb) | [NASA Flight Poster](https://science.nasa.gov/resource/ingenuity-72-pathbreaking-flights-poster/) |
| **3** | **Apollo 11 Lunar Module Descent Stage & ALSEP** | Moon | [View on NASA Science](https://science.nasa.gov/3d-resources/apollo-lunar-module/) | [Download Official .GLB](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/apollo-lunar-module/Apollo%20Lunar%20Module.glb) | [Apollo 11 Landing Site](https://science.nasa.gov/3d-resources/apollo-11-landing-site/) |
| **4** | **InSight Geophysical Lander** | Mars | [View on NASA Science](https://science.nasa.gov/3d-resources/insight-cruise-lander/) | [Download Official .GLB](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/insight-cruise-lander/InSight%20Cruise%20Lander%20(arm%20deployed).glb) | [HiRISE Dust Study](https://science.nasa.gov/resource/hirise-studies-the-dust-on-insight/) |
| **5** | **Apollo 15 Lunar Roving Vehicle (LRV-1)** | Moon | *Not standalone on 3D list (Landing Site 3D)* | [Apollo 15 Site 3D](https://science.nasa.gov/3d-resources/apollo-15-landing-site/) | [NASA Image: S71-30542](https://images-assets.nasa.gov/image/S71-30542/S71-30542~medium.jpg) & [EVA Photo: as15-86-11603](https://images-assets.nasa.gov/image/as15-86-11603/as15-86-11603~medium.jpg) |
| **6** | **Sojourner Rover & Mars Pathfinder** | Mars | *Not standalone on 3D list* | Model to be built from references | [NASA Image: PIA04422](https://images-assets.nasa.gov/image/PIA04422/PIA04422~medium.jpg) & [Scale View: PIA11431](https://images-assets.nasa.gov/image/PIA11431/PIA11431~small.jpg) |
| **7** | **Pioneer 10 Deep Space Probe** | Deep Space | [View on NASA Science](https://science.nasa.gov/3d-resources/pioneer/) | [Download Official .GLB](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/pioneer-10/Pioneer%2010.glb) | [NASA Archive: Pioneer 10](https://science.nasa.gov/mission/pioneer-10/) |
| **8** | **Surveyor 3 Robot Scout** | Moon | *Not standalone on 3D list* | Model to be built from references | [Apollo 12 Visit: AS12-48-7134](https://images-assets.nasa.gov/image/AS12-48-7134/AS12-48-7134~medium.jpg) & [Concept: S69-55553](https://images-assets.nasa.gov/image/S69-55553/S69-55553~medium.jpg) |

---

## 🛠️ Detailed 3D Modeling & Integration Instructions for Roland

These instructions guide how each tool will be **modeled, optimized, and rendered** into our React Three Fiber canvas stage (`src/components/canvas/ArtifactModel.tsx`):

### 1. Opportunity Rover (MER-B)
* **Official 3D Model:** [NASA .GLB Model](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/mars-exploration-rover---opportunity-(mer-b)/Mars%20Exploration%20Rover%20-%20Opportunity%20(MER-B).glb)
* **Key Components to Feature:**
  * Winged flat solar array deck with dark blue silicon cells (`metalness: 0.9`, `roughness: 0.15`).
  * Pancam mast assembly with binocular stereo cameras tilted forward.
  * 6-wheel rocker-bogie mobility suspension.
  * Front robotic arm (Instrument Deployment Device) tucked beneath chassis.
* **Podium Weathering Shader:** Apply an orange/crimson dust accumulation overlay that fades in as the story reaches the 2018 storm.

---

### 2. Ingenuity Mars Helicopter ("Ginny")
* **Official 3D Model:** [NASA .GLB Model](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/ingenuity-mars-helicopter/Ingenuity%20Mars%20Helicopter.glb)
* **Key Components to Feature:**
  * Dual counter-rotating coaxial carbon fiber rotor blades (`1.2m` span).
  * Small square avionics fuselage wrapped in thermal insulating film.
  * Top-mounted solar panel "hat" with the tiny Wright Flyer muslin fabric tribute underneath.
  * 4 carbon-composite landing legs angled outward at 45°.
* **Motion Directives:** Implement continuous counter-rotating rotation for the upper and lower rotor groups (`rotation.y += delta * 4` and `-delta * 4`).

---

### 3. Apollo 11 Lunar Module Descent Stage & ALSEP
* **Official 3D Model:** [NASA .GLB Model](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/apollo-lunar-module/Apollo%20Lunar%20Module.glb)
* **Key Components to Feature:**
  * Octagonal lower base clad in crinkled golden and amber aluminized Kapton Mylar foil (`metalness: 0.85`, `roughness: 0.2`).
  * Four tubular aluminum landing struts with round dish footpads.
  * The center descent rocket engine nozzle bell pointing down.
  * **The ALSEP Laser Retroreflector:** A companion cubic box with a grid of 100 quartz corner-cube prisms placed nearby on the lunar regolith.
* **Lighting Interaction:** When the Laser Reflector is brought into focus, emit a crystalline green laser pulse reflection pointing straight upward toward Earth.

---

### 4. InSight Geophysical Lander
* **Official 3D Model:** [NASA .GLB Model](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/insight-cruise-lander/InSight%20Cruise%20Lander%20(arm%20deployed).glb)
* **Key Components to Feature:**
  * Dual circular UltraFlex fan-like solar arrays flanking the octagonal lander body.
  * Deployable robotic arm extending forward with a grapple hand.
  * The **SEIS Golden Seismometer Dome**: A polished gold wind-and-thermal shield resting on the ground.
  * The **HP3 Heat Flow "Mole"** probe housing.
* **Podium Animation:** Add a gentle subterranean pulse vibration wave expanding outward from the SEIS dome on the podium floor.

---

### 5. Apollo 15 Lunar Roving Vehicle (LRV-1)
* **Modeling Source:** Modeled from NASA engineering schematics and official photography ([NASA S71-30542](https://images-assets.nasa.gov/image/S71-30542/S71-30542~medium.jpg)).
* **Key Components to Feature:**
  * Open tubular aluminum chassis with two fold-down lawn-chair seats.
  * Center T-shaped steering hand controller (joystick).
  * Four open wire-mesh wheels woven from zinc-coated piano wire with titanium chevron treads (open lattice wireframe texture).
  * High-gain umbrella mesh dish antenna and color TV camera mounted on the front right mast.
* **Resting Pose:** Parked angled facing the viewer, TV camera pointing upward at 45° to evoke the historic liftoff broadcast.

---

### 6. Sojourner Rover & Mars Pathfinder
* **Modeling Source:** Modeled from NASA historical archive ([NASA PIA04422](https://images-assets.nasa.gov/image/PIA04422/PIA04422~medium.jpg) and [PIA11431](https://images-assets.nasa.gov/image/PIA11431/PIA11431~small.jpg)).
* **Key Components to Feature:**
  * Compact microwave-sized chassis (`65 cm` length).
  * Flat top deck covered in dark blue GaAs solar cells.
  * 6 cleated aluminum wheels on a miniature rocker-bogie suspension system.
  * Rear-mounted Alpha Proton X-ray Spectrometer (APXS) arm sensor.
  * Front-mounted stereoscopic camera eyes.
* **Scale Relationship:** Rendered at a scale that immediately communicates to young students how astonishingly small and brave this first rover was.

---

### 7. Pioneer 10 Deep Space Probe
* **Official 3D Model:** [NASA .GLB Model](https://assets.science.nasa.gov/content/dam/science/cds/3d/resources/model/pioneer-10/Pioneer%2010.glb)
* **Key Components to Feature:**
  * Massive 2.74-meter diameter parabolic high-gain dish antenna (`side: DoubleSide`, white/light gray reflective dish).
  * Hexagonal equipment bus mounted behind the dish.
  * Two extended RTG (Radioisotope Thermoelectric Generator) power booms.
  * Long magnetometer boom stretching outward into deep space.
  * **The Golden Pioneer Plaque:** A gleaming gold-anodized aluminum plate mounted on the antenna support struts.

---

### 8. Surveyor 3 Robot Scout
* **Modeling Source:** Modeled from Apollo 12 astronaut retrieval photography ([NASA AS12-48-7134](https://images-assets.nasa.gov/image/AS12-48-7134/AS12-48-7134~medium.jpg) and [S69-55553](https://images-assets.nasa.gov/image/S69-55553/S69-55553~medium.jpg)).
* **Key Components to Feature:**
  * Open triangular tubular aluminum space frame resting on 3 tripod landing legs with crushable aluminum footpads.
  * Center vertical mast supporting a planar solar panel and high-gain antenna.
  * Motorized pantograph surface sampler arm with a scoop claw extended downward into the lunar soil.
  * The Vidicon TV camera housing (unbolted and brought home by Apollo 12).

---

## 📦 Optimization & Web Delivery Protocol

1. **Format:** Standardize all 3D assets to `.glb` (glTF binary) format with embedded Draco or Meshopt compression.
2. **Byte Budget:** Keep each standalone 3D model under **2.5 MB** to guarantee instant, 60fps web loads on school Chromebooks and mobile devices.
3. **Fallback Procedural Meshes:** Keep the lightweight procedural geometries in `ArtifactModel.tsx` active as instant zero-download fallbacks while external `.glb` models stream in the background.
