# Qubix — design audit & punch list

**Date:** 2026-08-04 · **Branch:** `main` (with 5 uncommitted files)
**Method:** static analysis of `src/` — token usage, WCAG contrast ratios, CIE
ΔE colour separation, icon geometry, breakpoints. **No visual pass was run**
(see §0), so anything about spacing *feel* comes from
`docs/reader-current.png` and the CSS, not from live screenshots.

---

## 0. What this audit could not check

Playwright's Chromium download is blocked by the sandbox network allowlist and
no system browser is installed, so no screenshots were captured. The following
remain unverified and should be checked in a browser:

- Real rendered spacing and rhythm on Home, Path, PathView, WorkshopLab, WScore,
  Map, Snippets, Auth, Onboarding.
- Mobile (< 900px) Reader after the palette change.
- Dark theme rendering of every item flagged in §2 below.

To run a visual pass, either connect the Claude in Chrome extension, or run
`pnpm run dev` locally and re-run this audit with a working `_vr.mjs`.

---

## 1. Findings ranked by impact ÷ effort

| # | Issue | Files | Effort |
|---|---|---|---|
| 1 | Brand hue flips between themes: light accent is green, dark is terracotta | `qubix-tokens.css` | S |
| 2 | Light theme: brand accent and success green are near-identical | `qubix-tokens.css` | S |
| 3 | Primary button text fails contrast in both themes | `QxButton.svelte`, tokens | S |
| 4 | The palette pass hardcodes light-theme ink into components | `Home`, `BottomNav`, `Reader` | M |
| 5 | The open-book Reader spread is light-theme only | `Reader.svelte` | M |
| 6 | `--qx-text-faint` is unreadable in light theme and used at 9–13px | 40+ call sites | M |
| 7 | Reader spread: symmetric voids are caused by two CSS lines | `Reader.svelte` | S |
| 8 | Off-token radius in the book frame | `Reader.svelte` | XS |
| 9 | `--qx-text-faint` / `--qx-text-faintest` defined but never referenced directly | tokens | XS |

---

## 2. Detail

### 1 — The brand changes colour when you switch theme · **S**

`src/lib/styles/qubix-tokens.css`

The uncommitted pass retuned the light theme's Clay role from terracotta to
forest green but left the dark theme on terracotta:

| | `--qx-accent` | hue |
|---|---|---|
| Light | `#4A8C5C` | 136° (green) |
| Dark | `#D28A5E` | 23° (terracotta) |

A 113° hue swing. Qubix currently has two different brand colours depending on
theme. `--qx-yellow` inherits the same split.

**Fix:** decide which hue is the brand, then bring the other theme to it. If
forest green is the answer, the dark Clay role wants roughly `#7FBF92` — a
lightened green that clears 4.5:1 on `#141310`. If terracotta is the answer,
revert the light block. This decision gates items 2, 3 and 4, so make it first.

---

### 2 — Light theme: the brand accent and the success colour are the same green · **S**

`src/lib/styles/qubix-tokens.css`

The 5-colour system depends on Clay (brand/action) and Olive (correct/complete)
reading as different things. After the retune they don't:

| Pair | ΔE (light) | ΔE before | ΔE (dark) |
|---|---|---|---|
| `--qx-accent` `#4A8C5C` vs `--qx-green` `#3D9B3D` | **26.0** | 80.3 | 78.7 |
| `--qx-accent-soft` `#E8F5EE` vs `--qx-green-soft` `#E6F5E6` | **4.2** | — | — |
| `--qx-accent-text` `#3A6E48` vs `--qx-green-text` `#2E6E2E` | **15.6** | — | — |

ΔE 4.2 on the soft pair is below the threshold where most people see two
colours side by side. In practice a "primary action" chip and a "completed"
chip are now the same swatch. This matters most in the Reader outline sidebar,
where `.outline-row.current` uses `--qx-accent-soft` and `.outline-row.read`
uses `--qx-green-soft` — current and already-read boards become
indistinguishable at a glance.

**Fix:** if Clay is green, Olive has to move — either to a distinctly deeper
olive (`#6B7F3A`-ish, ΔE ~40 from the accent) or back to a warm hue. Keeping
two greens 26 apart defeats the point of the locked roles.

---

### 3 — The primary button's white label fails contrast · **S**

`src/lib/components/qubix/QxButton.svelte:45`

```css
.primary { background: linear-gradient(180deg, color-mix(in srgb, #fff 12%, var(--qx-accent)), var(--qx-accent)); color: #ffffff; }
```

White on `--qx-accent`:

| Theme | Ratio | Verdict |
|---|---|---|
| Light `#4A8C5C` | 4.04 | AA-large only — button labels are 12–13px, so this fails |
| Dark `#D28A5E` | **2.79** | fails outright |

The dark case is live today, not just in the working tree. Same pattern in
`Reader.svelte:874-875` (`.audio-btn.playing`), `Reader.svelte` `.outline-row.current .outline-num`,
and `Home.svelte` `.focus-cta` — all `color: #fff` on `--qx-accent`.

**Fix:** darken `--qx-accent` until white clears 4.5:1 (light green needs about
`#3F7A4E`), and on dark either use `--qx-text` (the ink) as the label colour on
the lightened accent, or introduce a dedicated `--qx-on-accent` token so this is
decided once instead of at 20 call sites.

---

### 4 — The palette pass hardcodes light-theme ink into components · **M**

`src/views/Home.svelte`, `src/lib/components/qubix/BottomNav.svelte`

The working-tree diff replaces token-driven shadows with literal light-theme
values:

```css
/* BottomNav — was: box-shadow: 0 16px 40px -26px var(--qx-text); */
box-shadow: 0 1px 3px rgba(61,46,31,.06), 0 8px 24px -14px rgba(61,46,31,.10);

/* Home .focus-cta */
box-shadow: 0 2px 8px rgba(74,140,92,.25);   /* the light accent, literally */

/* Home .door:hover */
box-shadow: 0 4px 16px -6px rgba(74,140,92,.18);
```

`rgba(61,46,31,…)` is light `--qx-text`; `rgba(74,140,92,…)` is light
`--qx-accent`. On a `#141310` dark background a 6%-alpha brown shadow is
invisible, so every one of these surfaces loses its elevation in dark mode.
`--qx-shadow-card` and `--qx-shadow-soft` already exist per-theme and were
being used correctly before this pass.

Also in the same diff, `.focus-main` — the single most important CTA on Home —
had its border changed from `color-mix(… var(--qx-text) 80% …)` to
`var(--qx-accent-soft)`, which is `#E8F5EE` on a `#FFFDF9` surface: **ΔE 6.8**,
about half the separation of a normal `--qx-border` (ΔE 14.4). The card that
should read as *the* action now has the faintest edge on the screen.

**Fix:** put the new shadow ramps into the token file as `--qx-shadow-card` /
`--qx-shadow-soft` per theme and have components reference tokens only. Give
`.focus-main` a real border (`--qx-accent` at reduced alpha, or `--qx-border-2`).

---

### 5 — The open-book Reader spread is light-theme only · **M**

`src/views/Reader.svelte:1220-1296`

Every surface of the book skeuomorphism is a literal cream:

```css
.reading-slab {
  background: radial-gradient(130% 120% at 50% 0%, #fdfaf4, #f4ecdd);
  border: 1px solid color-mix(in srgb, var(--qx-border) 86%, #b8a888);
  box-shadow: … 6px 6px 0 -2px #eee6d6, 11px 11px 0 -4px #e6dcc8,
              -6px 6px 0 -2px #eee6d6, -11px 11px 0 -4px #e6dcc8;
}
.reading-slab::after { …color-mix(in srgb, var(--qx-surface-2) 70%, #d6c8b2)… }
.floor-anim.has-media::after { …rgba(90, 66, 38, 0.12) … rgba(90, 66, 38, 0.17)… }
```

Page paper `#f4ecdd` sits at ΔE 6.6 from the light background (correct — a
sheet on a desk) but **ΔE 88.0** from the dark background. In dark mode the
Reader is a bright cream slab on near-black. Because `theme.js` now defaults
new visitors to light, this is easy to miss, but it hits every existing
dark-theme user.

**Fix:** promote the book surfaces to theme-scoped tokens —
`--qx-page`, `--qx-page-edge`, `--qx-page-fold`, `--qx-spine` — with a dark
variant (a warm near-black paper, roughly `#221E18` → `#1A1712`, edges
`#2B261E`). The design brief's §3 hard constraint says design for both themes;
this is the one place it isn't met.

---

### 6 — `--qx-text-faint` is below readable contrast in the light theme · **M**

Light-theme text tokens on `--qx-bg` `#FEF9F3`:

| Token | Ratio | Verdict |
|---|---|---|
| `--qx-text` `#3D2E1F` | 12.47 | AA |
| `--qx-text-2` `#6B5C48` | 6.17 | AA |
| `--qx-text-dim` `#8C7B64` | 3.91 | AA-large only |
| `--qx-text-faint` `#B0A08A` | **2.43** | fail |
| `--qx-text-faintest` `#CBC0AC` | **1.72** | fail |

`--qx-text-faint` is not decorative — it's the colour of real copy, at small
sizes:

- `Path.svelte:114` — 9px
- `Path.svelte:179` — 9px, letterspaced uppercase
- `Path.svelte:165` — 10px
- `Reader.svelte:925` — 10.5px floor count
- `Reader.svelte:901` — 11.5px header subtitle
- `WorkshopLab.svelte:1370` — 9px
- `Home.svelte` `.door-sub` — 11px

9px at 2.43:1 is not readable for most people. The dark theme is fine
throughout (worst case 4.68), so this is purely a light-theme regression — the
old light ramp had `--qx-text-faint` at `#9E947E` (3.5:1), still weak but
noticeably better.

**Fix:** shift the whole ramp one notch darker, so today's `dim` becomes
`faint` and a new darker value takes `dim`:

| Token | Now | Proposed | Ratio |
|---|---|---|---|
| `--qx-text-dim` | `#8C7B64` (3.91) | `#7A6A54` | **4.99** — clears AA |
| `--qx-text-faint` | `#B0A08A` (2.43) | `#8C7B64` | 3.91 — AA-large, ≥14px only |
| `--qx-text-faintest` | `#CBC0AC` (1.72) | `#A2957E` | 2.81 — decorative only |

Then stop using `faint`/`faintest` for anything under 12px: the 9–10px
uppercase labels in `Path.svelte` (lines 114, 165, 179) and
`WorkshopLab.svelte:1370` should move to `--qx-text-dim`.

---

### 7 — The Reader spread's "sparse pages" complaint is two CSS lines · **S**

`src/views/Reader.svelte:1252` and `:1288`

The design brief (§7.1) describes short content floating in a big spread with
dead space at the top of both pages. The cause is explicit in the CSS:

```css
.floor-anim.has-media { align-items: center; }              /* line ~1252 */
.floor-anim.has-media .page-text { justify-content: center; } /* line ~1288 */
```

Both axes centre, so any content shorter than the page produces equal voids
above and below — which is exactly what `reader-current.png` shows. Compounding
it, `.card` carries `padding: clamp(64px, 8vh, 100px)` on top, pushing content
down before the centring even applies.

**Fix (the brief's real ask):** anchor content to an optical top instead of
centring — `align-items: start` with a deliberate top offset (~12–14% of page
height), let the figure size to the page rather than the page to the figure,
and reduce `.card` top padding inside the book context. This is the piece to
prototype as a mockup before touching `Reader.svelte`, per the brief's §10.

Two smaller items from the same screenshot:

- **The depth-rail dots are orphaned** (`Reader.svelte:905`). `.depth-rail` is a
  14px column with a `border-right`, sitting in the left margin — in the book
  layout it reads as a stray divider, not a progress indicator. It wants to move
  into the spine gutter or become a page-corner marker.
- **The model still reads as a UI card.** The only softening applied is
  `box-shadow: 0 8px 22px rgba(24,22,17,0.06)` (line ~1281). The
  "INTERACTIVE MODEL / Reset" header, border and gradient fill are untouched, so
  brief §7.2 is still open. Consider a `book` prop or `:global` override on
  `.line-explorer` / `.explorer` that drops the header chrome to a small italic
  figure caption ("Fig. 1 — an infinite line · Reset").

---

### 8 — Off-token radius in the book frame · **XS**

`src/views/Reader.svelte:1224` — `border-radius: 7px` and `:1240`
`border-bottom-right-radius: 7px`. Tokens are 8 / 14 / 22. Use
`var(--qx-radius-sm)`.

---

### 9 — Two tokens are defined but never referenced · **XS**

`grep var(--qx-faint)` and `var(--qx-faintest)` return **0** hits — only the
`--qx-text-faint` / `--qx-text-faintest` pair is used. There are no
`--qx-faint` / `--qx-faintest` definitions either, so nothing is broken; this is
just a naming near-miss worth being aware of when writing new CSS.

---

## 3. Things that are already in good shape

Worth recording so they don't get re-opened:

- **Icons are unified.** `QxIcon.svelte` renders all 20 icons from one
  `viewBox="0 0 24 24"` with a single `stroke-width="2"`, `stroke-linecap` and
  `stroke-linejoin` set to `round`. Only `Reader.svelte` draws SVG outside it (2
  instances). The 17 different `stroke-width` values across the codebase are all
  inside assessment and media components — content, which `CLAUDE.md` exempts.
  **`docs/TODO.md` item 2 can be closed**, with one caveat: `bookmark` and
  `save` are byte-identical paths, and `like` duplicates `heart`'s path — worth
  deduping.
- **Dark theme text contrast is clean** — every step of the ramp clears AA,
  including `--qx-text-faintest` at 4.68.
- **Typography is consistently tokenised.** `--qx-font` / `--qx-font-display`
  are applied through `:is(h1, h2, .qx-display)`, and no component redefines a
  font family.
- **The mobile Reader is untouched** by the desktop work, as the brief requires.

---

## 4. Suggested order

1. **Decide the brand hue** (item 1). Everything colour-related waits on it.
2. Fix the light text ramp and the Clay/Olive collision (items 2, 6) — same
   file, same sitting.
3. Add `--qx-on-accent` and fix the primary button (item 3).
4. Move the new shadows into tokens; restore `.focus-main`'s border (item 4).
5. Tokenise the book surfaces so dark mode works (item 5).
6. Then, and only then, prototype the spread redesign as a standalone mockup
   (item 7) — it will inherit a settled palette instead of chasing one.
7. Sweep items 8 and 9 whenever `Reader.svelte` is next open.

Items 1–5 are all in or adjacent to `qubix-tokens.css` and could plausibly land
as one reviewed commit that finishes the in-flight palette pass properly.

---

## 5. Open decisions for you

- **Green or terracotta?** The working tree says green for light, the shipped
  dark theme says terracotta. Both are defensible; the app can't have both.
- **`--qx-fs-body` default** (TODO.md item 4) is still `17.5px`. Unresolved, and
  unresolvable by static analysis — it needs living with.
- **Does the book metaphor survive dark mode at all,** or should the desktop
  Reader force the light "paper" world regardless of theme? That is a legitimate
  design choice and would make item 5 a one-line fix instead of a token pass.
