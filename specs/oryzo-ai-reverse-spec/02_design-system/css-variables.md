# The site's own CSS custom properties

These are **the site's real design tokens** — prefer them (names and values) over the inferred ones. 58 global (:root/html/body) variable(s), 141 definitions in total.

## Global: --other-*  (14)

| variable | value | defined in |
| --- | --- | --- |
| --vh | 1vh | :root (index.TL6TuoJb.css) |
| --h1 | calc(164 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --h2 | calc(68 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --h3 | calc(45 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --h4 | calc(32 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --h5 | calc(20 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --sub1 | calc(24 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --sub2 | calc(16 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --body1 | calc(38 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --body2 | calc(24 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --body3 | calc(18 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --quote | calc(30 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --default | calc(18 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |
| --btn | calc(16 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |

## Global: --display-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --display-font | "halyard-display-variable" | :root (index.TL6TuoJb.css) |

## Global: --text-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --text-font | "halyard-text-variable" | :root (index.TL6TuoJb.css) |

## Global: --site-*  (4)

| variable | value | defined in |
| --- | --- | --- |
| --site-padding-x | 3.125vw | :root (index.TL6TuoJb.css) |
| --site-row-height | calc(var(--site-padding-x) * 8 / 60) | :root (index.TL6TuoJb.css) |
| --site-padding-y | calc(var(--site-row-height) * 4) | :root (index.TL6TuoJb.css) |
| --site-header | 21px | :root (index.TL6TuoJb.css) |

## Global: --grid-*  (22)

| variable | value | defined in |
| --- | --- | --- |
| --grid-columns | 16 | :root (index.TL6TuoJb.css) |
| --grid-rows | 1 | :root (index.TL6TuoJb.css) |
| --grid-gap-scale | calc(24 / 90) | :root (index.TL6TuoJb.css) |
| --grid-gap-width | calc((100vw - var(--site-padding-x) * 2) / ((var(--grid-columns) / var(--grid-gap-scale))… | :root (index.TL6TuoJb.css) |
| --grid-column-width | calc(var(--grid-gap-width) / var(--grid-gap-scale)) | :root (index.TL6TuoJb.css) |
| --grid-span-width | calc(var(--grid-gap-width) + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-1 | var(--grid-column-width) | :root (index.TL6TuoJb.css) |
| --grid-span-2 | calc(var(--grid-span-width) * 1 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-3 | calc(var(--grid-span-width) * 2 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-4 | calc(var(--grid-span-width) * 3 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-5 | calc(var(--grid-span-width) * 4 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-6 | calc(var(--grid-span-width) * 5 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-7 | calc(var(--grid-span-width) * 6 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-8 | calc(var(--grid-span-width) * 7 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-9 | calc(var(--grid-span-width) * 8 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-10 | calc(var(--grid-span-width) * 9 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-11 | calc(var(--grid-span-width) * 10 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-12 | calc(var(--grid-span-width) * 11 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-13 | calc(var(--grid-span-width) * 12 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-14 | calc(var(--grid-span-width) * 13 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-15 | calc(var(--grid-span-width) * 14 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |
| --grid-span-16 | calc(var(--grid-span-width) * 15 + var(--grid-column-width)) | :root (index.TL6TuoJb.css) |

## Global: --color-*  (12)

| variable | value | defined in |
| --- | --- | --- |
| --color-white | #ffedd7 | :root (index.TL6TuoJb.css) |
| --color-white-transparent | #ffedd700 | :root (index.TL6TuoJb.css) |
| --color-black | #100904 | :root (index.TL6TuoJb.css) |
| --color-black-transparent | #10090400 | :root (index.TL6TuoJb.css) |
| --color-grey-brown | #6c5f51 | :root (index.TL6TuoJb.css) |
| --color-green | #445231 | :root (index.TL6TuoJb.css) |
| --color-green-light | #5d6c49 | :root (index.TL6TuoJb.css) |
| --color-green-lightest | #f6e0c6 | :root (index.TL6TuoJb.css) |
| --color-pure-white | #fff | :root (index.TL6TuoJb.css) |
| --color-pure-black | #000 | :root (index.TL6TuoJb.css) |
| --color-orange | #dc5000 | :root (index.TL6TuoJb.css) |
| --color-brown | #382416 | :root (index.TL6TuoJb.css) |

## Global: --inner-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --inner-width | calc(100vw - var(--site-padding-x) * 2) | :root (index.TL6TuoJb.css) |

## Global: --screen-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --screen-unit | min(var(--inner-width) / (1920 - 60 * 2), calc(var(--vh) * 100) / 1024 * 1.25) | :root (index.TL6TuoJb.css) |

## Global: --link-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --link-header | calc(16 * var(--screen-unit)) | :root (index.TL6TuoJb.css) |

## Global: --clock-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --clock-rotate-direction | 1 | :root (player.css) |

## Theme/scheme-scoped overrides

| variable | value | defined in |
| --- | --- | --- |
| --glow-color | rgba(220, 80, 0, 0) | .btn.is-dark (index.TL6TuoJb.css) |
| --btn-color | var(--color-brown) | .btn.is-dark (index.TL6TuoJb.css) |
| --btn-active-color | var(--color-brown) | .btn.is-dark (index.TL6TuoJb.css) |
| --btn-text-color | var(--color-white) | .btn.is-dark (index.TL6TuoJb.css) |
| --btn-active-text-color | var(--color-white) | .btn.is-dark (index.TL6TuoJb.css) |
| --glow-color | rgba(220, 80, 0, 1) | .btn.is-dark:hover,.btn.is-da… (index.TL6TuoJb.css) |

## Component/other scoped

| variable | value | defined in |
| --- | --- | --- |
| --dashline-color | var(--color-white) | .o-dashline (index.TL6TuoJb.css) |
| --btn-color | var(--color-white) | .btn (index.TL6TuoJb.css) |
| --btn-active-color | var(--color-black) | .btn (index.TL6TuoJb.css) |
| --btn-text-color | var(--color-black) | .btn (index.TL6TuoJb.css) |
| --btn-active-text-color | var(--color-white) | .btn (index.TL6TuoJb.css) |
| --btn-color | var(--color-orange) | .btn.is-orange (index.TL6TuoJb.css) |
| --btn-active-color | var(--color-white) | .btn.is-orange (index.TL6TuoJb.css) |
| --btn-text-color | var(--color-black) | .btn.is-orange (index.TL6TuoJb.css) |
| --btn-active-text-color | var(--color-black) | .btn.is-orange (index.TL6TuoJb.css) |
| --dashline-color | var(--color-black) | #site-header.is-light .o-dash… (index.TL6TuoJb.css) |
| --r | 2.5rem | #video-overlay__inner (index.TL6TuoJb.css) |
| --pulse | 0 | #video-overlay__inner (index.TL6TuoJb.css) |
| --r | 1.5rem | #video-overlay__inner @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --active-ratio | 1 | #hero (index.TL6TuoJb.css) |
| --width | calc(var(--grid-span-width) * 7 + var(--grid-column-width) * .5) | #hero-logo-ref (index.TL6TuoJb.css) |
| --width | calc(var(--grid-span-4) + var(--grid-gap-width) * .4) | #hero-logo-ref @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --r | .75rem | #hero-video-wrapper (index.TL6TuoJb.css) |
| --size | 2em | #ai-instruction-icon (index.TL6TuoJb.css) |
| --small-size | calc(var(--vh) * 80 * .6) | #wearable (index.TL6TuoJb.css) |
| --main-width | calc(var(--vh) * 80 * 85 / 110) | #wearable (index.TL6TuoJb.css) |
| --main-height | calc(var(--vh) * 80) | #wearable (index.TL6TuoJb.css) |
| --px | calc(var(--main-width) / 850) | #wearable (index.TL6TuoJb.css) |
| --thumb-scale | .35 | #wearable (index.TL6TuoJb.css) |
| --thumb-width | calc(var(--thumb-scale) * var(--main-width)) | #wearable (index.TL6TuoJb.css) |
| --thumb-height | calc(var(--thumb-scale) * var(--main-height)) | #wearable (index.TL6TuoJb.css) |
| --thumb-gap | calc(var(--thumb-width) * .08) | #wearable (index.TL6TuoJb.css) |
| --small-size | min(var(--vh) * 80 * .6, 80vw) | #wearable @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --main-width | var(--small-size) | #wearable @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --main-height | calc(var(--small-size) * 110 / 85) | #wearable @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --desc-aspect | 7.311 | #wearable-copy (index.TL6TuoJb.css) |
| --desc-from-width | calc(100vw - var(--site-padding-x) * 2) | #wearable-copy (index.TL6TuoJb.css) |
| --desc-from-width | var(--small-size) | #wearable-copy @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --icon-size | 60px | #features (index.TL6TuoJb.css) |
| --icon-size | 37px | #features @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --slider-height | calc(var(--vh) * 50) | #features-temperature-slider (index.TL6TuoJb.css) |
| --slider-height | calc(var(--vh) * 30) | #features-temperature-slider @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --box-width | calc(var(--vh) * 35) | #grip (index.TL6TuoJb.css) |
| --width | calc(var(--box-width) * 1.2) | #grip-instruction (index.TL6TuoJb.css) |
| --size | 2em | #grip-instruction-icon (index.TL6TuoJb.css) |
| --item-padding | calc(var(--site-padding-x) * .5) | .sustainability-item (index.TL6TuoJb.css) |
| --item-padding | calc(var(--site-padding-x) * 1.25) | .sustainability-item @ @media (max-width: 767.98px) (index.TL6TuoJb.css) |
| --grid-columns | 4 | .sustainability-item:nth-chil… (index.TL6TuoJb.css) |
| --grid-columns | 6 | .sustainability-item:nth-chil… (index.TL6TuoJb.css) |
| --px | calc(var(--vh) * 80 / 1080) | #social-content-items-wrapper (index.TL6TuoJb.css) |
| --block-size | calc(var(--grid-column-width) / 3) | #footer-lusion-logo (index.TL6TuoJb.css) |
| --grid-column-start | 1 | #footer-love (index.TL6TuoJb.css) |
| --grid-column-span | 3 | #footer-love (index.TL6TuoJb.css) |
| --grid-column-start | 5 | #footer-email (index.TL6TuoJb.css) |
| --grid-column-span | 5 | #footer-email (index.TL6TuoJb.css) |
| --grid-column-start | 5 | #footer-contact-wrapper (index.TL6TuoJb.css) |
| --grid-column-span | 4 | #footer-contact-wrapper (index.TL6TuoJb.css) |
| --grid-column-start | 9 | #footer-social-wrapper (index.TL6TuoJb.css) |
| --grid-column-span | 2 | #footer-social-wrapper (index.TL6TuoJb.css) |
| --grid-column-start | 12 | #footer-caption (index.TL6TuoJb.css) |
| --grid-column-span | 5 | #footer-caption (index.TL6TuoJb.css) |
| --connected-color | var(--color-two) | .ChromecastButton_module_chro… (player.css) |
| --menu-width | 16em | .SpeedMenu_module_speedMenuPo… (player.css) |
| --menu-transition-settings | height 200ms ease,max-height 200ms ease | .PopoverMenu_module_menu__9ea… (player.css) |
| --clock-rotate-direction | -1 | .AnimatedClock_module_hands__… (player.css) |

