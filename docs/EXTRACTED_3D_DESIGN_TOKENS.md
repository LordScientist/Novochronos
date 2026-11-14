# 🏛️ Novochronos: Extracted 3D Design Tokens & Motion Blueprint
> **Derived from `3D-Websites-Inspiration-Library.docx` using `dissect`**  
> **Key References:** *Oryzo (Lusion)*, *Iventions (Awwwards Site of the Day)*, *Space Trash Signs (WebGL Space Debris)*

This document compiles the concrete design tokens, easing curves, layout grids, and Three.js lighting parameters extracted via reverse-engineering, ready for **Roland** (3D stage) and **Joseph** (UI/UX) to implement our **Podium-Style Exhibition Experience**.

---

## 1. Cinematic Easing Curves & Motion Physics (from *Iventions*)

These cubic-bezier curves were extracted from *Iventions*, recognized for lighting 3D scenes like spotlit physical gallery installations.

| Token Name | Cubic-Bezier Value | Purpose in Novochronos Podium |
| :--- | :--- | :--- |
| `--ease-podium-reveal` | `cubic-bezier(0.165, 0.84, 0.44, 1)` | **The Stasis Dissolve:** Heavy initial deceleration as the protective shroud vanishes and the relic settles. |
| `--ease-camera-sweep` | `cubic-bezier(0.76, 0, 0.24, 1)` | **Camera Travel:** Dramatic cinematic swing as the visitor scrolls between exhibits (Z-depth shift). |
| `--ease-spotlight-focus`| `cubic-bezier(0.33, 1, 0.68, 1)` | **Spotlight Ignition:** Gentle exponential fade-in as the overhead gallery lamp turns on. |
| `--ease-hover-relic` | `cubic-bezier(0.45, 0, 0.55, 1)` | **Idle Bobbing & Orbit:** Gentle sinusoidal buoyancy while inspecting the model. |

### Tailwind / CSS Integration:
```css
:root {
  --ease-podium-reveal: cubic-bezier(0.165, 0.84, 0.44, 1);
  --ease-camera-sweep: cubic-bezier(0.76, 0, 0.24, 1);
  --ease-spotlight-focus: cubic-bezier(0.33, 1, 0.68, 1);
}
```

---

## 2. 3D Stage Layout & Viewport Grid System (from *Oryzo / Lusion*)

*Oryzo* is the global benchmark for one 3D hero object with physical weight, inertia, and Z-depth camera navigation.

### The 16-Column Spatial Grid:
* **Grid Division:** 16 columns total across the viewport.
* **Canvas Spatial Allocation:** Left 9–10 columns dedicated to the 3D Podium & Relic stage (`~60vw`).
* **HUD / Placard Allocation:** Right 6–7 columns dedicated to the scrollable narrative placards (`~40vw`).
* **Viewport Margins:** `--site-padding-x: 3.125vw` (ensures content breathes on 4K, 1440p, and 1080p displays).
* **Placard Dimensions (from *Space Trash Signs*):**
  * Max Width: `37rem` (`592px`)
  * Top Offset: `2.4rem` (`38.4px`)
  * Right Offset: `2.4rem` (`38.4px`)

---

## 3. The 3D Podium Lighting & Material Architecture (for Roland)

Based on the reverse-engineered Three.js installation scenes:

### A. Three-Point Museum Lighting Rig:
```typescript
// 1. Primary Overhead Gallery Spotlight (Key Light)
<spotLight
  position={[0, 7.5, 2.5]}
  angle={0.38}               // Tight, dramatic cone
  penumbra={0.7}             // Soft, feathered shadow falloff
  intensity={isRevealed ? 3.5 : 0.6}
  castShadow
  shadow-mapSize={[2048, 2048]}
  shadow-bias={-0.0001}
  color="#ffffff"
/>

// 2. High-Contrast Rim Light (Separates Relic from Space Darkness)
<pointLight
  position={[-3.5, 2.2, -2.5]}
  intensity={2.2}
  color={activeCelestialTheme.accent} // e.g. Cyan #00f2fe or Martian Rust #f97316
/>

// 3. Ambient Floor Fill (Bounce from Titanium Plinth)
<pointLight
  position={[3.0, 0.8, 2.0]}
  intensity={1.0}
  color={activeCelestialTheme.primary}
/>
```

### B. The Stasis Shroud Dissolve Shader Material:
* **Base Mesh:** Cylinder surrounding the pedestal (`height: 2.2`, `radius: 2.0`).
* **Material Properties:**
  * `transparent: true`
  * `opacity: 1.0 - scrollProgress` (linear fade to 0 when in focus)
  * `roughness: 0.1`
  * `metalness: 0.9`
  * `wireframe: scrollProgress < 0.4` (starts holographic, dissolves into thin air)

---

## 4. Curated Color Palette & Celestial Tints (for Joseph)

Extracted from dark-mode WebGL benchmarks and adjusted for NASA off-world environments:

| Role | Color Hex | RGB / Alpha | Usage |
| :--- | :--- | :--- | :--- |
| **Cosmic Deep Background** | `#030712` | `rgb(3, 7, 18)` | Scene clear color, body background |
| **Pedestal Obsidian Carbon** | `#070d1e` | `rgb(7, 13, 30)` | Lower plinth tier & HUD panel blur |
| **Lunar Silver Highlight** | `#e2e8f0` | `rgb(226, 232, 240)` | Apollo / Surveyor placards & dust |
| **Laser Crystalline Cyan** | `#00f2fe` | `rgb(0, 242, 254)` | Telemetry badges & retroreflector ping |
| **Martian Regolith Rust** | `#ea580c` | `rgb(234, 88, 12)` | Opportunity / InSight rim light & sand |
| **Solar Cell Deep Navy** | `#0f172a` | `rgb(15, 23, 42)` | Photovoltaic array base |
| **Golden Mylar Foil** | `#ffd700` | `rgb(255, 215, 0)` | Apollo descent stage & Pioneer plaque |

---

## 5. Implementation Roadmap for the Team

1. **Roland (3D):**
   * Use the easing curve `cubic-bezier(0.165, 0.84, 0.44, 1)` for the model rotation and pedestal elevation.
   * Apply the three-point spotlight rig to create high-contrast shadows on each artifact model.
2. **Joseph (UI/UX):**
   * Use the `--constellation-panel-width: 37rem` (`592px`) dimension for `MuseumPlaque.tsx`.
   * Apply glassmorphism (`backdrop-blur-xl bg-space-900/80 border border-slate-700/60`).
3. **Justice & Ishmael (Audio):**
   * Sync the audio narrative's duration (~65–75 seconds) with the relaxed reading speed of the 3-tab placard.
