# FILE-GUIDE.md — what's where, and where it should go

Last updated: 2026-07-25. Supersedes the 2026-06-23 cleanup map (which was
stale: it predates ~40 new docs, the 55-script `scripts/` folder, the launch
security programme, and the media dirs).

This is two things:
1. **Current map** — where everything lives today, so any engineer or agent can
   navigate the repo.
2. **Proposed target layout + migration plan** — how to tidy it *safely*. The
   moves are proposed, not yet executed: repo reorganisation is item 4 of the
   MSG-001 security programme, which mandates *propose the target layout before
   broad moves*, and there is currently an approved staging line waiting to
   merge plus in-flight auth WIP. Broad moves now would create conflicts and
   obscure review diffs. Execute in the phases below, one branch at a time,
   after the staging line lands.

---

## 1. Current map

### Runtime — the app that actually ships
- `src/` — the Svelte app. `views/` (13 screens), `lib/components/` (49, incl.
  `assessments/` workshops and `media/` renderers), `lib/content/` (18 data
  modules: decks, workshops, paths, questions, tests), `lib/stores/` (9: auth,
  progress, profile, theme…), `lib/styles/`, `assets/`, `content-seo/`.
- `public/` — the static assets Vite serves (icons, images, videos, GIFs,
  manifest, `sw.js`). The real ones. Card images live here, not at the root.
- `api/csp-report.js` — the Vercel serverless CSP report collector (dormant;
  see `docs/engineering/CSP-REPORTING.md`).
- `supabase/` — `migrations/` (0002–0007), schema/seed, storage buckets.
- `index.html`, `package.json`, `vite.config.js`, `svelte.config.js`,
  `vercel.json`, `.gitignore` — project root config, standard, stay put.

### Tooling
- `scripts/` — **55** `.mjs` build/ops scripts: `build-app.mjs`, `deploy.mjs`,
  content ingestion, audits, RLS/lifecycle tests, staging export. This has
  grown into a grab-bag and is the strongest candidate for sub-foldering.

### Content & media source (not shipped as-is)
- `content-drafts/` — **96** items: BB batches in old and current formats,
  awaiting ingestion. Authoring material, never a production inventory
  (`docs/SOURCE-OF-TRUTH.md`).
- `source-material/` — textbooks fed to the pipeline (gitignored PDFs).
- `authoring-tools/` — DeepSeek drafting scripts + the Google Apps Script.
- `1945_BBs/` (7 tracked), `images/` (30), `media/` (29), `manim_anims/` (7) —
  content batches and media/animation source.

### Documentation
- `docs/` — **49 flat `.md`** + `docs/engineering/` + `docs/archive/`. A wide
  mix: launch/ops (`LAUNCH-HANDOVER`, `PUBLIC-BETA-CHECKLIST`, `SOURCE-OF-TRUTH`,
  `ENVIRONMENTS`, `RELEASE-MODEL`, `GIT-OPERATIONS`), content/curriculum specs
  (`CONTENT`, `CURRICULUM`, `PATHS`, `AUTHORING`, `MECHANICS`…), design
  (`DESIGN`, `DESIGN-ANIMATION-BRIEF`), and marketing (`MARKETING-SETUP`).
- **Root markdowns (12)** — mixed provenance, none referenced by `AGENTS.md`,
  `CLAUDE.md`, or `README.md`: `AGENT-MESSAGE-BOARD.md`, `AGENTS.md`,
  `CLAUDE.md`, `README.md` (these four belong at root), plus strays that do not:
  `DEEPSEEK-COLLAB.md`, `DESIGN-UPGRADE.md`, `FOUR-STARTING-POINTS.md`,
  `QUBIX-BLUEPRINT.md`, `FILE-GUIDE.md`, and three `final-draft-*.md`.

### Legacy & local-only
- `legacy/` — dead pre-Svelte prototypes. Nothing in `src/` imports it.
- Not in git (local clutter, correctly ignored): `__pycache__/`, `dist/`,
  `node_modules/`, `audio/`. Also stray at root: `el-screenshot.png`,
  `lockhart_extract.txt`.

---

## 2. Proposed target layout

Keep the four load-bearing root files (`README.md`, `AGENTS.md`, `CLAUDE.md`,
`AGENT-MESSAGE-BOARD.md`) at root. Everything else finds a home:

```
/                       README, AGENTS, CLAUDE, AGENT-MESSAGE-BOARD, config
  src/                  (unchanged — never move runtime source casually)
  public/  api/  supabase/   (unchanged)
  scripts/
    build/              build-app, deploy
    content/            ingestion, staging export, kicker/media migration
    audit/              audit:live-media, GIF eligibility
    test/               RLS isolation, user-data lifecycle, sanitizer
  docs/
    launch/             LAUNCH-HANDOVER, PUBLIC-BETA-CHECKLIST, RELEASE-MODEL,
                        ENVIRONMENTS, GIT-OPERATIONS, SOURCE-OF-TRUTH
    content/            CONTENT, CURRICULUM, PATHS, AUTHORING, BB-TEMPLATE, specs
    design/             DESIGN, DESIGN-ANIMATION-BRIEF, IMAGE-PROMPTS
    marketing/          MARKETING-SETUP
    engineering/        (exists) audits, runbooks, CSP
    archive/            (exists) superseded plans + the root strays + _deepseek_*
  content/              content-drafts/, source-material/, authoring-tools/,
                        1945_BBs/  (consolidate the content-pipeline inputs)
  assets-source/        images/, media/, manim_anims/  (raw media source)
  archive/              legacy/
```

---

## 3. Safe migration plan (execute later, in this order)

**Rule for every phase:** move with `git mv` (preserves history), then
grep the repo for the old path and update every reference, then
`npm run build:staging` before committing. One phase per branch/PR.

- **Phase 0 — zero-risk now:** confirm `__pycache__/`, `dist/`, `audio/` are
  gitignored (they are); delete root strays `el-screenshot.png`,
  `lockhart_extract.txt` if truly unused. No references, no build impact.
- **Phase 1 — docs.** Move the 49 flat docs + the root stray markdowns into the
  `docs/` sub-tree above. **Check first:** `AGENTS.md`, `SOURCE-OF-TRUTH.md`, and
  cross-doc links reference exact `docs/*.md` paths — every move must update
  those links. Coordinate with the in-flight `docs/git-governance-reorg` branch
  so the two don't fight. No code imports docs, so the build is unaffected.
- **Phase 2 — scripts.** Sub-folder `scripts/` into build/content/audit/test.
  **Check first:** `package.json` scripts call these by path (`node
  scripts/build-app.mjs`…); update every `package.json` entry and any
  script-to-script `import`/`require`. Build + run one script per group to
  verify.
- **Phase 3 — content & media source.** Consolidate `content-drafts/`,
  `source-material/`, `authoring-tools/`, `1945_BBs/` under `content/`, and
  `images/`, `media/`, `manim_anims/` under `assets-source/`. **Check first:**
  ingestion/audit scripts and any `boardMedia.js`/media refs that point at these
  paths; `.gitignore` patterns.
- **Never in a casual reorg:** `src/`. Moving runtime source rewrites import
  graphs across ~140 files and is the easiest way to break the build. Only
  restructure `src/` as its own deliberate, separately-reviewed change.

## 4. Why not just do it now

Repo reorg is owned by MSG-001 item 4 (propose-first). There is an approved
staging→main merge pending and uncommitted auth WIP in the tree; a broad move
would conflict with both and bury the security diff reviewers are watching. The
safe sequence is: land the staging line → commit/land the auth WIP → then run
the phases above, one reviewed branch at a time, updating references as you go.
