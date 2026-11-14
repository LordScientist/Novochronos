# Colors

Roles are inferred from frequency/area/saturation; verify against screenshots. If the site defines its own CSS variables (see css-variables.md) those names are the real tokens.

## Inferred roles

| role | value | how it was chosen |
| --- | --- | --- |
| background | #ffffff | computed background of <html>/<body> (falls back to the largest-area background) |
| surface | – | largest-area background that differs from the page background |
| text | – | computed color of <body> (falls back to the most-used text color) |
| text-muted | – | next most-used text color with lower contrast than body text |
| accent | – | most-used saturated color weighted toward buttons/links |
| accent-secondary | – | next saturated color with a clearly different hue |
| border | – | most common border color |

**Contrast (WCAG ratio):** text on background –, muted on background –, accent on background –.

**Neutral ramp (light→dark):** –


## Full palette (merged across 1 page(s))

"uses" = number of elements; "area" = share of summed element area using this color as a background.

_none detected_

## Gradients

_none detected_

