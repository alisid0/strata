# Live production GIF and media audit

- Catalogue: production Path manifest plus current production Supabase rows
- Fetched: 2026-08-01T19:49:53.602Z
- Generated working files: `.audit-cache/` (ignored by Git)
- Coverage: 429 live BBs / 1957 live floors
- Policy: raster GIFs are permitted only for tangible real-world scenes and analogies. Technical diagrams are code-native.

## Current production media gap

| Measure | Covered | Total | Coverage |
|---|---:|---:|---:|
| BBs with any media | 50 | 429 | 11.7% |
| Floors with any media | 60 | 1957 | 3.1% |

The 60 covered floors comprise 0 top-level hero images, 9 authored layer images, and 51 `boardMedia.js` attachments. This measures media the current Reader can actually resolve.

### Media coverage by subject

| Subject | BBs covered | BBs total | Floors covered | Floors total |
|---|---:|---:|---:|---:|
| physics | 10 | 121 | 10 | 512 |
| maths | 8 | 109 | 8 | 517 |
| chemistry | 29 | 99 | 32 | 437 |
| computing | 3 | 100 | 10 | 491 |

## Classification totals

| Classification | Floors |
|---|---:|
| EXISTING_MEDIA | 60 |
| NONE | 643 |
| PHOTO_ARCHIVE | 12 |
| SCENE_GIF | 13 |
| STATIC_SCENE | 29 |
| TECH_ANIMATION | 490 |
| TECH_STATIC | 710 |

## Subject coverage

| Subject | BBs | Floors | Scene-GIF candidates | Technical animation | Technical static |
|---|---:|---:|---:|---:|---:|
| physics | 121 | 512 | 6 | 161 | 193 |
| maths | 109 | 517 | 0 | 120 | 218 |
| chemistry | 99 | 437 | 4 | 138 | 165 |
| computing | 100 | 491 | 3 | 71 | 134 |

## Highest-confidence scene-GIF candidates

These floors passed the automated scan and a conservative scene-only review. They are eligible for storyboard work, not automatic generation. Technical overlays, labels, formulae, and diagrams remain forbidden in raster frames.

| Rank | BB | Floor | Subject | Title | Score | Floor beat |
|---:|---:|---:|---|---|---:|---|
| 1 | 1123 | 2 | chemistry | Counting by weighing | 10 | Think of a jar of pennies. If you know exactly how much one penny weighs, you don't have to count the jar. You just put the whole jar on a scale, do s… |
| 2 | 1208 | 2 | chemistry | Counting by weighing | 10 | Think of a jar of pennies. If the exact weight of one penny is known, the jar does not need to be opened and counted. The entire jar can be placed on … |
| 3 | 1240 | 0 | computing | The one-way valve | 10 | In a plumbing system, if you want water to flow into a tank but prevent it from flowing back out, you install a check valve. The water pressure pushes… |
| 4 | 1023 | 3 | physics | Inertia & Newton's first law | 9 | You feel inertia every day. When a car brakes hard, your body keeps moving forward — that's why seatbelts exist: the car stops, but your inertia doesn… |
| 5 | 1137 | 3 | computing | The AND Pipe | 9 | If the first valve is open but the second is closed, the water still stops. If the second valve is open but the first is closed, the water never reach… |
| 6 | 1285 | 2 | computing | Bottlenecks | 9 | Imagine a wide road that suddenly narrows to one lane. It does not matter how wide the road is before that point. Traffic still slows where the road b… |
| 7 | 1422 | 0 | chemistry | Reaction Rate | 9 | Drop an effervescent tablet into cold water, and the bubbles appear slowly at first around the tablet as gas forms. |
| 8 | 1001 | 0 | physics | Measuring with a stick: length, breadth & area | 8 | How long is your desk? If you lay a stick along the edge and count how many times it fits, you are measuring its length. That is all measuring a lengt… |
| 9 | 1022 | 0 | physics | Matter and mass | 8 | Matter is the physical stuff things are made of, down to their atoms. Mass measures how hard an object is to get moving — and for anything built of ma… |
| 10 | 1023 | 0 | physics | Inertia & Newton's first law | 8 | A car rolls down a long, straight highway at a steady speed. You want it to stop — so what has to happen? It won't simply halt because you wish it to.… |
| 11 | 1023 | 2 | physics | Inertia & Newton's first law | 8 | Take your foot off the pedals without braking, and the car still coasts to a stop. If motion carries on by itself, why does it stop here? Because a qu… |
| 12 | 1121 | 0 | chemistry | The chemist's dozen | 8 | If you want to bake a cake, you need to count your ingredients. You need 2 cups of flour and 3 eggs. |
| 13 | 1178 | 0 | physics | The illusion of friction | 8 | A car coasts down a long, straight highway. If the driver takes their foot off the gas pedal, the car eventually slows down and stops. |

## Scene candidates awaiting manual approval

These matched the tangible-action rules but remain blocked until the floor is checked for hidden technical dependencies.

| BB | Floor | Subject | Title | Score | Floor beat |
|---:|---:|---|---|---:|---|


## Non-negotiable production rule

- **SCENE_GIF / STATIC_SCENE:** raster imagery may depict only visible real-world action or a narrative analogy.
- **SCENE_GIF_REVIEW:** quarantined; do not produce until a human confirms the scene does not carry technical diagram work.
- **REVIEW_STALE:** production floor text changed after approval; block production until the floor is reviewed again.
- **TECH_ANIMATION / TECH_STATIC:** use Manim, SVG, canvas, Three.js, or another deterministic source. Never use generated raster imagery.
- **PHOTO_ARCHIVE:** use traceable real evidence, not generated documentary imagery.
- **NONE:** do not add media merely to fill a slot.
