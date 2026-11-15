# PRODUCTION PROMPT 01: OPPORTUNITY ROVER (MER-B)
## 15-Year Martian Endurance & The Discovery of Ancient Liquid Water

**Audio Reference**: `public/audio/novo1.mp3` (Duration: 85.969s)  
**Target Environment**: WebGL / Three.js / React Three Fiber / WebAudio API  
**Visual Style**: Museum Documentary Realism (Lusion-grade material tactility, PBR lighting, and kinetic storytelling)

---

### 1. Artifact Identification
- **Artifact Name**: Opportunity Mars Exploration Rover (MER-B / Callsign: *Oppy*)
- **NASA Program**: Mars Exploration Rover Project (NASA / Caltech JPL)
- **Launch Date**: July 7, 2003 (Cape Canaveral SLC-17B, Delta II Heavy)
- **Landing Date**: January 25, 2004 (Sol 1) in Eagle Crater, Meridiani Planum
- **Mission Completion**: February 13, 2019 (Mission officially declared complete after Sol 5111 dust storm)
- **Current Physical Location**: Western rim of Endeavour Crater, Perseverance Valley, Meridiani Planum, Mars ($2.28^\circ \text{ S}, 354.76^\circ \text{ E}$)

---

### 2. Scientific Objective of the Scene
To demonstrate how Opportunity surpassed its design lifespan by a factor of 60, proved the existence of long-duration ancient acidic groundwater through in-situ hematite spherule concretion discovery ("blueberries"), navigated over 45 kilometers of treacherous terrain via rocker-bogie passive kinematics, and succumbed to the catastrophic physics of atmospheric optical depth ($\tau$) attenuation during the 2018 global dust storm.

---

### 3. Verified Historical and Technical Context
- **Design Life vs. Actual Life**: Engineered for 90 Martian days (sols) and 600 meters of driving; operated for 5,111 sols (14 years, 138 days) and drove 45.16 km (28.06 miles).
- **Aqueous Hematite Concretions**: Discovered in the "Pajamas" and "Opportunity Ledge" outcrops in Eagle Crater; analyzed via Mössbauer Spectrometer (revealing jarosite and gray hematite) and Alpha Particle X-Ray Spectrometer (APXS).
- **Purgatory Dune Extrication**: Spent Sol 446 to Sol 484 buried up to its axles in the soft sand ripple "Purgatory Dune" before driving out through reverse-slip odometry.
- **2018 Global Dust Storm**: Atmospheric opacity tau surged past 10.8 (lowest solar insolation ever recorded on Mars), dropping power generation from 600 Wh/sol to <22 Wh/sol.

---

### 4. Environment Description
- **Geographic Setting**: Transition from the shallow bowl of Eagle Crater (22 m diameter, light-toned sulfate rock outcrops) to the vast, windswept sand plains of Meridiani Planum, culminating at the elevated, jagged bedrock rim of Endeavour Crater (22 km diameter) overlooking Perseverance Valley.
- **Terrain Shader Parameters**:
  - Base: Coarse dark basaltic sand mixed with fine ochre iron-oxide dust ($Fe_2O_3$).
  - Rock Outcrops: Planar-laminated and cross-stratified sulfate-rich sandstone beds with millimeter-scale weathering recesses.
  - Spherules: Millions of 1–3 mm high-specular dark gray hematite spherules loose in soil ripple troughs and weathering out of bedrock.
- **Atmosphere & Skybox**:
  - Baseline: Pale salmon-pink / butterscotch sky during daylight; blue-tinted solar halo during dawn/dusk due to forward Rayleigh scattering by atmospheric dust.
  - Dust Storm Phase: Smooth transition to dense ochre gloom, then deep reddish-black darkness ($\tau > 10.0$).

---

### 5. Artifact Modelling Requirements
- **Chassis Structure**: Symmetrical Warm Electronics Box (WEB) clad in multi-layer gold-anodized insulation panels.
- **Mobility Subsystem**: Six independently driven 25-centimeter cleated aluminum wheels with spiral flexure spokes, mounted on a differential rocker-bogie linkage with titanium connecting rods.
- **Solar Array**: Gallium Arsenide/Germanium multi-junction solar array wings across the rover deck, divided into 3 string sectors.
- **PMA Mast**: Pancam Mast Assembly holding stereo Panoramic Cameras (Pancam), Navigation Cameras (Navcam), and the Miniature Thermal Emission Spectrometer (Mini-TES) periscope window.
- **Robotic Arm (IDD)**: 5-degree-of-freedom Instrument Deployment Device carrying the Mössbauer Spectrometer, APXS, Microscopic Imager, and Rock Abrasion Tool (RAT).
- **Antennas**: Gimballed High-Gain Antenna (HGA) dish, omnidirectional Low-Gain Antenna (LGA) mast, and UHF spiral whip antenna.

---

### 6. Mechanical Behaviour and Scientific Simulations
1. **Rocker-Bogie Inverse Kinematics**:
   - Differential rocker cross-link bar pivots over the chassis top, allowing each 3-wheel bogie cluster to articulate independently up to $\pm 25^\circ$.
   - Cleated wheels rotate and dynamically deform the sand terrain mesh, leaving realistic wheel ruts with chevron imprint normal maps.
2. **Robotic Arm IDD Kinematics**:
   - Articulation of shoulder azimuth, shoulder elevation, elbow elevation, wrist pitch, and wrist yaw joints.
   - Contact sensor pins on the APXS and Microscopic Imager compress upon making physical contact with rock faces.
3. **Atmospheric Dust Extinction Simulation**:
   - Continuous parametric shader updating solar panel vertex color and diffuse texture:
     $$\text{SolarOutput}(t) = \text{BasePower} \times e^{-\tau(t)} \times \cos(\theta_{\text{zenith}})$$
   - Red dust accumulation mask layers onto the solar wings, increasing surface roughness ($R \to 0.95$) and dropping metallic specular reflectance.

---

### 7. Timestamped Animation Storyboard

| Timecode | Narration Segment | Scene Description & Action |
|---|---|---|
| **00:00.000 – 00:08.140** | *"They told us we had 90 days. 90 Martian sunrises to land inside a nest of bouncing airbags..."* | Opening view of Eagle Crater rim. An exploded ghost silhouette of the landing cluster and airbags fades, revealing the pristine Opportunity rover standing deployed on its lander base. |
| **00:08.560 – 00:17.340** | *"...roll down our metal ramps, and see if the red planet was ever alive. 90 days? We gave humanity 15 years!"* | The rover's front wheels drive down the metallic ramps. A kinetic time-lapse effect accelerates sun movements; shadows race across the crater as dust settles onto the panels. |
| **00:17.900 – 00:24.320** | *"We climbed out of Eagle Crater with dust on our solar wings. We drove across endless red deserts."* | Rocker-bogie suspension articulates dynamically as the rover climbs the 15-degree sandy wall of Eagle Crater and heads across the vast, undulating red plains of Meridiani Planum. |
| **00:25.040 – 00:35.360** | *"We found the blueberries, tiny spheres of hematite that proved once and for all that liquid water once flowed, rippled, and pooled across Mars."* | The robotic arm deploys the Microscopic Imager onto a layered rock outcrop. Extreme macro push-in reveals metallic gray hematite "blueberries" embedded in the sulfate matrix. A translucent ripple of pale-blue water washes across the rock. |
| **00:35.940 – 00:46.760** | *"We conquered sand dunes that tried to swallow us whole. We drove an entire Olympic marathon on another world. 28 miles, one rock at a time."* | The rover powers through a massive sand ripple dune. An orbital trajectory map overlays the surface, tracing the glowing golden 45.16 km trek connecting Eagle, Victoria, and Endeavour craters. |
| **00:47.200 – 00:58.220** | *"And then, in the summer of 2018, the sky turned dark. A global dust storm swallowed the sun. Day turned into pitch-black night."* | Gale-force dust particles swirl violently across the screen. The sky dims from orange to muddy brown, then total blackness ($\tau > 10.8$). The solar panels become buried in fine red dust. |
| **00:58.740 – 01:07.820** | *"With our solar panels choking on red dust, we sent our last heartbeat through the dark. My battery is low, and it is getting dark."* | Close-up on the High-Gain Antenna dish. It gimbals toward Earth and emits a single delicate cyan pulse of radio waves into the roaring storm before all lights on the chassis fade to black. |
| **01:09.180 – 01:25.940** | *"Do not mourn us, we are not lost. We are parked forever at the edge of Endeavor Crater... waiting to lead you home."* | The storm clears to reveal a crystal-clear, peaceful Martian dawn. Opportunity stands resting at the edge of Endeavour Crater, looking out over Perseverance Valley, its tracks leading toward the horizon. |

---

### 8. Camera Choreography
- **00:00 - 00:15**: Slow forward dolly (35mm lens) settling into a low-angle heroic elevation ($15^\circ$) facing the rover.
- **00:15 - 00:30**: Dynamic orbital track (50mm lens) sweeping around the rocker-bogie wheels at ground level ($0.2\text{ m}$ above sand).
- **00:30 - 00:45**: Seamless macro transition: smooth zoom into the 100mm optical focal plane of the Microscopic Imager ($1 \text{ cm}$ focus distance).
- **00:45 - 00:60**: Aerial orbital pull-back ascending to 200 meters, rotating smoothly to frame the 45-kilometer odometer path.
- **00:60 - 00:75**: Handheld documentary shake (camera buffeted by wind turbulence, 1.2 Hz frequency) tight on the dust-caked mast.
- **00:75 - 00:85**: Slow, majestic cinematic crane rising to 25 meters, framing the silent sentinel against the Endeavour Crater panorama.

---

### 9. Lighting and Material Specifications
- **Sun Directional Light**: Warm key light ($\text{color} = \text{\#FFE4C4}$, $\text{intensity} = 3.5$), shadows configured with PCFSoftShadowMap (4096 resolution).
- **Atmospheric Ambient Light**: Diffuse hemispherical light ($\text{sky} = \text{\#B85B35}$, $\text{ground} = \text{\#5A2312}$, $\text{intensity} = 0.8$).
- **Materials**:
  - Gold Foil Insulation: Metalness 0.95, Roughness 0.18, normal map with micro-foil crinkles.
  - Aluminum Chassis: Metalness 0.85, Roughness 0.40, subtle weathering scratches.
  - Solar Cells: Metalness 0.90, Roughness 0.08, deep iridescent navy clearcoat.
  - Hematite Spherules: Metalness 0.75, Roughness 0.22, deep blue-gray specular sheen.
  - Dust Coating: Non-metallic (Metalness 0.0), Roughness 0.96, diffuse color `#B34A28`.

---

### 10. Audio Synchronisation Requirements
- The visual sequence must be strictly coupled to `novo1.mp3` via a WebAudio context timestamp listener.
- Every scene phase transition must trigger precisely at the millisecond timecode indicated in the storyboard.
- Scrubbing, pausing, or seeking in the media player must seek the Three.js animation mixer to the exact corresponding frame without temporal drift.

---

### 11. Sound Design Recommendations
- **00:00 – 00:18**: Faint, ambient Martian wind breeze ($45 \text{ Hz}$ low rumble) overlaid on narration.
- **00:18 – 00:30**: High-precision stepper motor whirrs and harmonic gearbox clicks during wheel rolling and steering turns.
- **00:30 – 00:45**: Delicate pneumatic actuator hiss and optical shutter click as the Microscopic Imager engages the rock.
- **00:47 – 00:60**: Rising wind gale roar ($300 \text{ Hz} - 2.5 \text{ kHz}$ bandpass white noise) with sand grains pinging against metallic chassis struts.
- **00:60 – 01:08**: Deep subsonic telemetry pulse chime ($880 \text{ Hz}$ sine wave with $4 \text{ s}$ reverb tail), fading into absolute atmospheric silence.
- **01:08 – 01:25**: Soft, serene high-register acoustic pads accompanying the peaceful dawn.

---

### 12. Required Assets and Models
- `models/sentinels/opportunity.glb` (Level of Detail: High, 85k polygons, fully rigged rocker-bogie and IDD arm).
- `models/environments/meridiani_planum.glb` (Eagle crater, sand ripples, Endeavour crater rim cliff).
- `textures/materials/hematite_blueberries_pbr/` (Albedo, Normal, Roughness, Height).
- `textures/particles/martian_dust_particle.png` (Alpha mask for GPU particle system).

---

### 13. Technical Implementation Recommendations
- **Framework**: `@react-three/fiber` (R3F) with `@react-three/drei` and `three-stdlib`.
- **Animation Orchestration**: `gsap.timeline()` bound to `audio.currentTime`.
- **Dust Storm Particle System**: GPU InstancedMesh utilizing custom instanced shader computing wind velocity, brownian motion, and light extinction.
- **Post-Processing**: `@react-three/postprocessing` with DepthOfField, Bloom (subtle threshold 0.85), Vignette, and ToneMapping (ACESFilmic).

---

### 14. Performance and Optimisation Requirements
- Maintain stable 60 FPS on mid-tier desktop GPUs (GTX 1660 / Apple M1) and 30+ FPS on mobile devices.
- Maximum draw calls: $< 80$ per frame.
- Maximum geometry: $< 250,000$ triangles total in view.
- Texture streaming: 2048x2048 maximum resolution with BC7/ASTC texture compression.

---

### 15. Scientific Accuracy Checklist
- [x] Verified exact rover mission lifespan (5,111 sols / 14 years, 138 days).
- [x] Verified total traversal distance (45.16 km / 28.06 miles).
- [x] Verified concretion composition (gray crystalline hematite in sulfate matrix).
- [x] Verified June 2018 dust storm optical depth ($\tau > 10.8$).
- [x] Verified terminal resting site coordinates at Endeavour Crater (Perseverance Valley).
