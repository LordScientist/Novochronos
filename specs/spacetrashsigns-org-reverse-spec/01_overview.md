# Overview

## Key findings

- Stack: Three.js, Three.js postprocessing (EffectComposer/passes), GSAP, GSAP ScrollTrigger, Lenis, Barba.js.
- Palette: background #ffffff, text ? (no saturated accent); text contrast ?:1.
- Type: ?; 0 sizes; spacing unit ?.
- Motion: 0 scroll-reveal element(s), 0 differential-scroll element(s), no idle render loop, 5 @keyframes.
- 3D/WebGL: none detected.
- Breakpoints (px): 320 (max-width), 374 (max-width), 390 (max-width), 519 (max-width), 767 (max-width), 768 (min-width), 1024 (max-width), 1279 (max-width), 1439 (max-width), 1440 (max-width), 1920 (min-width), 2560 (min-width).

## Pages analysed

| page | url | title | sections | doc height | depth |
| --- | --- | --- | --- | --- | --- |
| home | https://spacetrashsigns.org/ |  | – | – | full |

## Section flow of the home page (top to bottom)

_n/a_

## Messaging (headings and calls to action, home)

- Title: undefined
- Description: –

- CTAs: –

## Technology

- Three.js (3d)
- Three.js postprocessing (EffectComposer/passes) (3d)
- GSAP (animation)
- GSAP ScrollTrigger (animation)
- Lenis (scroll)
- Barba.js (transitions)

## Known gaps and limitations

- home: probe issues — idle: page.evaluate: Target page, context or browser has been closed; budget: exceeded the 45s per-page budget; results for this page are partial
- Only states reachable without logging in or filling forms were captured (no auth walls, carts, multi-step flows, or modals that need clicks other than the menu toggle).
- JS-driven motion that is not exposed via GSAP/WAAPI/CSS is observed only through before/after sampling and frames; exact easing curves for such code are unknown.
