# 🎨 Design Token & 3D Motion Extraction Workflow
> **Novochronos Project — NASA Space Apps Challenge 2026**

This document outlines the workflow for using `dissect` to extract design tokens, 3D scene data, camera behaviors, and scroll animation mechanics from reference sites, and how they map directly into our **Podium-Style Exhibition Experience**.

---

## 🎯 What We Extract with `dissect`

When analyzing the reference 3D sites, `dissect` captures:

1. **3D & WebGL Tokens (`05_3d/`):**
   * Three.js scene hierarchy and mesh structures.
   * Camera field-of-view (FOV), near/far planes, initial and target coordinates.
   * Directional, ambient, and spotlight parameters (color, intensity, decay, shadow bias).
   * Material properties (metalness, roughness, transmission, emissive glow).
   * Custom vertex & fragment GLSL shaders used for stasis shields, particulate fields, or rim lighting.

2. **Motion & Scroll Dynamics (`04_motion/`):**
   * GSAP ScrollTrigger configuration objects (scrub rates, pinning thresholds, easing curves).
   * Keyframe timing curves (cubic-bezier values for deceleration and reveals).
   * Parallax and reveal ratios (how fast items scale or rotate relative to scroll distance).

3. **Design System Tokens (`02_design-system/`):**
   * Curated color palettes (backgrounds, glassmorphic panel tints, accent borders).
   * Inferred typography scales, font pairings, and line heights.
   * `tailwind.theme.snippet.js` for drop-in styling.

---

## 🛠️ How We Integrate Extracted Tokens into Novochronos

```
Reference 3D Website
       │
       ▼ (dissect crawl & probe)
┌────────────────────────────────────────────────────────┐
│ Extracted Bundle (Specs)                               │
├──────────────────────────┬─────────────────────────────┤
│ • 05_3d/ (Shaders/Scene) │ • 04_motion/ (Scroll/GSAP)  │
│ • 02_design-system/      │ • 08_evidence/ (Frames/Vid) │
└────────────┬─────────────┴──────────────┬──────────────┘
             │                            │
             ▼                            ▼
┌──────────────────────────┐ ┌───────────────────────────┐
│ Roland: 3D Stage Mesh    │ │ Joseph & Ishmael: UI/HUD  │
│ • Podium pedestal plinth │ │ • Glassmorphic placard CSS│
│ • Stasis dissolve shader │ │ • Scroll trigger thresholds│
│ • Spotlight rim contrast │ │ • Typography & badges     │
└──────────────────────────┘ └───────────────────────────┘
```

---

## 📋 Ready to Run

Add target website URLs to [`docs/reference-sites.txt`](./reference-sites.txt), and we will execute:

```bash
dissect <URL> \
  --focus "3d, scroll animations, design-system" \
  --target "react + tailwind" \
  --max-pages 2 \
  -o ./specs
```
