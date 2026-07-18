# Qubix agent handoff

This repository is the source of truth for Qubix. Read
`docs/ENVIRONMENTS.md` before changing authentication, Supabase, Vercel, or
the release process.

For the current Google Play, authentication, production, Android packaging,
and public-launch status, read `docs/LAUNCH-HANDOVER.md`. It is the primary
launch checklist and supersedes older launch-status notes where they conflict.

For positioning, beta acquisition, SEO migration, analytics, launch assets,
channels, and the current marketing action order, read
`docs/MARKETING-SETUP.md`.

## Current environment state (2026-07-18)

- Public code branch: `main`.
- Test app: `https://qubix-staging.vercel.app`.
- Test Vercel project: `qubix-staging` in the `qubixprod` team.
- Test Supabase project ref: `atmmfkhjsdqqwnhqifxm` (`Qubix Staging`).
- Staging uses isolated auth and user-data tables. Never copy production users,
  progress, sessions, or other personal data into it.
- Staging contains the complete public production card catalog as of the date
  above: 1,145 production cards plus two staging-only seed cards.
- The staging Vercel project currently follows `main`. A dedicated `staging`
  branch is the next recommended release-process improvement.
- Production deployment is still manual through `pnpm run deploy`; pushing
  Git alone does not run that production deploy script.

Do not commit `.env.staging.local`, Supabase service-role keys, Vercel tokens,
or any other secret. `VITE_*` variables are public client configuration and
must never contain a service-role key.

## Safe working defaults

```bash
pnpm run dev
pnpm run build:staging
pnpm run build:production
```

`pnpm run dev` uses staging. Treat `pnpm run dev:production` as exceptional
because it connects the local app to production services.

Before releasing code:

1. Work on a feature branch.
2. Build and test against staging.
3. Merge the approved code into `main`.
4. Run `pnpm run build:production`.
5. Run `pnpm run deploy` and smoke-test the public URL.

Dynamic Supabase card content is not promoted by Git. Use
`pnpm run content:export-staging-sql` to create idempotent, content-only SQL
chunks from the public production catalog when refreshing staging. Review the
generated files before running them. This tool intentionally does not copy
users or user data and does not write to either database itself.

## Authentication status

The app has an auth gateway, email/password flows, recovery handling,
environment-specific redirects, and test/production isolation. Before public
launch, configure and test production SMTP/email delivery and any enabled OAuth
provider (for example Google) end to end. Phone auth is intentionally disabled.

## Verification notes

The staging app was manually smoke-tested for guest entry, all four subject
paths, board lists, the multi-floor reader, the Function Machine workshop,
daily workouts, signup validation, and the recovery screen. Existing Svelte
accessibility and large-chunk build warnings are non-blocking but remain useful
cleanup work.
