# The site's own CSS custom properties

These are **the site's real design tokens** — prefer them (names and values) over the inferred ones. 5 global (:root/html/body) variable(s), 49 definitions in total.

## Global: --swiper-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --swiper-theme-color | #007aff | :root (main.css) |

## Global: --constellation-*  (3)

| variable | value | defined in |
| --- | --- | --- |
| --constellation-panel-width | 37rem | :root (main.css) |
| --constellation-panel-top-offset | 2.4rem | :root (main.css) |
| --constellation-panel-right-offset | 2.4rem | :root (main.css) |

## Global: --other-*  (1)

| variable | value | defined in |
| --- | --- | --- |
| --vh | 1svh | :root @ @supports (height: 100svh) (main.css) |

## Theme/scheme-scoped overrides

| variable | value | defined in |
| --- | --- | --- |
| --bottom-top-value | 40px | [data-in-viewport=bottom-top] (main.css) |
| --bottom-top-value | 15px | [data-in-viewport=bottom-top] @ @media screen and (max-width: 767px) (main.css) |

## Component/other scoped

| variable | value | defined in |
| --- | --- | --- |
| --swiper-preloader-color | #fff | .swiper-lazy-preloader-white (main.css) |
| --swiper-preloader-color | #000 | .swiper-lazy-preloader-black (main.css) |
| --next-prev-width | 3.8rem | .button--next,.button--prev (main.css) |
| --next-prev-height | 5.6rem | .button--next,.button--prev (main.css) |
| --next-prev-width | .8rem | .button--next,.button--prev @ @media screen and (max-width: 767px) (main.css) |
| --next-prev-height | 1.4rem | .button--next,.button--prev @ @media screen and (max-width: 767px) (main.css) |
| --nav-background-width | calc(var(--nav-window-width, 100vw) * 2) | .nav-background (main.css) |
| --nav-background-height | calc(var(--nav-window-height, 100vh) * 2) | .nav-background (main.css) |
| --nav-background-x | calc(var(--nav-window-width, 100vw) / -2) | .nav-background (main.css) |
| --nav-background-y | calc(var(--nav-window-height, 100vh) / -2) | .nav-background (main.css) |
| --nav-image-scale | 4 | .nav-background (main.css) |
| --nav-image-scale | 5 | .nav-background @ @media screen and (min-width: 2560px) (main.css) |
| --nav-image-scale | 6 | .nav-background @ @media screen and (min-height: 1920px) (main.css) |
| --nav-image-scale | 8 | .nav-background @ @media screen and (min-height: 2160px) (main.css) |
| --nav-image-scale | 10 | .nav-background @ @media screen and (min-height: 3112px) (main.css) |
| --out-scale | 20 | .nav-background__out img (main.css) |
| --discovery-map-pointer-size | 1rem | .discovery-map (main.css) |
| --mul | .85 | .constellation-dialog (main.css) |
| --constellation-dialog-wrapper-padding | 1.6rem | .constellation-dialog (main.css) |
| --constellation-dialog-wrapper-padding | 1.6rem | .constellation-dialog @ @media screen and (max-width: 767px) (main.css) |
| --pointer-label-offset | 0 | .timeline__scroll-pointer-lab… (main.css) |
| --paragraph-size | 45rem | .copy-floating-images (main.css) |
| --paragraph-size | 100% | .copy-floating-images @ @media screen and (max-width: 519px) (main.css) |
| --number-of-columns-desktop | 7 | .copy-floating-images .number… (main.css) |
| --number-of-columns-desktop | 2 | .copy-floating-images .number… @ @media screen and (max-width: 1024px) (main.css) |
| --paragraph-size | 80rem | .copy-floating-images--copy-l… (main.css) |
| --paragraph-size | 52rem | .copy-floating-images--copy-l… @ @media screen and (max-width: 767px) (main.css) |
| --paragraph-size | 100% | .copy-floating-images--copy-l… @ @media screen and (max-width: 519px) (main.css) |
| --number-of-columns-desktop | 3 | .numbers-values (main.css) |
| --number-of-columns-desktop | 2 | .numbers-values @ @media screen and (max-width: 1024px) (main.css) |
| --col-2n-end | 1 | .numbers-values__item:nth-chi… @ @media screen and (max-width: 1024px) (main.css) |
| --space-between-items | 12rem | .non-interactive-timeline (main.css) |
| --dot-base-position | 2rem | .non-interactive-timeline (main.css) |
| --dot-size | .8rem | .non-interactive-timeline (main.css) |
| --space-between-items | 9.6rem | .non-interactive-timeline @ @media screen and (max-width: 767px) (main.css) |
| --dot-base-position | 1rem | .non-interactive-timeline @ @media screen and (max-width: 767px) (main.css) |
| --dot-size | 7px | .non-interactive-timeline @ @media screen and (max-width: 767px) (main.css) |
| --info-columns | 2 | .info-columns__row--two-colum… (main.css) |
| --info-columns | 1 | .info-columns__row--two-colum… @ @media screen and (max-width: 519px) (main.css) |
| --info-columns | 3 | .info-columns__row--three-col… (main.css) |
| --info-columns | 2 | .info-columns__row--three-col… @ @media screen and (max-width: 767px) (main.css) |
| --info-columns | 1 | .info-columns__row--three-col… @ @media screen and (max-width: 519px) (main.css) |

