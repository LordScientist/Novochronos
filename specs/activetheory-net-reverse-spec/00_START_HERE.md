# Reverse-engineering spec — activetheory.net

**Reference site:** https://activetheory.net/  (captured 2026-11-14; 1 page(s), viewport 1440×900)
**Focus requested:** "3d, scroll animations, design-system, cards" → design-system, components, motion, 3d
**Implementation target:** react + tailwind

This bundle is a frontend reverse-engineering of the reference site: its design system, page/component structure, motion, 3D and behaviour, measured in a real browser. Open the live site beside it — the numbers here tell you *what* and *how much*; the live site tells you *feel*.

## How to use this bundle (for the agent)

1. Read this file, then **01_overview.md** (key findings + known gaps).
2. Read the ★ files first if marked — they match the requested focus.
3. **The tool collected evidence; it did not interpret images.** Do the visual interpretation described in **09_agent-tasks.md** (view the screenshots/frames/video, write down what you see) before building.
4. Re-verify anything in "Known gaps" against the live URL — you may spot details the automated probes missed.
5. Build using **10_implementation-guide.md**. Start from tokens (02_design-system/tokens.css), then structure, components, motion, 3D.

## Key findings

- Stack: Three.js postprocessing (EffectComposer/passes), Theatre.js.
- Palette: background #000000, text #ffffff (no saturated accent); text contrast 21:1.
- Type: nbarchitekt; 1 sizes; spacing unit 5px.
- Motion: 0 scroll-reveal element(s), 0 differential-scroll element(s), no idle render loop, 1 @keyframes.
- 3D/WebGL: none detected.
- Breakpoints (px): none found.

## Files

|  | file | what it contains |
| --- | --- | --- |
| ★ | 02_design-system/README.md | Design-system summary |
| ★ | 02_design-system/colors.md | Palette, inferred roles, contrast, gradients |
| ★ | 02_design-system/css-variables.md | The site's own custom properties |
| ★ | 02_design-system/spacing-layout.md | Spacing unit, radii, shadows, z-index, breakpoints, CSS features |
|  | 02_design-system/tailwind.theme.snippet.js | Tailwind theme starting point |
|  | 02_design-system/tokens.css | Tokens as CSS variables |
| ★ | 02_design-system/tokens.json | Machine-readable tokens |
| ★ | 02_design-system/typography.md | Fonts, @font-face, type scale, per-element styles |
| ★ | 03_structure/components.md | Buttons, fields, repeated components with HTML samples |
|  | 03_structure/page-home.md | Section-by-section structure of the home page (other pages: page-<slug>.md) |
|  | 03_structure/sitemap.md | Pages crawled and navigation |
| ★ | 04_motion/README.md | Plain-language motion summary + implementation hints |
| ★ | 04_motion/animations.md | Every measured animation, reveal, parallax, GSAP config, transition |
|  | 04_motion/keyframes.css | All @keyframes verbatim |
| ★ | 05_3d/README.md | WebGL/3D scene, materials, shaders, reactivity |
|  | 06_behaviour/interactions.md | Hover/cursor/sticky behaviour |
|  | 06_behaviour/responsive.md | Layout changes per width, mobile menu |
|  | 06_behaviour/theme-and-preferences.md | Dark mode and reduced motion |
|  | 07_stack-assets/assets-manifest.json | Asset URLs by category |
|  | 07_stack-assets/stack.md | Tech stack + network summary |
|  | 08_evidence/INDEX.md | Every screenshot/frame/video with what to look for |

Also: `03_structure/page-<slug>.md` (one per page), `03_structure/html-samples/`, `04_motion/gsap.json`, `05_3d/shaders/` and `scene-graph-*.json` (when 3D exists), `08_evidence/` (images, video), `data/*.json` (raw per-page probe output — search here for anything the summaries omit), `manifest.json`.

## Ground rules

- Facts here are **measured** (computed styles, live animation objects, scene dumps). Anything labelled *inferred*/*guess* (color roles, section roles, component names) is a heuristic — check it against the screenshots.
- Rebuild the *design and behaviour*; do not copy the site's text, images, fonts, 3D models or code. Asset URLs are references only.
