# Agent tasks — interpret the evidence

The tool measured; it did not look. These are the things only an agent with vision (or a human) can supply. Write your findings into your own notes (or an `interpretation/` folder) and keep them next to this bundle. **Do these before implementing.**

Open https://spacetrashsigns.org/ in a browser alongside the images.

## A. Overall impression
View: `08_evidence/screenshots/home/viewport-top.jpg` and `08_evidence/screenshots/home/full-page.jpg`.
Answer: brand mood in 3 adjectives · layout grid and rhythm (columns, gutters, alignment) · imagery style (photo / illustration / 3D / abstract / none) · density and whitespace · what draws the eye first · overall visual hierarchy.

## B. Section by section
View each file below, then answer for it: the composition (where text vs media sit), what is distinctive about it, and whether the automatic role guess is right.


## C. Motion
View, in order: `08_evidence/frames/home/load-*.jpg` (intro/load), then `08_evidence/frames/home/scroll-*.jpg` (scroll).
Cross-check with 04_motion/animations.md. Answer: what moves, in what **order**, with what **stagger** · direction and distance · relative speed (fast/slow, snappy/floaty) · easing feel · what is scrubbed to scroll vs triggered once · which effects are signature (the ones that make the site memorable) vs decoration · what would break the feel if omitted.

## D. 3D / canvas
No WebGL canvas was detected — skip, unless the live site shows 3D the probes missed (then note it under gaps).

## E. Hover and micro-interactions
No hover screenshots were taken; test hover states on the live site and cross-check with 06_behaviour/interactions.md.

## F. Responsive
View `08_evidence/responsive/home/` (375 / 768 / 1024 / 1440). Answer: how the layout recomposes (stack order, hidden/shown elements, image crops), what the mobile menu looks like and how it animates.

## G. Verify live (targeted checks from the known gaps)
- [ ] home: probe issues — idle: page.evaluate: Target page, context or browser has been closed; budget: exceeded the 45s per-page budget; results for this page are partial
- [ ] JS-driven motion that is not exposed via GSAP/WAAPI/CSS is observed only through before/after sampling and frames; exact easing curves for such code are unknown.
- [ ] Scroll the live page slowly once, watching for effects with no measurable state change (SVG path draws, text splitting, canvas drawing, view transitions between pages).
- [ ] Click a nav link and watch for a page transition (the tool navigates with fresh loads, so route-change animations are not captured).

## H. Output you should produce
1. **Design brief** (A, B) — 1 page.
2. **Motion spec** (C) — a list of named effects, each with trigger, targets, duration, easing, order/stagger, and a pointer to the data row in 04_motion.
3. **3D spec** (D) if relevant.
4. **Component list** — which repeated patterns/buttons become components, with props.
5. **Open questions** — things you could not determine.
