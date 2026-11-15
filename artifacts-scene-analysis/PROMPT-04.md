# PRODUCTION PROMPT 04: INSIGHT LANDER
## Planetary Seismology, Martian Internal Ultrasound & Solar Power Extinction

**Audio Reference**: `public/audio/even/Novo_4.mp3` (Duration: 78.759s)  
**Target Environment**: WebGL / Three.js / React Three Fiber / WebAudio API  
**Visual Style**: Museum Documentary Realism (Lusion-grade seismic propagation visuals, gold thermal shielding, and poignant environmental storytelling)

---

### 1. Artifact Identification
- **Artifact Name**: InSight Lander (Interior Exploration using Seismic Investigations, Geodesy and Heat Transport)
- **NASA Program**: Discovery Program (NASA / Caltech JPL / CNES / DLR)
- **Launch Date**: May 5, 2018 (Vandenberg AFB SLC-3E, Atlas V 401)
- **Landing Date**: November 26, 2018 (Sol 0) at Elysium Planitia
- **Mission Completion**: December 21, 2022 (Mission officially declared concluded on Sol 1446 due to dead battery)
- **Current Physical Location**: Elysium Planitia volcanic plain, Mars ($4.5024^\circ \text{ N}, 135.6234^\circ \text{ E}$)

---

### 2. Scientific Objective of the Scene
To demonstrate the deployment of the ultra-sensitive SEIS seismometer, visualize the mechanical and thermal isolation provided by the Wind and Thermal Shield (WTS), illustrate the detection of 1,300+ marsquakes and bolide meteorite impacts, simulate planetary ultrasound revealing the thickness of the Martian crust, mantle stratification, and the large liquid iron-nickel core ($r \approx 1,830 \text{ km}$), and demonstrate the progressive loss of photovoltaic power caused by atmospheric dust accumulation leading to the lander's poetic final transmission.

---

### 3. Verified Historical and Technical Context
- **SEIS Sensitivity**: Built by CNES; capable of detecting ground displacements on the order of $10^{-12} \text{ meters}$ (smaller than a hydrogen atom radius) across frequencies from 0.01 Hz to 50 Hz.
- **Planetary Ultrasound Discoveries**:
  - Crust: Layered basaltic crust between 24 and 72 km thick.
  - Mantle: Lithospheric mantle extending down to ~1,560 km.
  - Core: Completely molten liquid core with a surprisingly large radius of $1,830 \pm 40 \text{ km}$ containing iron, nickel, and light elements (sulfur, oxygen, carbon).
- **Power Loss Mechanism**: Unlike Spirit and Opportunity, InSight landed in a region devoid of dust-clearing vortices (dust devils). Dust accumulated steadily across its twin UltraFlex solar arrays, dropping power output from 4,500 Wh/sol to <300 Wh/sol.
- **Final Historic Message**: On Sol 1442 (December 15, 2022), InSight transmitted its iconic farewell photo with the caption: *"My power is really low, so this may be the last image I can send... Don't worry about me though. My time here has been both productive and serene."*

---

### 4. Environment Description
- **Geographic Setting**: Elysium Planitia—a smooth, flat volcanic plain near the Martian equator, virtually free of large rocks or steep slopes, characterized by fine iron-rich basaltic regolith.
- **Terrain Shader Parameters**:
  - Flat plain with micro-pebble texture ($2-5 \text{ mm}$ basalt fragments) and smooth drift sand.
  - Subterranean cross-section: Viscoelastic basaltic crust, olivine/pyroxene mantle, and incandescent liquid core.
- **Atmospheric Environment**:
  - Sky: Soft butterscotch daylight fading into dusty twilight.
  - Dust airfall: Continuous microscopic dust settlement effect visible on horizontal surfaces.

---

### 5. Artifact Modelling Requirements
- **Chassis Structure**: Hexagonal aluminum deck ($1.56 \text{ m}$ across) supported by three shock-absorbing landing legs.
- **UltraFlex Solar Arrays**: Two decagonal foldable solar wings ($2.15 \text{ m}$ diameter each) with radial structural ribs and photovoltaic cells.
- **Robotic Arm (IDA)**: 2.4-meter Instrument Deployment Arm with a five-claw grapple mechanism and Instrument Deployment Camera (IDC).
- **SEIS Instrument Package**:
  - Internal: Evacuated spherical titanium chamber housing three Very Broad Band (VBB) pendulum sensors and three Short Period (SP) sensors.
  - External: Golden hexagonal Wind and Thermal Shield (WTS) dome with aluminum thermal skirting and tether link back to the deck.
- **HP3 Instrument**: Heat Flow and Physical Properties Package ("the Mole") housing and support frame.

---

### 6. Mechanical Behaviour and Scientific Simulations
1. **Robotic Grapple Deployment**:
   - The IDA rotates and lowers the WTS dome onto the Martian soil, releasing the grapple claw.
2. **Sub-Atomic Seismometer Vibration Simulation**:
   - Leaf-spring inverted pendulum inside the evacuated sphere oscillating with sub-nanometer amplitude in response to seismic waves.
3. **Planetary Wavefield Ultrasound Simulation**:
   - Propagation of compressional ($P$) and shear ($S$) wavepackets through the Martian mantle, reflecting off the core-mantle boundary ($PcP$) and refracting through the liquid core ($PKP$).
4. **Procedural Dust Accumulation Shader**:
   - Vertex-color and multi-texture blend gradually coating the UltraFlex solar panels with opaque red-brown dust, reducing solar specular glints to zero.

---

### 7. Timestamped Animation Storyboard

| Timecode | Narration Segment | Scene Description & Action |
|---|---|---|
| **00:00.000 – 00:05.780** | *"In 2018, we touched down on the smooth volcanic plains of Elysium Planitia."* | Opening wide establishing shot of the vast, flat plains of Elysium Planitia. The InSight lander sits centered, its twin decagonal UltraFlex solar arrays gleaming under the afternoon sun. |
| **00:06.440 – 00:19.180** | *"With our robotic arm, we placed a golden dome onto the dirt, the most sensitive seismometer ever built by human hands. It could detect a ground tremor smaller than the width of a single atom of hydrogen."* | The robotic arm rotates and gently lowers the golden WTS dome onto the soil. A cutaway X-ray view reveals the internal SEIS sphere: microscopic pendulum sensors vibrating at sub-atomic scale as faint cyan ground tremor ripples radiate through the soil. |
| **00:19.720 – 00:33.900** | *"For four years, we sat motionless in the silence, and Mars spoke to us. We felt 1,300 Mars quakes rumbling through the mantle. We heard meteorite impacts striking the crust like distant drumbeats."* | Time accelerates. A seismic waveform trace graphs across the bottom of the viewport. In the distance, a meteorite strikes the crust, sending glowing concentric shockwaves rippling across the surface and deep into the bedrock. |
| **00:34.600 – 00:44.700** | *"We gave humanity the very first ultrasound of an alien world, proving that beneath its cold desert shell, Mars has a giant molten liquid core."* | 3D planetary cutaway: The camera plunges beneath the lander through the crust and mantle to reveal the heart of Mars: an immense glowing liquid iron-nickel core churning at the center, refracting seismic ray-paths back up to InSight. |
| **00:45.400 – 00:56.440** | *"With every passing month, the red dust settled thicker and thicker over our solar wings. We had no windshield wipers, we had no little rover wheels to shake it loose."* | Surface camera returns to InSight. Close-up on the solar arrays: Layer upon layer of red dust settles, burying the dark blue solar cells beneath a thick ochre blanket. The lander's white chassis turns dull and weathered. |
| **00:56.440 – 01:12.360** | *"Day by day, our power faded. When the last volt drained away, we sent our final message home. My power is really low, so this may be the last image I can send... productive and serene."* | The robotic arm camera powers on one last time, framing the iconic NASA farewell view of the dusty deck and Elysium horizon. The electrical battery telemetry drains to 0 Wh; lights switch off into complete silence. |
| **01:13.060 – 01:18.560** | *"We took the pulse of a world. Now, we sleep peacefully in its crimson dust."* | Final tranquil night composition: InSight rests in eternal peace under a canopy of brilliant Martian stars. The golden dome of SEIS sits quietly beside it in the dust—the silent stethoscope of Mars. |

---

### 8. Camera Choreography
- **00:00 - 00:06**: Slow forward dolly (28mm lens) across Elysium Planitia toward InSight.
- **00:06 - 00:19**: Intimate macro tracking shot following the claw grapple lowering the golden dome, transitioning into a technical cross-section.
- **00:19 - 00:34**: Ground-level lateral dolly observing the surface shockwaves, tilting up to capture the distant meteorite strike.
- **00:34 - 00:45**: Epic planetary cutaway descending from surface to core, revealing the 3D interior of Mars.
- **00:45 - 00:56**: Slow orbiting camera revolving around the dust-choked solar panels.
- **00:56 - 01:12**: First-person camera transition mimicking the real IDC farewell image, fading into twilight.
- **01:12 - 01:18**: Ascending crane shot rising 30 meters, framing the sleeping lander under the starry night sky.

---

### 9. Lighting and Material Specifications
- **Sun Directional Light**: Warm key light ($\text{color} = \text{\#FFDFBA}$, $\text{intensity} = 3.6$).
- **Planetary Core Emission**: Subterranean point light ($\text{color} = \text{\#FF5500}$, $\text{intensity} = 8.0$, visible only in planetary cutaway mode).
- **Materials**:
  - Gold WTS Shield: Metalness 0.98, Roughness 0.12, high specular gold.
  - Solar Panels: Base Metalness 0.85, Roughness 0.10, fading into non-metallic dust overlay (Roughness 0.95, Color `#A84522`).
  - Lander Deck: Painted white aluminum with realistic paint chipping and dust stains.

---

### 10. Audio Synchronisation Requirements
- Coupled strictly to `Novo_4.mp3` with millisecond fidelity.
- Dome placement, marsquake impact, planetary ultrasound reveal, and power shutdown must align precisely with the spoken narrative.

---

### 11. Sound Design Recommendations
- **00:06 – 00:19**: Precision robotic servo whine and mechanical claw release click.
- **00:19 – 00:34**: Deep subterranean bass rumble ($20 - 45 \text{ Hz}$) representing the marsquake shockwaves.
- **00:34 – 00:45**: Resonant acoustic ping mimicking medical ultrasound sonar echoes.
- **00:56 – 01:12**: Soft electronic relay click, dying capacitor hum, and quiet wind whistle.

---

### 12. Required Assets and Models
- `models/sentinels/insight_lander.glb` (Fully rigged chassis, solar arrays, IDA arm, and WTS dome).
- `models/props/seis_cutaway.glb` (Internal evacuated sphere and leaf-spring sensor mechanism).
- `models/environments/mars_interior_cutaway.glb` (Planetary slice showing crust, mantle, and molten liquid core).

---

### 13. Technical Implementation Recommendations
- **Planetary Core Shader**: Multi-layered noise displacement shader rendering dynamic molten convection in the liquid core.
- **Seismic Wave Propagation**: Vertex shader animating ripple displacement waves across the surface mesh.
- **Dust Layering**: Custom R3F material shader interpolating between clean solar panel and dust texture via uniform float `uDustAccumulation`.

---

### 14. Performance and Optimisation Requirements
- 60 FPS desktop / 30 FPS mobile.
- Geometry: $< 220,000$ triangles.
- Draw calls: $< 70$.
- Volumetric shockwaves computed via instanced ring meshes with fade falloff.

---

### 15. Scientific Accuracy Checklist
- [x] Verified landing site coordinates in Elysium Planitia ($4.5024^\circ \text{ N}, 135.6234^\circ \text{ E}$).
- [x] Verified SEIS sensitivity ($<10^{-12} \text{ m}$ displacement).
- [x] Verified marsquake count (over 1,300 detected events).
- [x] Verified core radius ($1,830 \pm 40 \text{ km}$) and molten liquid state.
- [x] Verified terminal date (Sol 1446, December 2022) and final transmission text.
