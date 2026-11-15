# PRODUCTION PROMPT 02: INGENUITY MARS HELICOPTER
## Thin-Atmosphere Aerodynamics, Flight 72 & The Wright Brothers' Legacy

**Audio Reference**: `public/audio/even/Novo_2.mp3` (Duration: 76.513s)  
**Target Environment**: WebGL / Three.js / React Three Fiber / WebAudio API  
**Visual Style**: Museum Documentary Realism (Lusion-grade aerodynamic visualization, micro-detail mechanics, and fluid camera choreography)

---

### 1. Artifact Identification
- **Artifact Name**: Ingenuity Mars Helicopter (Callsign: *Ginny*)
- **NASA Program**: Mars 2020 Mission (NASA / Caltech JPL / AeroVironment)
- **Launch Date**: July 30, 2020 (Cape Canaveral SLC-41, Atlas V 541)
- **Landing Date**: February 18, 2021 (attached to the belly of the Perseverance rover)
- **First Historic Flight**: April 19, 2021 (Wright Brothers Field, Jezero Crater)
- **Final Mission Flight**: January 18, 2024 (Flight 72, Airfield Valinor Hills)
- **Current Physical Location**: Airfield Valinor Hills (Neretva Vallis ripple dunes), Jezero Crater, Mars ($18.4447^\circ \text{ N}, 77.4508^\circ \text{ E}$)

---

### 2. Scientific Objective of the Scene
To demonstrate the physics of aerodynamic rotor lift in the ultra-thin carbon dioxide atmosphere of Mars ($<1\%$ Earth density), visualize the counter-rotating coaxial rotor cancellation of reactive torque at 2,500 RPM, reveal the historic link to the 1903 Wright Flyer muslin fabric swatch, illustrate visual-inertial odometry tracking surface ripples, demonstrate the high-speed blade tip impact mechanics during Flight 72, and show its enduring operational function as an automated weather station.

---

### 3. Verified Historical and Technical Context
- **Atmospheric Pressure Constraint**: Mars surface pressure is ~6 to 7 millibars (~0.6% to 0.7% of Earth's mean sea-level pressure of 1013 mbar). Aerodynamically equivalent to flying at 30,000 to 35,000 meters (100,000+ feet) altitude on Earth.
- **Flight Envelope**: Designed for 5 technology demonstration flights over 30 days; completed 72 operational flights over 1,004 days, logging 128.8 minutes of airtime and covering 17.0 km (10.5 miles).
- **Wright Flyer Fabric Swatch**: An unbleached muslin fabric swatch ($13 \times 13 \text{ mm}$) from the wing of the 1903 *Wright Flyer* is mounted beneath the solar panel using Kapton tape.
- **Flight 72 Anomaly**: On descent over featureless, uniform sand ripples in Neretva Vallis, optical tracking degraded, causing an excessive vertical descent rate and a hard ground impact that severed all four rotor blade tips.

---

### 4. Environment Description
- **Geographic Setting**: Jezero Crater floor transitioning from rocky boulder fields near the ancient river delta to the ripple dune field of Neretva Vallis / Airfield Valinor Hills.
- **Terrain Shader Parameters**:
  - Fine wind-sculpted sand ripples with $15 \text{ cm}$ wavelengths and razor-sharp crests.
  - Scattered basalt boulders with vesicular pitted textures.
  - High dynamic range micro-displacement capturing downwash rotor ground erosion.
- **Atmospheric Environment**:
  - Sky: Soft salmon-pink atmosphere with faint high-altitude water-ice cirrus clouds.
  - Downwash effect: Localized concentric dust rings kicked up dynamically beneath the rotors during hover and landing.

---

### 5. Artifact Modelling Requirements
- **Fuselage Enclosure**: Golden cubical electronics core ($14 \times 14 \times 14 \text{ cm}$) wrapped in multi-layer aluminized Mylar and thermal Kapton foil, housing the avionics, Qualcomm Snapdragon 801 processor, IMU, and 6 Sony lithium-ion battery cells.
- **Coaxial Rotor Assembly**: Two counter-rotating 1.21-meter diameter carbon-fiber composite rotor blades with lightweight foam cores, driven by custom brushless DC motors.
- **Swashplate & Linkages**: Miniature swashplate mechanisms with precision titanium pitch links and micro-servos mounted on the central mast.
- **Solar Array & Antenna**: Rectangular monocrystalline solar array mounted horizontally on top of the rotor mast, flanked by a vertical omnidirectional monopole antenna whip.
- **Landing Gear**: Four carbon-fiber composite legs angled outward at $45^\circ$, fitted with damping elastomeric footpads.
- **Flight 72 Modification**: Accurately modeled fractured blade tips displaying delaminated carbon fibers and exposed foam core.

---

### 6. Mechanical Behaviour and Scientific Simulations
1. **Coaxial Rotor Counter-Rotation**:
   - Upper blade rotates clockwise ($\omega_{\text{upper}} = +2,500 \text{ RPM}$); lower blade rotates counter-clockwise ($\omega_{\text{lower}} = -2,500 \text{ RPM}$).
   - Torque cancellation equation: $\tau_{\text{upper}} + \tau_{\text{lower}} = 0$, eliminating rotational fuselage spin.
2. **Aerodynamic Flow Visualization**:
   - Translucent velocity vectors and trailing helical tip vortices generated in GPU particle compute shaders, illustrating blade tip Mach numbers ($M \approx 0.7 - 0.8$ in cold $CO_2$).
3. **Flight 72 Rotor Tip Impact Mechanics**:
   - High-speed physics simulation of blade tip contacting sand at 160 m/s tip speed.
   - Dynamic structural fracture with carbon composite splinters erupting as the blade shears 10 cm from the tip.

---

### 7. Timestamped Animation Storyboard

| Timecode | Narration Segment | Scene Description & Action |
|---|---|---|
| **00:00.000 – 00:12.500** | *"They said flight on Mars was physically impossible. They said the Martian air was too thin, less than 1% of Earth's atmosphere, like trying to fly at 100,000 feet in the sky."* | Ground-level perspective in Jezero Crater. Atmospheric particle density visualization compares Earth's dense atmosphere with the thin, sparse Martian atmosphere. Ingenuity sits perched on its slender carbon legs under the vast pink sky. |
| **00:13.020 – 00:20.640** | *"On April 19th, 2021, we spun our twin carbon fiber blades, lifted three meters off the red dirt, and hovered."* | Spin-up sequence: Twin rotor disks accelerate to 2,500 RPM into a blurred circle. Concentric dust rings radiate outward in the sand. Ingenuity lifts vertically 3 meters and locks into an exceptionally stable hover. |
| **00:21.200 – 00:32.200** | *"Four pounds of defiance, and tucked right beneath our solar panel, a tiny postage stamp piece of muslin fabric, cut from the wing of the 1903 Wright Flyer."* | Close-up macro push-in directly underneath the solar panel. A translucent callout illuminates the miniature $13\text{ mm}$ square of historic 1903 Wright Flyer muslin fabric secured with golden Kapton tape. |
| **00:33.020 – 00:41.300** | *"We proved that humanity could fly on another world. We were only supposed to fly five times to prove the physics. We flew 72."* | The helicopter tilts forward into high-speed forward flight (5 m/s). An animated 3D flight corridor traces missions 1 through 72 across the rugged Martian topography. |
| **00:42.200 – 00:49.600** | *"We soared over boulder fields, scouted pathways for our big brother rover Perseverance, and surveyed alien canyons from the air."* | Downward aerial scout camera perspective: Ingenuity surveys treacherous boulder hazards from 12 meters altitude. In the distance, the Perseverance rover is seen following the safe route mapped by Ingenuity. |
| **00:50.180 – 00:56.500** | *"On our 72nd flight, landing in featureless ripples of sand, a rotor tip touched down hard."* | Reconstructed Flight 72 landing sequence: Optical flow tracking indicators on the sand ripples jitter. The craft touches down with residual tilt; a high-speed rotor tip strikes a sand crest, snapping the carbon fiber tip in a cloud of dust. |
| **00:56.500 – 01:03.680** | *"Our flying days ended there at Airfield Valinor Hills, but our computer still wakes up every single morning."* | The rotors coast to a final stop, revealing the fractured blade tips. The sun sets and rises in time-lapse; an internal electronic heartbeat pulse illuminates the avionics fuselage as the computer boots at dawn. |
| **01:04.140 – 01:16.380** | *"We check the temperature, we test the wind, we prove the sky of Mars is not a ceiling, it is a highway... welcome the next aviator who dares to spread their wings."* | Environmental telemetry readout overlays the display (ambient temp: $-82^\circ \text{C}$, wind: $4.2 \text{ m/s}$). The camera slowly ascends into the vast Martian sky, framing Ingenuity as an immortal monument on the desert floor. |

---

### 8. Camera Choreography
- **00:00 - 00:13**: Low ground-level dolly (24mm wide angle) looking up through the rotor blades toward the distant Jezero delta cliffs.
- **00:13 - 00:21**: Smooth vertical crane matching the helicopter's 3-meter ascent, circling $180^\circ$ around the hovering craft.
- **00:21 - 00:33**: Telephoto macro push-in (90mm macro lens) focusing sharply on the fabric swatch beneath the solar panel.
- **00:33 - 00:50**: Aerial chase camera trailing 4 meters behind Ingenuity in forward translational flight, banking dynamically.
- **00:50 - 00:57**: Ultra-high-speed slow motion (equivalent to 500 fps) camera orbiting the blade tip ground impact.
- **00:57 - 01:16**: Vertical ascending crane rising 40 meters straight up into the atmosphere, transitioning into an expansive planetary panorama.

---

### 9. Lighting and Material Specifications
- **Direct Sunlight**: High-intensity directional light ($\text{color} = \text{\#FFF2E0}$, $\text{intensity} = 3.8$).
- **Martian Sky Ambient**: Hemispherical ambient ($\text{sky} = \text{\#E8A082}$, $\text{ground} = \text{\#40180D}$, $\text{intensity} = 0.9$).
- **Materials**:
  - Carbon Fiber Rotors: Anisotropic metallic-roughness shader with high-specular clearcoat and micro-carbon weave normal maps.
  - Fuselage Core: Specular gold Mylar with micro-embossing and amber Kapton tape seams.
  - Muslin Fabric: Roughness 0.98, Metalness 0.0, warm cream albedo with woven fiber micro-displacement.
  - Fractured Blade Tips: Roughness 0.90, exposed dark gray foam interior and splintered carbon strands.

---

### 10. Audio Synchronisation Requirements
- Coupled strictly to `Novo_2.mp3` with millisecond fidelity.
- Rotor spin-up, hover transition, Flight 72 strike, and dawn reboot must align precisely with the narration timestamps.

---

### 11. Sound Design Recommendations
- **00:13 – 00:21**: High-frequency dual-tone rotor whine ($80 \text{ Hz}$ fundamental rising to $850 \text{ Hz}$ harmonic pitch) overlaid with soft wind flutter.
- **00:33 – 00:50**: Rhythmic aerodynamic thrum of coaxial blades cutting cold $CO_2$ air.
- **00:54 – 00:57**: Sharp mechanical crack of carbon composite fracture followed by the soft crunch of sand displacement.
- **01:03 – 01:16**: Low electronic chime and gentle morning Martian breeze.

---

### 12. Required Assets and Models
- `models/sentinels/ingenuity.glb` (Fully rigged rotor mast, swashplates, landing legs, and damaged blade tip variants).
- `models/environments/valinor_hills_ripples.glb` (High-resolution sand ripple terrain with micro-displacement).
- `models/props/perseverance_rover_lowpoly.glb` (Background asset for distant scouting sequence).

---

### 13. Technical Implementation Recommendations
- **Rotor Motion Blur**: Custom vertex shader with rotation angle interpolation to ensure smooth visual blur without GPU geometry overhead.
- **Vortex Particles**: Compute-shader particle system with ribbon trails rendering the twin tip vortex paths.
- **State Transition Engine**: State machine driven by `audio.currentTime` triggering camera cuts and mechanical transformations.

---

### 14. Performance and Optimisation Requirements
- 60 FPS target on desktop / 30 FPS on mobile.
- Polycount $< 180,000$ triangles.
- Draw calls $< 65$.
- Shader LOD for ground displacement: tessellation reduced beyond 10 meters distance.

---

### 15. Scientific Accuracy Checklist
- [x] Verified atmospheric pressure constraint (<1% Earth atmospheric density).
- [x] Verified rotor diameter (1.21 m) and spin rate (2,400–2,700 RPM).
- [x] Verified Wright Flyer muslin fabric swatch placement beneath solar panel.
- [x] Verified total flight count (72 completed flights).
- [x] Verified Flight 72 rotor damage at Airfield Valinor Hills.
