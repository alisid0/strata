# Design handoff — Qubix desktop Reader (open-book spread)

**Version:** 2026-08-04. Supersedes `READER-DESKTOP-DESIGN-BRIEF.md`, which is
kept for history but has stale colour values.

**Self-contained.** Everything a designer needs is in this file except two
images, named in §9. Read it top to bottom; §1 is the decision that gates
everything else.

---

## 1. The decision to make first — what colour is Qubix?

**This is genuinely undecided, and we want your recommendation.** The app
currently has two different brand colours depending on theme, because a
light-theme retune landed without a matching dark-theme pass.

| | `--qx-accent` (the brand / Clay role) | hue |
|---|---|---|
| Light theme (uncommitted working tree) | `#4A8C5C` forest green | 136° |
| Dark theme (live today) | `#D28A5E` terracotta | 23° |

A 113° swing. Pick one and we bring the other theme to it.

**Evidence for the choice:**

The design system locks five UI roles — Ink, Canvas, **Clay** (brand/action),
**Olive** (success/complete), Red (alert). Clay and Olive must read as different
things. Colour separation between them, in CIE ΔE:

| Pair | Terracotta Clay | Green Clay |
|---|---|---|
| `--qx-accent` vs `--qx-green` | **80.3** | **26.0** |
| `--qx-accent-soft` vs `--qx-green-soft` | — | **4.2** |
| `--qx-accent-text` vs `--qx-green-text` | — | **15.6** |

ΔE 4.2 is below the threshold at which most people distinguish two swatches side
by side. With green Clay, a "this is your current board" chip and a "you've read
this" chip are effectively the same colour — which shows up directly in the
Reader sidebar you're designing (`.outline-row.current` uses `--qx-accent-soft`,
`.outline-row.read` uses `--qx-green-soft`).

So: **green Clay is only viable if Olive also moves** — to a deeper olive
(around `#6B7F3A`, ΔE ~40) or to a different hue family entirely. Terracotta
Clay needs no such compensation, and it's what every existing user currently
sees in dark mode.

Also relevant, white-label contrast on the accent (the primary button uses
`color: #ffffff`):

| Accent | White on it | Verdict |
|---|---|---|
| `#4A8C5C` green | 4.04 | AA-large only — our button labels are 12–13px, so this fails |
| `#D28A5E` terracotta | 2.79 | fails outright |

Whichever hue wins, the accent needs darkening for white text (green wants about
`#3F7A4E`), or a dedicated `--qx-on-accent` token so the label colour is decided
once rather than at ~20 call sites.

**Deliver a recommendation with a reason.** Don't design the spread against a
palette you haven't argued for.

---

## 2. What we're designing

The **desktop Reader** at viewport ≥ 900px — the screen a learner reads a lesson
on. It is an **open-book two-page spread**. We're redesigning *how the spread
looks and feels*, not the navigation model.

**Out of scope, do not touch:**
- The mobile Reader (< 900px) — a vertical swipe deck, must stay byte-for-byte
  unchanged. Everything here is gated behind `@media (min-width: 900px)`.
- The navigation model (see §4).
- The interactive models' internal logic (see §5).

---

## 3. The one job

A learner reads one **BB** (a lesson board) made of **2–4 short floors**. Each
floor is one beat: **2–3 sentences of text + usually one interactive model**.
They page through floors, then move to the next BB.

Register: **serious STEM, older students.** Clear and a little warm. Not
primary-school cute.

Layout is already decided by the product owner: **figure / interactive model on
the LEFT page, text on the RIGHT page.** Less text per page, like a textbook.

---

## 4. Content model — fixed vocabulary and mechanics

- Terminology is **BB** (board), **Floor**, **Path**. Never "card" or "level".
- **Horizontal movement changes BB. Vertical movement changes floor.**
- Preserve the **depth rail** (floor progress) and the scoped **board outline**
  sidebar.
- A floor may have **no model at all** (text-only). The design must handle that
  gracefully — no broken empty left page.

---

## 5. Hard constraint — the media rule

Technical visuals (graphs, geometry, number lines, formulae, circuits, bonds,
3D) must be **deterministic SVG / canvas / Three.js / Manim**. **Never** raster
art with labels baked in. This is non-negotiable and comes from `CLAUDE.md`.

So the left "figure" page hosts **real interactive Svelte components**, not
illustrations: `three` · `line-explorer` · `concept-explorer` · `coord-plane` ·
`geogebra` · `math-visual` · `math-motion` · `pixel-math` · `video` (Manim mp4)
· `img` (GIF/photo of a real-world action only).

**Practical consequence:** you control the page frame around the model, but the
model's own chrome is shared with mobile and mostly fixed. `LineExplorer`
renders its own bordered, gradient card:

```
┌─────────────────────────────────┐
│ INTERACTIVE MODEL        [Reset]│   ← .explorer-head
│ An infinite line                │
├─────────────────────────────────┤
│ • Drag either arrowhead…        │   ← .instruction
│  ┌───────────────────────────┐  │
│  │      (square SVG stage)   │  │   ← grows with width
│  └───────────────────────────┘  │
│        [ result chip ]          │
│ ↔ The arrowheads are the…       │   ← .hint
└─────────────────────────────────┘
min-height: 400px · border-radius: 20px
border: 1px solid color-mix(--qx-accent 24%, --qx-border-2)
background: linear-gradient(145deg, …)
box-shadow: 0 16px 42px rgba(24,22,17,.09)
```

Design *with* that, or specify safe overrides. We already relax its
`min-height` in book mode so it fits the page.

---

## 6. Brand system — the tokens

`src/lib/styles/qubix-tokens.css` is the source of truth. Use `--qx-*` tokens
for all UI chrome; **do not invent colours.** Never add a sixth UI hue.

**Content models are exempt** — the interactive models have their own
harmonising palette (that's why the line renders terracotta while UI chrome is
green). Don't recolour them.

**Type:** body = **Mulish** (`--qx-font`); display/headings = **Bricolage
Grotesque** (`--qx-font-display`), applied via `:is(h1, h2, .qx-display)`.
Body is `--qx-fs-body: 17.5px` at `--qx-lh-body: 1.72`.

**Radii:** `--qx-radius-sm/md/lg` = 8 / 14 / 22px, `--qx-radius-pill` = 999px.

**Motion:** `--qx-ease-out: cubic-bezier(.22,1,.36,1)`,
`--qx-duration-fast: 160ms`, `--qx-duration-page: 300ms`.

### Light theme text ramp — needs fixing as part of this work

Contrast on `--qx-bg` `#FEF9F3`:

| Token | Value | Ratio | |
|---|---|---|---|
| `--qx-text` | `#3D2E1F` | 12.47 | AA |
| `--qx-text-2` | `#6B5C48` | 6.17 | AA |
| `--qx-text-dim` | `#8C7B64` | 3.91 | AA-large only |
| `--qx-text-faint` | `#B0A08A` | **2.43** | fail |
| `--qx-text-faintest` | `#CBC0AC` | **1.72** | fail |

`--qx-text-faint` is not decorative — the Reader uses it for the 10.5px floor
count, the 11.5px header subtitle, and the running head. At 2.43:1 that isn't
readable. The dark ramp is fine throughout (worst case 4.68).

Proposed shift, one notch darker across the board — **please sanity-check
against your design rather than adopting blindly**:

| Token | Now | Proposed | Ratio |
|---|---|---|---|
| `--qx-text-dim` | `#8C7B64` | `#7A6A54` | 4.99 |
| `--qx-text-faint` | `#B0A08A` | `#8C7B64` | 3.91 (≥14px only) |
| `--qx-text-faintest` | `#CBC0AC` | `#A2957E` | 2.81 (decorative only) |

---

## 7. Current state — what's wrong

The live desktop Reader works. Four problems, in priority order.

### 7.1 Both pages feel half-empty

Short content (a model + three sentences) floats in a big spread. The top halves
of both pages and the outer margins are dead space. The reference feels *full*;
this feels half-used.

**The cause is explicit in the CSS,** so this is more tractable than it looks:

```css
/* src/views/Reader.svelte */
.floor-anim.has-media { align-items: center; }               /* ~line 1252 */
.floor-anim.has-media .page-text { justify-content: center; } /* ~line 1288 */
.card { padding: clamp(64px, 8vh, 100px) … ; }                /* ~line 1204 */
```

Both axes centre, so any content shorter than the page produces equal voids
above and below — exactly what the screenshot shows. The 64–100px card top
padding pushes content down before the centring even applies.

Direction we'd suggest, not prescribe: anchor content to an **optical top**
rather than centring (`align-items: start` with a deliberate ~12–14% top
offset), let the **figure size to the page** rather than the page to the figure,
and cut the card top padding inside the book context. But the real ask is that
**both pages feel intentional and full even with short content** — solve it
however you think best.

### 7.2 The model reads as a UI card pasted onto paper

Heavy border, gradient fill, drop shadow, an "INTERACTIVE MODEL / Reset" header.
It fights the paper aesthetic. The only softening currently applied is a single
`box-shadow: 0 8px 22px rgba(24,22,17,.06)` override.

It should read as a **printed figure**. Consider a `book` prop or `:global`
override that drops the header chrome down to a small italic figure caption —
something like *"Fig. 1 — an infinite line · Reset"*. Specify exactly which
overrides you need; we'll wire them.

### 7.3 The depth rail is orphaned

```css
.depth-rail {
  flex: 0 0 auto; width: 14px; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 7px;
  padding: 10px 0; border-right: 1px solid var(--qx-border);
}
```

A 14px column with a right border, sitting in the left margin. In the book
layout it reads as a stray divider, not a floor-progress indicator. It wants to
move into the spine gutter, or become a page-corner marker, or something better.

### 7.4 The whole spread is light-theme only

Every surface of the book skeuomorphism is a literal cream:

```css
.reading-slab {
  background: radial-gradient(130% 120% at 50% 0%, #fdfaf4, #f4ecdd);
  border: 1px solid color-mix(in srgb, var(--qx-border) 86%, #b8a888);
  box-shadow: … 6px 6px 0 -2px #eee6d6, 11px 11px 0 -4px #e6dcc8,
              -6px 6px 0 -2px #eee6d6, -11px 11px 0 -4px #e6dcc8;
  border-radius: 7px;   /* also off-token — tokens are 8/14/22 */
}
.reading-slab::after   { …color-mix(in srgb, var(--qx-surface-2) 70%, #d6c8b2)… }
.floor-anim.has-media::after { …rgba(90,66,38,.12) … rgba(90,66,38,.17)… }
```

Page paper `#f4ecdd` sits at ΔE 6.6 from the light background — correct, a sheet
on a desk — but **ΔE 88.0** from the dark background `#141310`. In dark mode the
Reader is a bright cream slab on near-black.

**There are two legitimate answers and we'd like your view:**

- **(a)** Promote the book surfaces to theme-scoped tokens — `--qx-page`,
  `--qx-page-edge`, `--qx-page-fold`, `--qx-spine` — and design a dark paper
  (warm near-black, roughly `#221E18` → `#1A1712`, edges `#2B261E`).
- **(b)** Decide the book metaphor *is* a light world, and have the desktop
  Reader force the paper surfaces regardless of theme. One-line fix, but it
  means a dark-theme user gets a light reading surface.

---

## 8. Constraints checklist — all hard

- Desktop only (≥ 900px). Mobile untouched.
- Interactive WebGL/SVG models **break under heavy 3D page-curl transforms** —
  keep floor turns light (lift / dissolve). No full page curl.
- The design must **host the real components** (§5). A mockup may fake them, but
  must respect their real proportions and the fact that we can't fully restyle
  them.
- Works from 900px up to wide desktops. Text-only floors handled.
- Accessible: visible focus states, honour `prefers-reduced-motion`, and every
  text/background pair clears WCAG AA (see §6 — the current build doesn't).
- Use tokens, never literals. If you need a new surface, propose a **token**,
  not a hex value in a component.

---

## 9. Reference material

**Two images to request from Ali — they carry half the context and can't live
in text:**

1. `reader-current.png` — the live desktop Reader. Lives at `docs/reader-current.png`.
2. **"Learn & Grow" reference** — a warm illustrated open-book textbook:
   edge-to-edge pages, spine, topics sidebar, a bottom tool rail (Listen · Notes
   · page counter · Text size · Share), page-turn arrows, corner peel,
   washi-tape sticky notes. **This file is not in the repo** — Ali needs to
   attach it.

   - **Borrow:** the warmth, the *fullness* of both pages, the bottom tool rail,
     the paper/spine/corner-peel skeuomorphism, the calm hierarchy.
   - **Do NOT borrow:** the handwritten font and primary-school register ("Hi,
     Learner!", 😊), and the painted, label-baked illustration — that violates
     §5 outright.

---

## 10. Deliverable

**An interactive HTML mockup of one spread**, using BB 1078's real content so we
can judge the feel:

- **Board:** BB 1078, "A line", Maths — board 1 of 21 in The Line path.
- **Floor 1 of 3 text:** "What is a line? A stick dragged through wet sand leaves
  a straight groove. In general terms, that groove can be called a line."
- **Floor 2:** "Railway lines, phone lines, and help lines all use the same word
  in different ways. Underneath them is the idea of a path from one place to
  another."
- **Floor 3:** "In mathematics, a line is a straight one-dimensional figure with
  no thickness, extending infinitely in both directions."
- **Model on floor 1:** `line-explorer` — "An infinite line", drag either
  arrowhead to turn the line. Proportions per §5.
- **Sidebar:** 21 boards, first few titled *A line · Infinite · Segment, ray,
  line · The number line · The left side · The spaces between*.

Show the page frame, spine, tool rail, sidebar, and a floor turn. Include a
text-only floor state and a dark-theme state (or your §7.4 argument for why
there isn't one).

**Along with the mockup, give us:**

1. Your §1 recommendation — which hue, and why.
2. The token diff you want applied to `qubix-tokens.css`.
3. Any `:global` overrides you need on the model components (§7.2).

We'll translate the winning look into the `@media (min-width: 900px)` block of
`src/views/Reader.svelte`.

---

## 11. Files worth reading if you have repo access

- `src/views/Reader.svelte` — the `@media (min-width: 900px)` block, from ~line
  1079. Key selectors: `.reading-slab`, `.floor-anim.has-media`, `.page-text`,
  `.board-outline`, `.depth-rail`, `floorIn` / `floorOut`.
- `src/lib/styles/qubix-tokens.css` — the token system, 145 lines.
- `CLAUDE.md` — media rule and Reader contract, authoritative.
- `src/lib/components/media/LineExplorer.svelte` — the model you're designing
  around.
- `docs/DESIGN-AUDIT-2026-08-04.md` — the full audit this brief draws on,
  including issues outside the Reader.
