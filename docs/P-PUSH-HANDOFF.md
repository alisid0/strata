# P-Push Handoff — operating brief for DeepSeek

This is the full playbook for the **P-push loop**: auditing canonical BBs into
publishable drafts, the human marks them **P** (final) or **P3** (batch /
provisional), and you push them live to the green review topics. Claude ran this
through ~40 boards; you're taking over the mechanics. Follow this exactly.

---

## 0. Roles

- **The human (Ali)** is the only one who says **P** / **P3**. Never self-approve.
- **You (DeepSeek)**: pull the next board(s) from the canonical masters, audit them
  to the editorial bar below, present them, and *after* Ali says P/P3, do all the
  saving + ingest + deploy. Present in batches of **3** ("P3 batch") to move fast.

---

## 1. Files & sources

- **Canonical source (read-only input):** `1945_BBs/Physics.md`, `Mathematics.md`,
  `Chemistry.md` — the deduplicated master set (384 / 195 / 45 boards). Each board is
  `### Title` + `*BB NN · subject · topic*` + Idea/Concrete/Definition/In action.
- **Publishable output (you append here):** `1945_BBs/_PUBLISHABLE.md` — approved drafts in approval order.
- **Snippet drafts:** `content-drafts/snippets-*.md`.
- **Scripts:** `scripts/ingest-final-review.mjs`, `scripts/ingest-snippets.mjs`.
- **Paths/topics:** `src/lib/content/paths.js`.
- **Review-status colour code (already built):** `src/views/PathView.svelte`, `src/views/Reader.svelte`.

`.env.local` (gitignored) holds `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Run
every node script with `--env-file=.env.local`. **Never commit the service key.** The
repo is **private**; the live site is **password-gated** (do not remove that).

---

## 2. Editorial bar (non-negotiable — Ali rejects on these)

- **No em-dashes ("—") in prose, anywhere.** Use commas, colons, parentheses, full stops.
  (Minus signs "−" in maths and the `---` section rule are fine.) This is the #1 rejection cause.
- **No AI-ness:** no cute parallelism / antithesis closers, no aphoristic grandiosity, no "literally".
- **Observable/intuitive hook first**, then name *why* the common-sense view is wrong, end plainly.
- **Minimal bold** — only the first use of a named term.
- **Mechanism over assertion**; plain one-sentence definitions.
- **Floors are content-driven, not capped** (4, 5, 6 are all fine). Typical: Idea → Concrete →
  Definition → In action → Bedrock. Compact when it's "circling the same idea."
- **BB vs snippet:** pure wonder/perspective with no definition or mechanism = a **snippet**, not a board.
- Fill gaps with **new bridge/baseline boards** when the canonical jumps a concept (Ali expects this).

---

## 3. Status convention: P vs P3

| Mark | Meaning | Meta line in `_PUBLISHABLE.md` | App colour |
|---|---|---|---|
| **P** | final, locked | `*Subject · Topic* · ✓ publishable` | green `✓ Final` |
| **P3** | batch-reviewed, provisional, needs a later final P | `*Subject · Topic* · ◐ P3 (batch-reviewed, pending final P)` | amber `◐ P3` |

The ingest reads the meta line: `/\bP3\b/` → `reviewStatus:'p3'`, else `'final'`.
Subject is read from the same line (`*Physics`/`*Maths`/`*Chemistry`). Promoting a P3 to
final later = change its meta line to `✓ publishable` and re-ingest.

---

## 4. Board format to append to `_PUBLISHABLE.md`

```
## BB NN — Title            (or "## BB (new) — Title" / "## BB (P3 batch) — Title")
*Maths · Coordinate geometry* · ◐ P3 (batch-reviewed, pending final P)

**Floor 0 — Idea:** ...
**Floor 1 — Concrete:** ...
**Floor 2 — Definition:** ...
**Floor 3 — In action:** ...

---
```

Keep blank lines between floors. End every entry with a `---`.

---

## 5. The push, step by step (after Ali says P / P3)

1. **Append** the approved board(s) to `1945_BBs/_PUBLISHABLE.md` with the right meta line.
2. **Re-ingest the review topic:**
   ```
   node --env-file=.env.local scripts/ingest-final-review.mjs
   ```
   It deletes its own rows (`tags->>source = 'publishable-review'`) and rebuilds them at
   `sort_order 1000+`, **subject-aware** and **status-aware**. It prints the sort_orders
   grouped by subject — copy those.
3. **Wire `paths.js`** with the printed numbers:
   - `PFINAL` (physics) `cards: [...]` = the physics sort_orders.
   - `PFINAL_MATHS` (maths) `cards: [...]` = the maths sort_orders.
   - Chemistry has no review path yet — when chemistry boards appear, add
     `PFINAL_CHEM` the same way and put it in `SUBJECT_PATHS.chemistry`.
4. **Build + commit + push:**
   ```
   npm run build
   git add 1945_BBs/_PUBLISHABLE.md src/lib/content/paths.js scripts/ingest-final-review.mjs
   git commit -m "..."   # end with: Co-Authored-By line if you like
   git push origin main
   ```
5. **Deploy + re-alias the stable URL:**
   ```
   npx vercel --prod --yes
   npx vercel alias set <the-new-deploy-url> strata-nine-pi.vercel.app
   ```
6. **Verify:** confirm the new boards fetch with the right `tags.reviewStatus`/`subject`
   (query Supabase or `fetchBoardsByNumbers`), and that the gate still returns 401 without
   the password.

---

## 6. Snippets (optional, when Ali asks)

Draft `content-drafts/snippets-<topic>-batch.md`:
```
## SNIPPET-SLUG — Title
**buildsOn:** Card N        (N = the live board number it should appear on)
**Kind:** snippet (era|insight|frontier|…)
**Content:**
<one paragraph, dash-free>
```
Ingest: `node --env-file=.env.local scripts/ingest-snippets.mjs content-drafts/<file>.md "Kicker"`
Then record it in `_PUBLISHABLE.md` under the board it builds on. Snippets live in their
own **sort_order lane (784+)**; the Reader shows a ✦ button on board N. No redeploy needed
for a snippet to appear (it's Supabase data), but commit the draft file.

---

## 7. Hard gotchas

- **sort_order lanes never overlap:** snippets `784+` (snippet-max+1), review boards `1000+`.
  The review ingest deletes **by tag**, never by sort_order range — keep it that way or it will
  nuke snippets.
- **Service-role key:** only ever via `--env-file=.env.local`. Never in code, never committed.
- **Vercel password gate** (`middleware.js`, env `BASIC_AUTH_PASSWORD`): leave it on. The site
  is a private review build.
- **Dash check:** grep your appended text for "—" before committing. There should be none.

---

## 8. Current state (handoff point)

- **40 publishable boards** (34 Final + 6 P3) + **11 snippets**.
- **Physics (28 Final, `PFINAL` 1000–1027):** measurement / units / dimensions tier, scale,
  errors, frames & relative motion, **Newton's three laws**, kinematics intro.
  - **Parked (drafted, not P'd):** the friction board ("Friction: pressing, not weight, F = μN").
    Return to it when back in physics.
- **Maths (11 boards, `PFINAL_MATHS` 1028–1038):** coordinate geometry — number line → plane →
  (x,y) → line-as-rule → slanted line → slope → y = mx + c → building from two points →
  parallel / perpendicular / distance. (5 Final, 6 P3.)
- **Chemistry (45 canonical):** untouched. Needs a `PFINAL_CHEM` review path when started.
- **Next maths P3 batch (suggested):** midpoint of two points · shapes from points · proving a
  shape with coordinates.

---

*Ali approves; you push. Keep it dash-free, keep the lanes separate, keep the gate on.*
