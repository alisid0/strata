# Repository review — 2026-08-05

Review of `alisid0/strata` (`main` @ `3ff7b37`). Read-only evaluation;
no production behaviour changed by this document.

**Verdict:** Architecture and environment isolation are coherent and well
documented at the top of the handoff stack (`SOURCE-OF-TRUTH`, `AGENTS`,
`ENVIRONMENTS`, `RELEASE-MODEL`). The main risks are **operator-doc drift**
around CSP, **unverified DB security tests**, a **CDN-coupled Mustang Lab**,
and **maintainability** from mega-modules plus a large stale-doc corpus.

---

## What is working well

1. **Clear content authority hierarchy.** Live membership (`paths.js`) →
   Supabase `cards` → bundled fallbacks → Reader media resolution is explicit
   and correctly demoted in agent docs. Agents that follow it will not invent
   catalogues from drafts.
2. **Staging / production separation.** Separate Supabase projects, Vite mode
   guards, manual production deploy, and no service-role keys in `VITE_*`.
3. **Security work already shipped.** HTML sanitiser at Reader/snippet sites,
   Quiz escape-then-format path, enforcing CSP + HSTS + frame deny, RLS
   migrations, account deletion/export.
4. **Targeted automated tests.** Sanitiser adversarial suite, Solve First /
   arcade / expansion / launch-smoke coverage for the engagement loop.
5. **Recent product motion.** Open-book desktop Reader and Mustang Lab show
   active iteration on the learning surface.

---

## Findings

Severity: **P0** = wrong/dangerous ops guidance or live security gap;
**P1** = real risk or high regression cost; **P2** = maintainability / drift.

### P0 — CSP checklist still says report-only; production enforces

`vercel.json` ships `Content-Security-Policy` (enforcing). Engineering note
`docs/engineering/2026-07-30-security-hardening.md` correctly records the flip.

But launch ops docs still claim the opposite:

| Doc | Stale claim |
|---|---|
| `docs/PUBLIC-BETA-CHECKLIST.md` | F-02 “CSP report-only”; open item “flip report-only → enforcing”; critical path “observe, then enforce”; open risk “CSP is report-only” |
| `docs/ACTION-REQUIRED.md` | “F-02 report-only security headers” |
| `docs/engineering/CSP-REPORTING.md` | Assumes report-only header; steps to flip later |

**Comment:** Reconcile the checklist to “CSP enforcing as of 2026-07-30; reporting
still missing.” Leaving the old critical path will make operators think they
have observation runway they do not.

### P0 — CSP reporting endpoint never wired

`api/csp-report.js` is written and self-documents as dormant. `vercel.json`
has no `report-uri` / `report-to`. Violations (Mustang/unpkg, GeoGebra, math
`unsafe-eval` edge cases, future regressions) are invisible in production
telemetry.

**Comment:** Wire reporting after the policy is already enforcing, or you only
learn about breakage from user reports. Prefer path-only logging as the
endpoint already intends (document-uri can reveal board path).

### P1 — Broad `script-src` + `'unsafe-eval'`

Current allowlist includes `'unsafe-eval'`, `cdnjs`, GeoGebra, and `unpkg.com`.
Compensations exist (`sanitizeBoardHtml`, `isSafeMathExpr`), but CDN compromise
or a future `{@html}` without sanitiser remains a meaningful surface.

**Comment:** Prefer bundling Mustang’s Three.js from the app dependency
(`three@0.185`) instead of widening CSP for `unpkg@0.170`. Revisit whether
math evaluation can move off `new Function` over time.

### P1 — RLS / user-data lifecycle tests not confirmed on staging

Checklist marks both DB suites 🟡/⬜ — code and guards exist
(`scripts/test-rls-isolation.mjs`, `scripts/test-user-data-lifecycle.mjs`) but
have not been executed green against staging in the recorded workstream.

**Comment:** Treat “green on staging with service-role in-shell” as a hard gate
before wider beta. Do not infer RLS health from migration presence alone.

### P1 — Mustang Lab is a parallel runtime

`public/labs/mustang/` loads Three from `unpkg.com/three@0.170.0`. No
references under `src/`. App dependency is `three@^0.185.0`. CSP was widened
for the CDN.

**Comment:** Either productise it (Path/Workshop entry, bundled Three, shared
version) or mark it clearly experimental so agents do not treat CDN CSP as a
permanent product requirement.

### P1 — Mega-file hotspots with thin UI coverage

| Lines | File |
|---:|---|
| ~5887 | `src/lib/content/questions.js` |
| ~3662 | `src/lib/content/workshops.js` |
| ~2221 | `src/lib/components/media/ThreeScene.svelte` |
| ~2185 | `src/views/WorkshopLab.svelte` |
| ~1460 | `src/views/Reader.svelte` |
| ~891 | `src/lib/stores/progress.js` |

Reader (open-book + mobile), WorkshopLab (kind switch), and progress sync are
high-change surfaces with little component-level automation.

**Comment:** Split WorkshopLab by journey kind and extract Reader desktop/
mobile shells before the next large UX pass. Add smoke coverage for media
resolution and open-book layout.

### P2 — Inventory comments/docs still say “78 boards”

Live `paths.js` membership is ~429 unique BB numbers (1000–1432 range).
Headers in `paths.js` and `boardMedia.js`, plus `docs/TODO.md`, still describe
the June 2026 78-board ingest / password-gated launch.

**Comment:** Archive or rewrite `docs/TODO.md`. Refresh file headers so media/
content agents do not plan against the old catalogue. `SOURCE-OF-TRUTH.md`
already has the right verification command.

### P2 — Package manager mismatch

`AGENTS.md` / `README.md` prescribe `pnpm`. `.gitignore` states the repo is
`npm` / `package-lock.json` and ignores `pnpm-lock.yaml`. `test:launch` shells
out to `npm run build`.

**Comment:** Pick one. Either commit to npm in agent docs, or adopt pnpm and
stop ignoring its lockfile. Mixed instructions will produce install drift.

### P2 — Dual design systems

Live UI uses `--qx-*` (`qubix-tokens.css`). Quiz/Author/chalk components still
use `--chalk-*` (`tokens.css`). Expected for Quiz per handoff, but easy to
leak chalk styling into new Qubix surfaces.

**Comment:** Keep chalk isolated to Quiz (and Author if intentional). New
views must import qubix tokens only.

### P2 — Residual `{@html}` inconsistency

- Reader / Snippets: sanitised — good.
- Quiz: escape-then-format — good.
- `BitMachineLab.svelte`: `{@html feedback}` for currently hardcoded strings.
- `FormulaBox.svelte`: unsanitised `{@html formula}` and appears unused.

**Comment:** Drop unused `FormulaBox` or force a sanitiser. Prefer text
interpolation in BitMachineLab so the pattern is not copy-pasted for
content-driven feedback later.

### P2 — Static/dynamic boundary via `DECK.length`

`dynamicBoards.js` treats `number <= DECK.length` (84) as the static deck.
Works while numbering stays contiguous from 1, but is a fragile contract if
static cards ever move or gaps appear below 1000.

**Comment:** Prefer an explicit static-id set or `number < 1000` convention
documented next to `paths.js`.

### P2 — Stale planning corpus

Root drafts, `AGENT-MESSAGE-BOARD.md`, `CONTENT-MAP.md`, `GROUND-ZERO.md`, and
many dated handoffs remain discoverable. Top-level agent docs correctly demote
them, but volume still creates process risk.

**Comment:** Move superseded plans under `docs/archive/` with a one-line banner,
or add “non-authoritative” headers. Do not delete history; demote it.

---

## Test / release snapshot

| Surface | State |
|---|---|
| `test:security` | Present; sanitiser suite |
| `test:solve-first` / `arcade` / `expansion` / `launch` | Present |
| RLS + lifecycle | Present scripts; staging green not recorded |
| Media / open-book / Mustang | No automated product smoke found |
| Staging follows `main` | Documented; dedicated staging branch still open |
| Production deploy | Manual; Git push ≠ production |

Catalogue/media coverage numbers were **not** refreshed in this review
(`audit:live-media` not run). Treat `SOURCE-OF-TRUTH.md` 2026-07-21 figures as
a dated baseline only.

---

## Recommended next actions (ordered)

1. Reconcile `PUBLIC-BETA-CHECKLIST.md`, `ACTION-REQUIRED.md`, and
   `CSP-REPORTING.md` with enforcing CSP + missing reporting.
2. Wire `/api/csp-report` into `vercel.json` and watch for a short window.
3. Run RLS + lifecycle tests against staging; record results in the checklist.
4. Bundle Mustang Three (or quarantine the lab) and narrow `unpkg` if unused.
5. Archive/rewrite `docs/TODO.md` and fix “78 boards” headers.
6. Align package-manager docs with the actual lockfile.
7. Split `WorkshopLab.svelte` / extract Reader shells when next touching those
   files.

---

## Out of scope for this review

- Live production smoke against `https://qubix.university`
- Running `audit:live-media` (needs production anon config + network)
- Executing service-role DB tests (needs staging secrets)
- Play Console / Android TWA status beyond what docs already state
