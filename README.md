# Strata — Physics, layer by layer

A swipeable, tap-to-descend microlearning app (physics, with maths and chemistry tracks). Each card is one idea; tapping "dig in" descends through deeper layers of the same idea (concrete picture → definition → the law). Swiping moves across ideas. Styled as hand-drawn chalk on a green board.

It's a **Vite + Svelte SPA** with a Supabase backend for auth and progress (guest/offline use falls back to `localStorage`).

## Run it

```bash
npm install
npm run dev       # vite dev server, http://localhost:8000
npm run build     # production build to dist/
npm run preview   # preview the production build
```

Local development now uses the isolated staging configuration. Copy
`.env.staging.example` to `.env.staging.local` and add the test Supabase URL and
anon key before running `npm run dev`. See [docs/ENVIRONMENTS.md](docs/ENVIRONMENTS.md)
for the production/staging workflow and Vercel setup.

## Structure

```
strata/
├── index.html              # Vite shell (#app + /src/main.js) — no card content here
├── src/
│   ├── main.js
│   ├── App.svelte          # view switch: loading | auth | subjects | subject | path | reader | quiz | author
│   ├── lib/
│   │   ├── content/
│   │   │   ├── deck.js     # the DECK array — all card copy
│   │   │   ├── paths.js    # subject → path → ordered card numbers
│   │   │   ├── questions.js
│   │   │   └── media.js    # per-card video/diagram lookups
│   │   ├── stores/
│   │   │   ├── auth.js     # Supabase auth wrapper
│   │   │   └── progress.js # mastery-state machine (see PATHS.md)
│   │   ├── components/     # ChalkButton, ChalkInput, ChalkDiagram, VideoPlayer, ...
│   │   ├── styles/         # tokens.css (colour vars, fonts), global.css
│   │   └── supabase.js
│   └── views/               # Auth, Subjects, SubjectView, PathView, Reader, Quiz, Author
├── images/                  # chalkboard illustrations, one per card
│   ├── card-01.png          # card N's illustration -> images/card-NN.png
│   └── ...
└── draft/index.html         # legacy reference, largely superseded by deck.js — see CLAUDE.md
```

The card-to-image link is by filename: card number `N` loads `images/card-NN.png` (zero-padded). To change an illustration, replace the PNG; no code change needed.

## How the deck works (the layer model)

Each card is a `C(...)` entry in the `DECK` array in [src/lib/content/deck.js](src/lib/content/deck.js):

```js
C(act, kicker, title, [layer0, layer1, layer2, layer3], img, tags)
```

- **act** — `"I"`, `"II"`, etc. Groups cards into sections.
- **kicker** — e.g. `"Card 07"`. Display label.
- **title** — shown on text layers.
- **layers** — array of HTML strings, one per depth. `null` skips that depth. Depth 0 = the swipe card; deeper = "dig in" levels.
- **img** — optional `"images/card-NN.png"`. When present, **depth 0 shows the image full-bleed** instead of text; deeper layers render their text normally.
- **tags** — `{ subject, topic, concept, ground, buildsOn }` metadata used by the path/subject views.

Navigation (in `Reader.svelte`):
- **Swipe ← / →** (or arrow keys, or on-screen arrows) moves across cards.
- **Tap "dig in" / ↓** descends a layer. **↑** ascends.
- The left-edge dot ladder shows current depth. "Bedrock reached" = no deeper layer.

## Editing content

All copy lives in the `DECK` array in `src/lib/content/deck.js`. Cards are numbered sequentially; if you add or remove one, renumber the `"Card NN"` kickers so they stay continuous (the counter and progress bar derive their total from `DECK.length` automatically, so those need no manual update).

## Progress & mastery tracking

`src/lib/stores/progress.js` tracks board opens and quiz results, persisted to `localStorage` (`strata-progress-v2`), and derives the six mastery states from `PATHS.md`: unwandered → wandered → checked → well_read → recalled → mastered ×1 → mastered ×2. Signed-in users additionally sync through `src/lib/supabase.js` (`progress`/`quiz_results` tables).

## Status

- Svelte/Vite rewrite is the live app (`src/`); the old single-file static deck is retired.
- `draft/index.html` — legacy, not wired into the app. Treat it as raw material to check against `deck.js`, not a publishing target.

## Notes / known constraints

- Handwritten fonts (Kalam, Patrick Hand, Architects Daughter) load from Google Fonts at runtime — needs internet on first load, then cached.
- Images are landscape; cards are portrait-ish. They're set to `contain` (whole image always visible, may letterbox) rather than `cover` (fills, crops). Change `.card-image { background-size }` in `Reader.svelte` to switch.
- Supabase project URL/anon key are selected through environment variables; production
  and staging must use separate projects. See `docs/ENVIRONMENTS.md`.
