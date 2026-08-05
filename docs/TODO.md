# Qubix — current TODO pointer

This file used to hold a pre-launch scratch list (password gate, 78-board
inventory, `npx vercel --prod`). That copy is archived at
`docs/archive/TODO-pre-launch.md` and is **not** an authority.

## Where to look instead

| Need | Document |
|---|---|
| What is live / how to verify catalogue & media | `docs/SOURCE-OF-TRUTH.md` |
| Closed-beta / launch checklist | `docs/PUBLIC-BETA-CHECKLIST.md` |
| Staging vs production | `docs/ENVIRONMENTS.md` |
| How code and content reach users | `docs/RELEASE-MODEL.md` |
| Agent working rules | `AGENTS.md` |

## Still open (from the reconciled checklist)

Re-read `docs/PUBLIC-BETA-CHECKLIST.md` before acting. As of the 2026-08-05
repo fix pass:

- CSP is **enforcing**; reporting is wired to `/api/csp-report` — watch logs
  after deploy; do not treat the old “report-only → flip” path as current.
- RLS isolation + user-data lifecycle tests still need a green staging run
  with `SUPABASE_SERVICE_ROLE_KEY`.
- Dedicated staging branch / production Vercel project / Android Play path
  remain open infrastructure items.
