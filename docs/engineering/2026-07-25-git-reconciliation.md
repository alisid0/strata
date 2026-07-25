# Git and deployment reconciliation report

Date: 2026-07-25

Scope: `alisid0/strata`, local checkout, public staging, public production

Method: remote fetch, branch graph inspection, patch/status inspection, public
browser verification

No production deployment or database mutation was performed.

## Executive conclusion

The repository now has the right three-stage shape:

```text
feature branches → staging → main → manual production deploy
```

The implementation and documentation were not fully aligned:

- `origin/staging` existed and was ahead of `main`, while several authoritative
  documents still said staging followed `main`;
- the Solve First handoff said its branch had not been published, while the
  commit was already on `origin/staging` and live on staging;
- the stable production alias had historically been claimable by two Vercel
  projects/code copies;
- the primary checkout contained unrelated unfinished work and was unsafe for
  a release;
- older feature branches remained without a documented retirement decision.

This reconciliation adds `docs/GIT-OPERATIONS.md`, converts
`docs/ACTION-REQUIRED.md` into a current action sheet, and updates the main
environment/release documents to use the same branch model.

## Evidence collected

### Branch heads

| Ref | Commit | Meaning |
|---|---|---|
| `origin/main` | `2f3238f` | Current production source branch |
| `origin/staging` | `756739f` | Current release candidate |
| `origin/feature/path-subject-scroll` | `6ae6ee7` | Navigation feature |
| `origin/feature/account-deletion` | `21878b6` | Historical security branch |
| `origin/feature/legal-accuracy` | `c1c2cd8` | Historical legal branch |
| `origin/feature/math-rendering` | `83fbfcb` | Historical rendering branch |

At inspection, `origin/staging` was six commits ahead of `origin/main` and
`main` had no commits absent from staging. A fast-forward promotion was
therefore structurally possible at that moment.

### Staging-only release contents

Relative to `main`, staging included:

- the administrative guide and its generator;
- the Solve First content registry;
- five Solve First experience components;
- supporting evidence/visual components;
- discovery progress storage;
- WorkshopLab integration and discovery markers;
- an automated Networks playthrough;
- explicit production-mode deployment;
- protection against the legacy deploy alias collision;
- operational documentation.

### Working tree

The original checkout was on `feature/path-subject-scroll` and contained:

- modified authentication documentation;
- modified `src/App.svelte`;
- modified `src/lib/stores/auth.js`;
- modified `src/views/Auth.svelte`;
- untracked `docs/engineering/SUPABASE-IDENTITY-LINKING.md`;
- untracked `scripts/export-live-physics.mjs`.

These changes were preserved and excluded. The reconciliation was prepared in
an isolated worktree from `origin/staging`.

## Live deployment observations

### Staging

`https://qubix-staging.vercel.app` showed:

- the staging environment badge;
- the full workshop catalogue;
- the “Solve First · New” entry card;
- discovery markers on the relevant workshop tiles;
- a working Crack the Lockers entry screen;
- no observed browser console warnings or errors during the check.

This proves that a deployment containing the Solve First integration is
available on the staging hostname. It does not, by itself, prove the Vercel
project's configured Git branch; that setting must be verified in Vercel.

### Production

`https://strata-nine-pi.vercel.app` also exposed Solve First, but through the
older subject-tab workshop shell rather than the staging catalogue shell.

The repository history explains this discrepancy: Solve First previously
existed in an untracked copy connected to a second Vercel project. The stable
alias could be reassigned by whichever deploy script ran last. The staging
commit `1e05d61` ports the feature into the tracked repository and closes both
the alias-ownership and inferred-build-mode hazards.

Production visibility is therefore not evidence that the tracked `main` branch
contains the Solve First port. Git confirms it does not yet.

## Contradictions resolved

| Document/claim | Previous state | Reconciled state |
|---|---|---|
| `AGENTS.md` | Said staging followed `main` | Uses persistent `staging` branch |
| `docs/ENVIRONMENTS.md` | Described staging branch as future work | Branch exists; Vercel setting must be verified |
| `docs/RELEASE-MODEL.md` | Staging deploy triggered from `main` | Feature → staging → main |
| `docs/LAUNCH-HANDOVER.md` | Repeated branch-creation task | Branch exists; dashboard confirmation remains |
| `docs/ACTION-REQUIRED.md` | Said Solve First was not pushed | Records commit already on `origin/staging` |
| `README.md` | Said pushing `main` updated staging | Points to the staging promotion model |

## Risk register

### High: dual production deployment ownership

Impact: the wrong Vercel project can replace production with older or
misconfigured code.

Control:

- only the tracked repository owns the stable alias;
- deploy script explicitly builds production;
- legacy copy must remain blocked and should be archived after verification.

### High: dirty primary checkout

Impact: unrelated authentication work could accidentally enter a release.

Control:

- use isolated worktrees;
- deploy only from a clean `main` checkout;
- never stage the whole tree without review.

### Medium: stale feature branches

Impact: duplicate work may be mistaken for pending launch work or merged twice.

Control:

- compare branch patches against `staging`;
- document merged/superseded status;
- delete only after verification and rollback window.

The 2026-07-25 `git cherry` audit marked every listed feature commit with `+`,
meaning each branch still has a patch not considered equivalent to a patch on
`origin/staging`. No feature branch was deleted during this reconciliation.

### Medium: Git/deployment/database state conflation

Impact: an operator can believe a feature is live, tested, or safely configured
based on the wrong system.

Control:

- verify Git refs, Vercel deployment, and Supabase state separately;
- record commit SHA and Supabase project ref for every release.

### Medium: discovery progress is not yet a dedicated remote table

Impact: Solve First progress is protected locally and during merge logic but
does not have a first-class remote persistence table.

Control:

- treat current behavior as local-first;
- design and test any schema/RLS addition on staging before production.

## Recommended branch cleanup

Do not delete the existing feature branches solely because their subjects look
finished. First compare their patches:

```bash
git cherry -v origin/staging origin/feature/account-deletion
git cherry -v origin/staging origin/feature/legal-accuracy
git cherry -v origin/staging origin/feature/math-rendering
git cherry -v origin/staging origin/feature/path-subject-scroll
```

For branches whose patch is already present, record “superseded/merged” and
delete local and remote refs after the rollback window. For any branch with a
unique patch, open a focused review rather than merging it wholesale.

## Release recommendation

Do not deploy merely to finish the Git reorganisation.

First:

1. run the Solve First automated test;
2. run both builds;
3. complete phone-width visual QA for all five discovery workshops;
4. verify staging Vercel follows `staging`;
5. review `origin/main..origin/staging`;
6. fast-forward the approved staging commit into `main`;
7. deploy from a clean tracked checkout;
8. verify production Supabase ref and smoke tests;
9. record the release and rollback target.

## Result

The repository policy is now explicit and internally documented. The remaining
state-changing decisions—feature-branch retirement, promotion to `main`, and
production deployment—are intentionally separated from this documentation
reconciliation so they can be reviewed with the correct evidence.
