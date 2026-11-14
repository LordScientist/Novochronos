# Motion overview (auto-generated from measurements)

- **Detected motion drivers:** Three.js, Three.js postprocessing (EffectComposer/passes), GSAP, Rive.
- No continuous rAF loop while idle (~0/s): motion is event- or scroll-triggered.
- No scroll-reveal state changes detected by the before/after sweep.
- **prefers-reduced-motion:** 5 CSS rule(s) handle it.

## Implementation hints

- GSAP is in play: rebuild scroll choreography with `gsap.timeline({ scrollTrigger })`; copy start/end/scrub/pin values from gsap.json rather than eyeballing them.
- Keyframes are available verbatim in keyframes.css; reuse them directly.
- Always check the load frames and scroll frames in 08_evidence/frames/ — numbers tell you *what* changes, the frames tell you *how it should feel*.

## Where to look

- animations.md — every measured animation: keyframes, live CSS/Web animations, reveals, parallax, GSAP configs, transitions.
- keyframes.css — all @keyframes found in the stylesheets, verbatim.
- gsap.json — raw GSAP tween/timeline/ScrollTrigger dump (if GSAP is present).
- ../08_evidence/frames — load sequence, scroll sequence and pointer frames (view these to judge feel).
- ../08_evidence/video — scroll-through recording of the home page (if recorded).

_Limits: the tool samples states (load, 12-ish scroll positions, hover, pointer). It cannot see animation curves for JS-driven motion that is not exposed through GSAP/WAAPI/CSS; use the frames and video, and verify on the live site._
