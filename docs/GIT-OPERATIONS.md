# Qubix internal Git and release operations

Owner: Arcave Technologies

Repository: `alisid0/strata`

Internal codename: Strata

Product name: Qubix

Last reconciled: 2026-07-25

This is the company-internal authority for repository ownership, branch
purpose, change promotion, release evidence, and recovery. If an older handoff
or task note conflicts with this document, this document wins for Git
operations. `docs/SOURCE-OF-TRUTH.md` remains authoritative for live learning
content.

## 1. Repository authority

The tracked Git repository is the only source from which Qubix code may be
released:

```text
C:\Users\ali10\strata
```

The repository remote is:

```text
https://github.com/alisid0/strata.git
```

Any second folder, copied checkout, OneDrive copy, exported archive, or
untracked parent `Strata` directory is reference material only. It must not:

- own the production Vercel alias;
- run the production deploy command;
- be treated as a source of current branch state;
- receive changes that are intended to ship;
- contain the only copy of a feature.

The production deployment script in this repository explicitly builds in
production mode before assigning the stable alias. Do not reproduce that alias
command in another project.

## 2. Authoritative branch model

```text
feature/* or fix/*
        |
        v
     staging  --------> qubix-staging.vercel.app
        |
        | approval + release evidence
        v
      main    --------> manual production deployment
                         strata-nine-pi.vercel.app
```

### `main`

- Production source branch.
- Must contain only changes that passed staging review.
- A push does not, by itself, release production.
- Production is released manually from a clean checkout with
  `pnpm run deploy`.
- Do not commit directly to `main`.
- Do not force-push or rewrite its history.

### `staging`

- Integration and release-candidate branch.
- The dedicated staging Vercel project must follow this branch.
- May be ahead of `main` while a release candidate is being tested.
- Must remain a descendant of `main`; do not rebase or force-push shared
  staging history.
- Merge reviewed feature branches here first.
- Do not use staging as a permanent development branch.

### `feature/*`, `fix/*`, `docs/*`

- One bounded change per branch.
- Start from the latest `origin/staging` unless the work is an urgent
  production hotfix.
- Keep unrelated local changes out of the branch.
- Delete after the change is merged and the rollback window has passed.

### Hotfix branches

For an active production incident:

1. Branch `hotfix/<short-name>` from `origin/main`.
2. Make the smallest safe correction.
3. Build and test both production and staging modes.
4. Merge into `main` and deploy.
5. Immediately merge `main` back into `staging`.

This is the only normal case where work enters `main` before `staging`.

## 3. Current reconciled state

At reconciliation on 2026-07-25:

- `origin/main` is at `2f3238f`.
- `origin/staging` is at `756739f`.
- `origin/staging` is six commits ahead of `origin/main`.
- The Solve First port is committed as `1e05d61` and is already on
  `origin/staging`.
- Staging visibly serves the Solve First entry card and discovery markers.
- Production also exposes Solve First through an older workshop shell. This is
  evidence that a second historical Vercel project/copy has served the stable
  production alias; it is not evidence that `main` contains the port.
- The deploy ownership and build-mode safeguards are on `staging` and have not
  yet reached `main`.

Do not rely on this dated section indefinitely. Re-run the verification
commands below before making a release decision.

## 4. Start-of-work checklist

Run these before editing:

```bash
git fetch --prune origin
git status --short --branch
git branch --all --verbose --no-abbrev
git log --graph --decorate --oneline --all -n 30
```

Then:

1. Confirm the working tree is clean, or identify and preserve every existing
   modification.
2. Read `AGENTS.md`.
3. Read `docs/SOURCE-OF-TRUTH.md` for content/media work.
4. Read `docs/ENVIRONMENTS.md` for auth, Supabase, Vercel, or release work.
5. Create a feature branch or isolated worktree.

Preferred branch start:

```bash
git switch --create feature/<name> origin/staging
```

Preferred isolated worktree:

```bash
git worktree add -b feature/<name> ../strata-<name> origin/staging
```

Worktrees are preferred when the main checkout contains unfinished work.

## 5. Commit standards

Each commit should:

- perform one coherent change;
- explain the user or operational outcome in its subject;
- include tests or verification with the implementation where practical;
- avoid generated build output unless it is intentionally versioned;
- exclude secrets, local environment files, credentials, and signing material;
- avoid mixing documentation cleanup with unrelated product code.

Suggested subjects:

```text
Workshop: add Solve First force discovery
Auth: handle provider mismatch callback
Release: make production build mode explicit
Docs: reconcile Git and deployment ownership
```

Before committing:

```bash
git diff --check
git status --short
git diff --stat
git diff
```

Never use `git add .` without first reviewing the complete status. Prefer
explicit paths.

## 6. Promotion workflow

### Feature to staging

1. Update the feature branch from `origin/staging`.
2. Resolve conflicts on the feature branch.
3. Run relevant tests and both builds when environment-sensitive code changed.
4. Review the diff and security implications.
5. Merge the feature branch into `staging`.
6. Push `staging`.
7. Verify `qubix-staging.vercel.app`.

Minimum staging evidence for code/UI changes:

- staging build passes;
- affected interaction works in a browser;
- no new severe console or network errors;
- phone-width layout is usable;
- staging points to Supabase ref `atmmfkhjsdqqwnhqifxm`;
- production-only analytics and service worker remain disabled.

### Staging to main

Promote only the exact tested staging commit:

```bash
git fetch --prune origin
git switch main
git pull --ff-only origin main
git merge --ff-only origin/staging
```

If fast-forward is impossible, stop and reconcile the graph. Do not create an
unreviewed merge commit merely to make the command succeed.

Then:

```bash
pnpm run build:production
pnpm run build:staging
git status --short
git push origin main
```

Pushing `main` records the approved production source. It still does not
release the public application.

### Production deploy

From a clean checkout of the approved `main` commit:

```bash
git status --short
git rev-parse HEAD
pnpm run deploy
```

Record:

- deployed commit SHA;
- build result;
- Vercel deployment URL;
- stable alias result;
- deployment timestamp;
- smoke-test result;
- rollback deployment.

Verify the public bundle uses production Supabase ref
`wmetdmfsniqrshuaoodc`. If it uses staging ref
`atmmfkhjsdqqwnhqifxm`, stop and roll back immediately.

## 7. Supabase and Git boundaries

Git does not prove the current database state.

- `src/lib/content/paths.js` controls which BB numbers are requested by a
  deployed build.
- Dynamic BB text/floors come from the active Supabase `cards` rows.
- Supabase content edits can become visible without a Git commit.
- Schema, RLS, RPC, auth, Storage, and Edge Function changes require their own
  evidence.

Database changes must follow:

```text
migration file in Git
→ apply to staging Supabase
→ security/lifecycle tests
→ deploy tolerant client code when needed
→ apply to production Supabase
→ verify immediately
```

Never copy production users, identities, sessions, progress, or private data
into staging.

## 8. Vercel ownership

There must be exactly one production owner:

- tracked repository: production owner;
- stable alias: `strata-nine-pi.vercel.app`;
- production deployment: manual;
- staging project: `qubix-staging.vercel.app`, following `staging`.

The legacy/untracked project must not be able to claim the production alias.
Before any deploy, confirm the working directory belongs to the tracked
repository and inspect `git remote -v`.

Do not infer deployment state from Git. Verify the two public URLs directly.

## 9. Branch retirement

Before deleting a feature branch:

```bash
git branch --merged origin/staging
git log origin/staging..origin/feature/<name> --oneline
```

Delete only when the second command is empty and the change has passed the
desired rollback window.

Old branches that duplicate already merged work should be labelled in a branch
audit, then removed in one deliberate cleanup. Do not delete branches while
their purpose is uncertain.

Recommended review for the existing historical branches:

- `feature/account-deletion`
- `feature/legal-accuracy`
- `feature/math-rendering`
- `feature/path-subject-scroll`

Some or all of their changes may already exist on the release line through
different commits. Compare patches, not just commit ancestry, before deleting.

## 10. Recovery

### Bad staging change

Revert the offending commit on `staging`, push, and verify staging:

```bash
git switch staging
git pull --ff-only origin staging
git revert <commit>
git push origin staging
```

### Bad production deployment

Prefer Vercel rollback/re-alias to the last known-good deployment first. Then
revert the Git commit on `main`, merge the correction into `staging`, and
record the incident.

### Accidental secret commit

1. Revoke or rotate the credential immediately.
2. Remove it from the current tree.
3. Assess history cleanup separately.
4. Never assume deleting the file makes the secret safe.

### Diverged `main` and `staging`

Stop releases. Fetch, graph both branches, identify which commits were tested,
and reconstruct a linear promotion path. Never solve divergence with a force
push to shared branches.

## 11. Evidence and internal records

Every production release should have a short record containing:

```text
Release:
Commit:
Staging URL checked:
Production deployment URL:
Production alias:
Supabase ref verified:
Tests/builds:
Smoke tests:
Known warnings:
Rollback target:
Operator:
Timestamp:
```

Task-specific handoffs are historical evidence, not permanent operational
authority. Put durable rules here, current launch gates in
`docs/PUBLIC-BETA-CHECKLIST.md`, and content authority in
`docs/SOURCE-OF-TRUTH.md`.

## 12. Prohibited operations

- No direct commits to `main`.
- No force pushes to `main` or `staging`.
- No production deploy from an untracked or legacy copy.
- No production deploy from a dirty checkout.
- No secret values in Git, chat, logs, or screenshots.
- No production database experiment using staging/test accounts.
- No branch deletion without patch/ancestry verification.
- No claim that code is live based only on a commit or push.
