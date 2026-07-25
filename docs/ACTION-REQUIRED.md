# Current release actions

Last reconciled: 2026-07-25
Authority for Git procedure: `docs/GIT-OPERATIONS.md`

This page is a short action list, not a historical handoff.

## Verified current state

| Item | Status |
|---|---|
| Solve First port committed | Done — `1e05d61` |
| Solve First present on `origin/staging` | Done |
| Staging deployment shows Solve First | Verified 2026-07-25 |
| Networks automated playthrough | Pass |
| Production and staging builds for the port | Reported pass |
| Deploy script explicitly forces production mode | Done on `staging` |
| Duplicate production-alias hazard guarded | Done on `staging` |
| `staging` promoted to `main` | Not done |
| Tracked repository released to production | Not done |

The former instruction to “Publish branch” is obsolete. The commit is already
on GitHub and already part of `origin/staging`.

## Required before promotion

1. Playtest all five Solve First experiences at phone width:
   - Crack the Lockers;
   - Stop the Cart;
   - Find the Signal;
   - Recover the Reading;
   - Save the Broadcast.
2. Check light and dark themes, touch targets, horizontal overflow, back
   navigation, retry, completion, and reward recording.
3. Run:

```bash
pnpm run test:solve-first
pnpm run build:staging
pnpm run build:production
```

4. Confirm staging uses Supabase ref `atmmfkhjsdqqwnhqifxm`.
5. Review the exact `origin/main..origin/staging` diff.
6. Confirm the tracked repository is the only project permitted to own
   `strata-nine-pi.vercel.app`.

## Promotion

Follow `docs/GIT-OPERATIONS.md`. The intended result is a fast-forward from the
tested staging commit to `main`. If a fast-forward is not possible, stop and
reconcile the branch graph rather than creating an unreviewed merge.

Production deployment remains a separate manual action from a clean checkout
of the approved `main` commit.

## Verify after production deployment

- Public URL loads and has no staging badge.
- Public bundle uses Supabase ref `wmetdmfsniqrshuaoodc`.
- Staging continues to use `atmmfkhjsdqqwnhqifxm`.
- Sign-in, guest access, one reading path, one standard workshop, and one Solve
  First workshop work.
- No severe console or network errors appear.
- The release record includes the deployed commit and rollback target.

## Existing local work not included

The primary checkout contains unrelated, unfinished authentication changes and
untracked files. Preserve them. Do not use that dirty checkout for a production
deployment.
