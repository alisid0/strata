# Design brief — Qubix desktop Reader (open-book spread)

**For:** a focused design pass (an interactive HTML mockup / Artifact, or a fresh
Claude session). **Give the designer this file plus the two screenshots named in
§6–7** — the images carry half the context and can't live in text.

---

## 1. What we're designing
The **desktop Reader** (viewport ≥ 900px) — the screen a learner reads a lesson
on. It is currently an **open-book two-page spread**. We are redesigning *how
that spread looks and feels*, not the navigation model.

**Out of scope / do not touch:** the mobile Reader (< 900px) is a vertical
swipe deck and must stay byte-for-byte unchanged. Everything below is desktop
only, gated behind `@media (min-width: 900px)`.

## 2. The one job
A learner reads **one BB** (a lesson board) made of **2–4 short floors**. Each
floor is one beat: **2–3 sentences of text + (usually) one interactive model**.
They page through floors, then move to the next BB. Register is **serious STEM,
older students** — clear and a little warm, *not* primary-school cute.

Decided layout (from the product owner): **figure / interactive model on the
LEFT page, text on the RIGHT page**, less text per page, like a textbook.

## 3. Brand system — HARD constraint
**Read `src/lib/styles/qubix-tokens.css`. It is the source of truth. Use the
`--qx-*` tokens for all UI chrome; do not invent colours.**

- **Locked 5-colour system** (never add a 6th UI hue): **Ink** (text/dark),
  **Canvas** (warm cream paper + surfaces), **Clay** (brand accent — buttons,
  links, active state), **Olive** (success), **Red** (alert).
- Light theme today: paper `#FEF9F3`, surface `#FFFDF9`, ink `#3D2E1F`, accent
  `#4A8C5C` (forest green). Design for **both** light and dark (tokens exist for
  each) unless you deliberately commit the "paper" surface to one warm world.
- **Type:** body = **Mulish**; display/headings = **Bricolage Grotesque**
  (`--qx-font-display`). Radii: `--qx-radius-sm/md/lg` = 8/14/22px.
- **Content models are exempt** from the 5-colour rule — the interactive models
  (the line, graphs, 3D scenes) have their own harmonising palette (that's why
  the line renders terracotta while UI chrome is green). Don't recolour them.

## 4. Media rule — HARD constraint
Technical visuals (graphs, geometry, number lines, formulae, circuits, 3D) must
be **deterministic SVG / canvas / Three.js / Manim**. **Never** baked raster art
with labels drawn in. So the left "figure" page hosts **real interactive Svelte
components**, not illustrations:

`three` (Three.js) · `line-explorer` · `concept-explorer` · `coord-plane`
(CoordinatePlane) · `geogebra` · `math-visual` · `math-motion` · `pixel-math`
(narrative pixel scene) · `video` (Manim mp4) · `img` (GIF/photo of a real-world
action only).

Practical consequence for design: **you control the page frame around the model,
but the model's own card chrome is shared with mobile and mostly fixed** — e.g.
`LineExplorer`/`ConceptExplorer` render their own bordered, gradient "INTERACTIVE
MODEL / … / Reset" card with `min-height:400px` and a square SVG that grows with
width. Design *with* that, or specify safe overrides (we already relax their
`min-height` in book mode so they fit the page).

## 5. Content model / Reader contract (from `CLAUDE.md`)
- Terminology: **BB** (board), **Floor**, **Path** — never "card/level".
- Horizontal move = change BB; vertical move = change floor. Preserve the
  **depth rail** (floor progress) and the scoped **board outline** sidebar.
- Media resolves per floor; a floor may have **no** model (text-only) — the
  design must handle that gracefully (don't leave a broken empty page).

## 6. The reference we're aiming at — `reference-learn-and-grow.png`
A warm illustrated **open-book textbook** ("Learn & Grow"): full edge-to-edge
pages, spine, a **topics sidebar**, a **bottom tool rail** (Listen · Notes ·
page counter · Text size · Share), page-turn arrows, a **corner peel**, washi-
tape sticky notes.
- **Borrow:** the warmth, the *fullness* of both pages, the bottom tool rail,
  the paper/spine/corner-peel skeuomorphism, the calm hierarchy.
- **Do NOT borrow:** the handwritten font + primary-school register ("Hi,
  Learner!", 😊), and the **painted, label-baked illustration** (violates §4).

## 7. Current state + what's wrong — `reader-current.png`
The live desktop Reader (qubix.university → any Maths lesson). It works, but:
1. **Pages feel sparse / empty.** Short content (a model + 3 sentences) floats in
   a big spread; the top halves of both pages and the outer margins are dead
   space. The reference feels *full*; this feels half-used.
2. **The model reads as a UI card pasted on paper** — heavy border, gradient
   fill, drop shadow, an "INTERACTIVE MODEL / Reset" header — not a *printed*
   figure. It fights the paper aesthetic.
3. Vertical rhythm is unresolved (content centred → symmetric voids); the
   depth-rail dots float orphaned in the gutter; the running head is thin.
4. Overall: correct but not *crafted*. It should feel like a beautiful textbook
   spread you want to keep reading.

## 8. Constraints checklist (all HARD)
- Desktop-only (≥900px); mobile untouched.
- Interactive WebGL/SVG models **break under heavy 3D page-curl transforms** —
  keep floor turns light (lift/dissolve), no full curl.
- The design must **host the real components** (§4) — a mockup may fake them,
  but must respect their real proportions and the fact we can't fully restyle
  them.
- Works from 900px up to wide desktops; text-only floors handled.
- Accessible: visible focus states, honour `prefers-reduced-motion`.

## 9. Success criteria
Feels like a **crafted textbook/storybook spread**, on-brand (5-colour, Mulish +
Bricolage), where **both pages feel intentional and full** even with short
content, the **figure reads as printed on the page**, and the whole thing is
calm, warm, and grown-up. Give the type real hierarchy; make the tool rail and
navigation feel considered.

## 10. Deliverable
Preferred: **an interactive HTML mockup** of one spread using BB 1078's real
content (the "A line" lesson — floor 1 text "What is a line? A stick dragged
through wet sand…" + the line model), showing the page frame, spine, tool rail,
sidebar, and a page-turn — so we can judge the *feel*. Then translate the
winning look into the desktop block of `src/views/Reader.svelte`.

## 11. Files to read
- `src/views/Reader.svelte` — the `@media (min-width: 900px)` block is the
  current desktop/book implementation (`.reading-slab`, `.floor-anim.has-media`,
  `.page-text`, `floorIn/floorOut`).
- `src/lib/styles/qubix-tokens.css` — the token system (source of truth).
- `CLAUDE.md` — media rule + Reader contract (authoritative).
- `src/lib/components/media/*` — the real models (LineExplorer, ConceptExplorer,
  CoordinatePlane, ThreeScene, PixelMathScene, …) and their chrome.
- `src/lib/content/boardMedia.js` — which floor gets which model.
