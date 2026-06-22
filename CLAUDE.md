# CLAUDE.md — read this first

**Strata** is the internal codename for a swipeable, tap-to-descend physics/maths/chemistry microlearning app (swipe across ideas, tap to descend through layers). It's a **Vite + Svelte SPA** with a Supabase backend for auth and progress.

**Brand**: the public-facing wordmark shown in the UI is **Qubix** (resolved 2026-06-20 — `NOMENCLATURE.md` had flagged the public name as TBD). "Strata" stays the codename used in code/docs/commits; never put "Strata" on a user-facing screen.

**Two coexisting design systems, now asymmetric**: `Quiz.svelte` keeps the chalk-on-greenboard aesthetic and its tokens (`tokens.css`, `--chalk-*`/`--board-*`) — it hasn't been redesigned yet. Everything else — the app shell (Auth, Onboarding, Home, Topics, Topic Detail, Stats, Leaderboard, Snippets) and, as of the "Qubix Board" redesign, `Reader.svelte` itself — runs the Qubix system: Mulish font, indigo/yellow/green/pink palette, light+dark themes, in `qubix-tokens.css` (`--qx-*`). The two never share variable names, so neither leaks into the other. `Quiz.svelte` redesign is a known, separate, not-yet-done item.

## Read these before editing, in order

1. **`README.md`** — what it is, how to run, the layer/card model.
2. **`CONTENT.md`** — the editorial voice, and what was deliberately cut/merged (do not re-add those).
3. **`DESIGN.md`** — the visual system (colour tokens, fonts, chalk-texture rules) and the illustration spec for new images. Still accurate — tokens live in [src/lib/styles/tokens.css](src/lib/styles/tokens.css).
4. **`PATHS.md`** — the curated path map (cards → paths → subjects) and the mastery-tracking system spec (six progression states, three values). Implemented in [src/lib/stores/progress.js](src/lib/stores/progress.js).

## Architecture

- **Entry point**: `index.html` is now just the Vite shell (`<div id="app">` + `/src/main.js`) — it does **not** hold card content anymore. Don't add `DECK` entries there.
- **Content** lives in `src/lib/content/`:
  - `deck.js` — the `DECK` array (the **static** content, cards 1-84, bundled into the build, frozen/locked — not migrated to Supabase). Card shape: `C(act, kicker, title, [layers], img, tags)`. Layer 0 = swipe card (shows image if present); deeper layers = dig-in text; `null` skips a layer; a layer can also be `{text, img?, imgPos?, audio?}` for a per-floor image/narration override.
  - `dynamicBoards.js` — the **dynamic** content path (cards 85+, going forward): `fetchBoardsByNumbers(numbers)` pulls rows from Supabase's `cards` table on demand and caches them to `localStorage`; `getBoard(number)` resolves either source transparently, returning the same shape `deck.js`'s `C()` produces. This is the "pull when the user selects a topic" layer — see PATHS.md/the pipeline note below.
  - `paths.js` — `PATHS` manifest (subject → path → ordered card numbers, static + dynamic mixed freely) and `pathsForCard()`.
  - `questions.js` — quiz question bank.
  - `media.js` — per-card video/diagram lookups (static cards only, untouched by the dynamic pipeline).
- **Views** (`src/views/`): `Auth`, `Onboarding`, `Home`, `Topics`, `PathView` (Topic Detail), `Stats`, `Leaderboard`, `OtherUserStats`, `Snippets`, `Reader` (the swipe/dig deck, Qubix-styled), `Quiz` (still chalk-styled), `Author` (the BB authoring form for outsourced writers). `Home`/`Topics`/`Stats`/`Snippets` are the four bottom-nav tabs; `Reader`/`Quiz`/`Author` are reached from inside a topic, not from the tab bar.
- **State**: `src/lib/stores/auth.js` wraps Supabase auth (email/password, Google OAuth, phone OTP); `src/lib/stores/progress.js` is the mastery-state machine, persisted to `localStorage` (key `strata-progress-v2`) — derive the six states (`unwandered` → `wandered` → `checked` → `well_read` → `recalled` → `mastered_1` → `mastered_2`) from there, not by re-deriving the thresholds inline. `src/lib/stores/theme.js` is the Qubix light/dark store, persisted to `localStorage` (key `qubix-theme`), independent of mastery progress.
- **Backend**: `src/lib/supabase.js` — Supabase project for the `cards`/`progress`/`quiz_results` tables (schema in `supabase/schema.sql`, seed in `supabase/seed.sql`). Its own `fetchCards()` is dead code (queries `cards` wholesale, never called) — `dynamicBoards.js` is the live consumer of that table now, fetching by `sort_order` rather than all-at-once. No leaderboard/social tables exist yet — `Leaderboard.svelte`/`OtherUserStats.svelte`/`Stats.svelte`'s streak and medals are flagged placeholder data (`// TODO: no backend yet`) until that lands.
- **BB content pipeline (cards 85+)**: authored as JSON batches (10 BBs at a time), ingested via `node --env-file=.env.local scripts/ingest-bbs.mjs path/to/batch.json` into the `cards` table — text first, then a second pass once images/audio (via ElevenLabs) exist, re-running the same batch to upsert media onto the same rows (matched by the number in each board's `kicker`). Needs `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (gitignored, never the anon key, never client-side). Storage buckets `card-images`/`card-audio` are created by `supabase/migrations/0002_storage_buckets.sql`. A second, older, manual path to the same `cards` table exists — `strata-sheets-script.js`, a Google Apps Script form-to-Supabase flow — left as-is, not part of the JSON pipeline.
- **Routing**: no router library — `App.svelte` holds a `currentView` string switch (`loading | auth | onboarding | home | topics | topicDetail | stats | leaderboard | otherUserStats | snippets | reader | quiz | author`). The four tab views render inside a shared `BottomNav`; `topicDetail`/`leaderboard`/`otherUserStats` use a back-chevron header instead.

## Hard rules (keep future work in sync with the preset)

- **Card content goes in the `DECK` array in `src/lib/content/deck.js`**, not in any HTML file.
- **For `Quiz.svelte` (the one remaining chalk view)**: use the CSS variables in `src/lib/styles/tokens.css` for every colour. Never hard-code hex outside the tokens. Never introduce a new font there — the three hand fonts are fixed. (This rule is now scoped to `Quiz.svelte` only — see "Two coexisting design systems" above.)
- **Match the editorial voice in `CONTENT.md`**: plain definitions, concrete scenarios, no editorialising/hype, mechanism over assertion, minimal bold, kill em-dash stacking and cute parallelism.
- **New illustrations** follow the prompt + conventions in `DESIGN.md`, landscape, saved as `images/card-NN.png`. The card links to its image purely by filename.
- **Renumber `"Card NN"` kickers** to stay continuous after add/remove. The counter and progress bar derive their total from `DECK.length`, so don't hand-edit those.
- **Don't break the two-axis interaction** (← → across cards, ↓ ↑ through layers) or the depth-ladder behaviour in `Reader.svelte`. `Reader.svelte` takes `numbers`/`startNumber` props (a specific list of card numbers, set by `PathView.svelte` when a topic is opened) rather than rendering the entire static `DECK` — swiping is scoped to whatever's loaded for the current topic, not the whole app.
- **`draft/index.html` and the old root `index.html`-as-deck pattern are legacy.** Most of that content has since been ported into `deck.js` (it now runs to 70+ cards across physics/maths/chemistry). Treat `draft/index.html` as a reference for not-yet-ported material only — verify against `deck.js` before assuming something is missing, rather than re-adding it blind.

## Run

```bash
npm install
npm run dev      # vite dev server, http://localhost:8000
npm run build     # production build to dist/
```

## Current state

- Full Svelte/Vite rewrite is live (`src/`), replacing the static single-file deck. Supabase auth + progress backend wired in, with localStorage fallback for guests/offline.
- Mastery tracking (`PATHS.md`'s six states) is implemented in `progress.js`, not just designed.
- Author flow exists (`Author.svelte`) for outsourced writers submitting new BBs (see `BB-TEMPLATE.md`); submissions currently land in `localStorage`, not yet wired to a Supabase review table.
- Qubix navigation shell (Auth/Onboarding/Home/Topics/Topic Detail/Stats/Leaderboard/Other Users' Stats/Snippets) is live, replacing the old `Subjects`/`SubjectView` flow. Leaderboard ranks and stats medals/streak are placeholder data pending a real backend.
- "Qubix Board" redesign is live: `Reader.svelte` is now Qubix-styled too (minimal depth rail, arrow-only dig/surface controls, ~45/50 media/text split). `Quiz.svelte` is the one remaining chalk-styled view, not yet redesigned.
- The BB content pipeline is live: cards 85+ are authored as JSON, ingested into Supabase's `cards` table via `scripts/ingest-bbs.mjs`, and fetched on demand by `PathView.svelte`/`dynamicBoards.js` when a topic containing them is opened. The audio button in `Reader.svelte` now plays real narration when a floor has one (`layers[d].audio`), and still shows disabled/"coming soon" otherwise — every static BB, and any dynamic BB before its audio phase has run.
