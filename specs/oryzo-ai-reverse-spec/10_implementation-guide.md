# Implementation guide

**Target:** react + tailwind (Tailwind: use 02_design-system/tailwind.theme.snippet.js)

## Build order

1. **Tokens.** Drop in `02_design-system/tokens.css` and merge `tailwind.theme.snippet.js`. If the site defines its own variables (css-variables.md), use *those names and values* instead of the inferred `--dz-*` ones.
2. **Fonts.** Identify the exact families in typography.md (declared vs system). Self-host or load from the same provider only if you have the license; otherwise pick the closest available family and keep weights/sizes/line-heights.
3. **Layout skeleton.** Recreate the section flow from `03_structure/page-home.md` (section table = your page's component list). Use the container width, section padding and grid columns recorded there; confirm with the section screenshots.
4. **Components.** Build from `03_structure/components.md`: one React component per repeated pattern and button variant, props for text/media. Use the cleaned HTML samples for semantics (headings, landmarks, aria).
5. **Responsive.** Apply the layout-per-width table in `06_behaviour/responsive.md`; reproduce the mobile menu behaviour.
6. **Motion.** Use `gsap` + `@gsap/react` (`useGSAP`) + ScrollTrigger. Reproduce effects from your motion spec using the exact durations/easings/delays in 04_motion/animations.md.
7. **3D.** No 3D detected — skip.
8. **Behaviour.** Hover/focus/cursor/sticky rules from 06_behaviour/interactions.md; dark-mode and reduced-motion per theme-and-preferences.md.
9. **Polish pass.** Compare against the live site at 375/768/1440 and during a slow scroll.

## Evidence → implementation map

| when you see… | build it as… |
| --- | --- |
| css-variables.md has many global vars | the same variable names in your :root; reference them in every component |
| reveal pattern with opacity + translateY | a Reveal wrapper (IntersectionObserver or whileInView) using the recorded duration/easing |
| ScrollTrigger with pin/scrub in gsap.json | the same trigger/start/end/scrub/pin values on a timeline (do not re-guess them) |
| parallax rates in animations.md | translateY = scrollY × (1 − rate) per element, or a ScrollTrigger scrub |
| idle rAF loop + canvas | a render loop with visibility pause; see 3D section |
| Autonomous motion rows | CSS keyframes (keyframes.css) or a GSAP tween with repeat: -1 |
| hover diffs with transform/box-shadow | a transition on those properties using the recorded duration/easing |
| custom cursor follower | a fixed pointer-events:none element eased toward the mouse (lerp) with the recorded size/blend |

## Acceptance checklist

- [ ] Colors, type scale and spacing match tokens.
- [ ] Every section from the home page exists in the same order with the same layout at 1440 and 375.
- [ ] Each named effect in your motion spec reproduces its trigger, order, duration and easing.
- [ ] No missing media/3D regions.
- [ ] Respects prefers-reduced-motion and color-scheme the same way the original does.
- [ ] No copied copy, images, fonts, models or code.
