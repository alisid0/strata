# Your turn — what only you can do

Everything that could be fixed from my side is done and verified. What remains
needs your terminal, your browser, or your judgement.

Work top to bottom. **Step 2 is the one that matters most** — it is the only
outstanding gate on the Networks workshop.

---

## Step 0 · Tidy the pre-existing dirty tree (2 min)

`git status` shows the admin guide as deleted-and-re-added. This is not from my
work — it is OneDrive rehydration from an earlier session. Resolve it before
committing so it doesn't pollute the port commit:

```bash
cd "C:\Users\info\OneDrive\Documents\Strata\strata-github-live"
git status
git add docs/QUBIX-ADMIN-GUIDE.pdf docs/build-admin-guide.py docs/qubix-admin-guide.src.html
git diff --cached --stat        # expect: no real content change, just re-add
```

Also still uncommitted from before: `AGENT-MESSAGE-BOARD.md`,
`docs/PUBLIC-BETA-CHECKLIST.md`, `public/images/card-34-floor0-v1.png`.
Decide whether those belong in this commit or their own.

---

## Step 1 · Build — ✅ **DONE. I ran it.**

I copied the repo to the sandbox's local disk (the OneDrive mount was what
broke Vite before, not Vite itself), installed dependencies and ran both builds.
**Codex's outstanding check 12 is now closed.**

| Result | |
|---|---|
| `build-app.mjs production` | ✅ pass — 961 modules, 9 SEO pages, sitemap 10 URLs |
| `build-app.mjs staging` | ✅ pass |
| New warnings from ported files | **zero** |
| Pre-existing warnings | 17, all in untouched files (`Reader`, `Author`, `TapErase`, `SettingsMenu`, `SubjectMark`, `WScore`) |

Environment separation verified from the emitted bundles:

- production build embeds `wmetdmfsniqrshuaoodc.supabase.co` (production) ✅
- staging build embeds `atmmfkhjsdqqwnhqifxm.supabase.co` (staging) ✅

Shipped-bundle contents confirmed:

- all five Solve First titles present, plus `Route Architect` and the
  `packet-switched` reveal;
- both blocker fixes present (`Launch plan required`, `Reset transfer`);
- the old locked-route selector (`Bound route:`) is **gone**;
- `sanitizeHtml` still present — the port clobbered nothing.

You may still want to re-run `pnpm run build:production` locally once before
deploying, since your machine is the one that will produce the deployed
artefact. It should be a formality.

---

## Step 2 · Playtest Save the Broadcast (10 min)

Run `pnpm run dev`, open a Computer Science → Networks workshop, click
**Solve First**. Codex's checks 10–14 are browser-only:

| # | Check | What you should see |
|---|---|---|
| 10 | Controls ≥ 44×44 px | measure a few in devtools |
| 11 | Reduced motion | enable OS "reduce motion" → phase slide animation gone |
| 12 | 320×800 layout | no horizontal scrollbar |
| 13 | Light + dark themes | all text legible, nothing washed out |
| 14 | Console | no errors or warnings |

Also confirm the two blockers I fixed are genuinely dead:

- **Resilience:** there is now no locked-route selector. Locked mode must strand
  pieces on the failed short route. You should be unable to reach the policy
  choice without both stranding a locked run and rerouting an open one.
- **Clinic:** try booking 2 town / 3 hill — dispatch should be **disabled**,
  with the launch-plan panel explaining why. Then book 3 town / 2 hill and
  confirm a segment strands, Redirect enables, and the reveal is reachable.
  Confirm `Reset transfer` fully restores the start state.

---

## Step 3 · Commit and push (2 min)

```bash
git checkout -b claude/solve-first-port

git add src/lib/content/solveFirst.js \
        src/lib/components/assessments/SolveFirst*.svelte \
        src/lib/components/assessments/NetworkTopology.svelte \
        src/lib/components/assessments/SignalGrid.svelte \
        src/lib/components/assessments/ForceEvidence.svelte \
        src/lib/components/assessments/LimitPlot.svelte \
        src/lib/components/assessments/LogicTruthMini.svelte \
        src/lib/components/assessments/SecurityEvidence.svelte \
        src/lib/stores/progress.js \
        src/views/WorkshopLab.svelte \
        scripts/deploy.mjs \
        docs/SOLVE-FIRST-PORT-HANDOFF.md \
        docs/ACTION-REQUIRED.md

git commit -m "Port Solve First workshops; fix deploy alias and build-mode hazards

Adds the five Solve First experiences and support components to the tracked
repo. Merges the discovery reward contract into progress.js without losing
Supabase sync. WorkshopLab keeps Series II modules and Test mode.

deploy.mjs now builds production explicitly rather than inferring the mode,
which could ship a staging-configured bundle to the production alias."

git push -u origin claude/solve-first-port
```

---

## Step 4 · Ask Codex to review

Point Codex at `docs/CLAUDE-NETWORKS-REWORK-2.md` (the blocker fixes) and
`docs/SOLVE-FIRST-PORT-HANDOFF.md` (the port). Both are on the branch.

---

## Step 5 · Deploy — only after 1, 2 and 4 pass

```bash
git checkout staging && git merge claude/solve-first-port
git status                      # must be clean
pnpm run deploy
```

`deploy.mjs` now builds production explicitly, so it can no longer ship a
staging bundle to the live alias.

**Never run `pnpm run deploy` from the parent `Strata` folder.** It is now
guarded and will refuse the production hostname, but the rule stands.

---

## Step 6 · Verify live (2 min)

Open `https://strata-nine-pi.vercel.app`, then in devtools → Network, check
which Supabase host the app calls:

- **`wmetdmfsniqrshuaoodc`** = production. Correct.
- **`atmmfkhjsdqqwnhqifxm`** = staging. **Stop — real users are on staging
  data.** Rebuild with `build:production` and redeploy.

I could not check the live bundle myself: `api.vercel.com` is blocked from my
sandbox. Two things reduce the worry, but neither replaces a direct look:

- the live site serves pre-rendered SEO pages, and `build-app.mjs` only
  generates those in production mode — so the current deployment was built
  correctly;
- I confirmed from the emitted bundles that a production build embeds the
  production Supabase ref, so the corrected `deploy.mjs` will ship the right one.

---

## One decision I'd like your call on

The parent `Strata` folder is now redundant and dangerous: it has no git, it
holds a second Vercel project, and it is where the split originated. Once this
port is merged and deployed, I'd suggest archiving it (rename to
`Strata-legacy-DO-NOT-DEPLOY`) so no future session edits the untracked copy
again. Say the word and I'll write a short migration note for it.
