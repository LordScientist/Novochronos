# Technology stack

Detected from three independent signals: live globals/DOM markers, script/asset URLs, and text inside JS bundles (catches libraries that are bundled and not exposed on window). Treat absence as "not found", not "not used".

| category | technology | evidence |
| --- | --- | --- |
| 3d | Three.js | bundle text: hoisted.CRsATKbF.js · bundle text: player.module.js |
| 3d | Three.js postprocessing (EffectComposer/passes) | bundle text: hoisted.CRsATKbF.js |
| animation | GSAP | bundle text: hoisted.CRsATKbF.js |
| animation | Rive | url: https://unpkg.com/@rive-app/canvas@2.37.0/rive.wasm · url: https://oryzo.ai/rive/oryzo.riv · bundle text: hoisted.CRsATKbF.js |
| fonts | Adobe Fonts (Typekit) | url: https://use.typekit.net/pmn6ngx.css · url: https://use.typekit.net/af/daa5d6/0000000000000000775abe8b/31/l?… |
| framework | Astro | url: https://oryzo.ai/_astro/index.TL6TuoJb.css · url: https://oryzo.ai/_astro/hoisted.CRsATKbF.js · url: https://oryzo.ai/_astro/SplatsWorker-DSMxtdkh.js · url: https://oryzo.ai/_astro/splat_sorter_bg-BfJrILzx.wasm |

## Network summary

| category | requests | size |
| --- | --- | --- |
| image | 99 | 7.2 MB |
| api | 30 | 6.9 MB |
| media | 2 | 6.2 MB |
| script | 7 | 1.4 MB |
| font | 3 | 340 KB |
| css | 4 | 92 KB |
| rive | 1 | 58 KB |
| api-json | 3 | 0 KB |
| document | 2 | ? |

## Fonts requested

| file | size |
| --- | --- |
| https://oryzo.ai/fonts/DM-Mono-400-Latin.woff2 | 14 KB |
| https://oryzo.ai/fonts/Literata.woff2 | 108 KB |
| https://use.typekit.net/af/daa5d6/0000000000000000775abe8b/31/l?primer=388f68b35a7cbf1ee3543172445c23e26935269fadd3b392a13ac7b2903677eb&fvd=n4&v=3 | 218 KB |

## 3D / Lottie / Rive / video assets

| url | category | size |
| --- | --- | --- |
| https://oryzo.ai/rive/oryzo.riv | rive | 58 KB |
| https://oryzo.ai/images/wearable-gallery/yoga.mp4 | media | 3.7 MB |
| https://oryzo.ai/images/wearable-gallery/bite.mp4 | media | 2.4 MB |

## Stylesheets and top scripts

| url | category | size |
| --- | --- | --- |
| https://oryzo.ai/_astro/index.TL6TuoJb.css | css | 68 KB |
| https://use.typekit.net/pmn6ngx.css | css | 1 KB |
| https://p.typekit.net/p.css?s=1&k=pmn6ngx&ht=tk&f=52149.52151&a=83030954&app=typekit&e=css | css | 0 KB |
| https://f.vimeocdn.com/p/4.46.150/css/player.css | css | 24 KB |
| https://static.cloudflareinsights.com/beacon.min.js | script | 31 KB |
| https://oryzo.ai/_astro/hoisted.CRsATKbF.js | script | 1.0 MB |
| https://player.vimeo.com/cdn-cgi/challenge-platform/scripts/precursor/main.js?ray=a5a6149d2c68287f | script | ? |
| https://player.vimeo.com/cdn-cgi/challenge-platform/h/b/scripts/precursor/f8df4d4a0cd6/main.js?ray=a5a6149d2c68287f | script | 58 KB |
| https://f.vimeocdn.com/p/4.46.150/js/vendor.module.js | script | 92 KB |
| https://f.vimeocdn.com/p/4.46.150/js/player.module.js | script | 225 KB |
| https://oryzo.ai/_astro/SplatsWorker-DSMxtdkh.js | script | 3 KB |

