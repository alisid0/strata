# Current state and what's left

Last updated: 2026-07-25, end of the Solve First port session.
Single source of truth for where this work stands. Supersedes earlier versions.

---

## Where things stand

| | Status |
|---|---|
| Solve First port into the tracked repo | ✅ done |
| Networks blockers 1 & 2 | ✅ fixed and verified |
| Production build | ✅ **passes** — I ran it |
| Staging build | ✅ passes |
| Automated playthrough test | ✅ passes, zero console errors |
| Merged to `staging` | ✅ fast-forward, no conflicts |
| **Pushed to GitHub** | ✅ **done — `origin/staging` = `756739f`** |
| Production deployed | 🔴 **not done, and production is currently broken** |

---

## Step 1 · Push ✅ DONE

`origin/staging` is at `756739f`. Verified against the remote tree: all five
workshops, the registry, the topology/support components, the test suite, and
the security work (`sanitizeHtml.js`, `environment.js`, `AccountDataDialog`,
`IssueReportDialog`) are all present, and the Terms page carries the real
contact email.

`qubix-staging` auto-deploys from GitHub, so `qubix.arcavetech.co.uk` should be
picking this up on its own — a free preview of the whole change.

---

## Step 2 · Playtest in a browser (10 min)

The only correctness check I could not run. Everything else is verified.

```bash
pnpm install
pnpm run dev
```

Open a Computer Science → Networks workshop → **Solve First**. Confirm:

- it mounts with no console errors;
- the workshop grid shows the "Solve First · New" card and 🔍 tile markers;
- **clinic:** 2 town / 3 hill leaves Dispatch **disabled** with the launch-plan
  panel; 3 town / 2 hill strands a segment and reaches the reveal;
- **resilience:** no route selector exists, and the policy choice stays locked
  until a locked run strands *and* an open run reroutes;
- readable in light and dark, no sideways scrolling at phone width.

The logic behind all of this is already proven by an automated playthrough
(`pnpm run test:solve-first`). What needs human eyes is pixels and legibility.

---

## Step 3 · Merge and deploy

Only after Steps 1 and 2.

```bash
git checkout staging
git merge claude/solve-first-port
git status                 # must be clean
pnpm run deploy
```

`deploy.mjs` now builds production explicitly, so it can no longer ship a
staging bundle to the live alias.

**Never run `pnpm run deploy` from the parent `Strata` folder.** It is guarded
and will refuse, but the rule stands.

---

## Step 4 · Verify live (2 min)

Open `https://strata-nine-pi.vercel.app`, devtools → Network, check the Supabase
host:

- `wmetdmfsniqrshuaoodc` = production ✅
- `atmmfkhjsdqqwnhqifxm` = staging ❌ stop and rebuild

---

## What I completed this session

- Ported the five Solve First games into the tracked repo (they existed only in
  an untracked working copy — unversioned and undeployable).
- Merged the discovery reward contract into `progress.js` without losing
  Supabase sync; added defensive normalisation so existing saved progress loads
  unchanged.
- Merged `WorkshopLab.svelte`, keeping Series II modules and Test mode.
- Fixed both Networks blockers; proved them with an exhaustive sweep of all 32
  clinic route configurations (0 deadlocks) and an automated playthrough.
- Found and fixed three of my own defects on review: a dropped grid entry point,
  wrong visual language on the Solve First bar, and an unclamped reward.
- **Ran the production and staging builds** — the check that had been open
  since the Networks work began.
- Added `pnpm run test:solve-first`, the first automated test for these games.
- Fixed two release hazards: the duplicate production alias, and `deploy.mjs`
  inferring its build mode (which could have shipped a staging bundle, pointed
  at the staging database, to live users).

---

## Two things worth knowing

**Git was never installed on this PC.** That was discovered late and explains a
lot of earlier friction. The `.git` folder existed only because sandboxed agents
created it through the mounted folder. Installing GitHub Desktop fixed this — you
now have git locally for the first time, which is what makes Steps 2 and 3
possible at all.

**The parent `Strata` folder is redundant and risky.** No git, a second Vercel
project, and it is where the code split originated. Once this merges, rename it
to something like `Strata-legacy-DO-NOT-DEPLOY` so no future session edits the
untracked copy again.

---

## Still uncommitted (yours, deliberately untouched)

- `docs/PUBLIC-BETA-CHECKLIST.md` (modified)
- `public/images/card-34-floor0-v1.png` (untracked)

Neither belonged in a port commit. Decide whether they ride the next one.
