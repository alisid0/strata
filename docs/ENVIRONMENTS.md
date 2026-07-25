# Qubix environments

For live BB membership, floor text, and media authority, read
`docs/SOURCE-OF-TRUTH.md` first. Environment configuration does not make a
draft catalogue authoritative.

For branch ownership, promotion, deployment, and recovery, follow
`docs/GIT-OPERATIONS.md`.

Qubix uses one codebase with isolated configuration for the public app and the
test app. Test accounts and test writes must never go to the production
Supabase project.

## Environment map

| Environment | Vite mode | Data | Analytics | Service worker | Search indexing | Author tools |
| --- | --- | --- | --- | --- | --- | --- |
| Production | `production` | Production Supabase | On | On | Allowed | Off |
| Staging/test | `staging` | Separate staging Supabase | Off | Off | Blocked | On |
| Local test | `staging` | Separate staging Supabase | Off | Off | Blocked | On |

Current public URLs:

- Production: `https://strata-nine-pi.vercel.app`
- Staging: `https://qubix-staging.vercel.app`

Current Supabase projects:

- Production: `Qubix Production` (`wmetdmfsniqrshuaoodc`), London (`eu-west-2`)
- Staging: `Qubix Staging` (`atmmfkhjsdqqwnhqifxm`)
- Retired legacy production ref: `xzesbcrlnbesmvxmgotp`; do not use it in
  application configuration, migrations, media URLs, or tests.

Staging builds display a yellow environment badge. The build also refuses to
run if its Supabase URL matches the production URL.

## One-time Supabase setup

1. Use the two projects listed above; do not create another environment unless
   the environment map and this document are updated in the same change.
2. Run `supabase/schema.sql` in its SQL editor, followed by the files in
   `supabase/migrations/` in numeric order. Use `supabase/seed.sql` only for
   disposable sample data.
3. In Authentication > URL Configuration, add the staging Vercel URL and
   `http://localhost:8000` as allowed redirect URLs.
4. Keep staging email/SMS providers in test mode. Do not import real users.
5. Copy `.env.staging.example` to `.env.staging.local` and replace the
   placeholder URL and anon key with the staging project's public API values.

`.env.staging.local` is ignored by Git and must not be committed. Never put a
Supabase `service_role` key in a `VITE_*` variable because client-side Vite
variables are public.

## Local commands

```bash
pnpm run dev                 # staging/test configuration
pnpm run build:staging       # staging build, no production SEO pages
pnpm run build:production    # production build + SEO pages
pnpm run dev:production      # explicit production connection; use carefully
```

## Vercel setup

For a dedicated staging project, add the following variables to both its
Vercel **Production** and **Preview** scopes:

```text
VITE_APP_ENV=staging
VITE_PUBLIC_SITE_URL=<the persistent staging URL>
VITE_SUPABASE_URL=<staging Supabase project URL>
VITE_SUPABASE_ANON_KEY=<staging public anon key>
VITE_ENABLE_TEST_TOOLS=true
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_SERVICE_WORKER=false
VITE_ENABLE_PHONE_AUTH=false
```

The build script detects `VERCEL_ENV=preview` or `VITE_APP_ENV=staging` and
automatically makes a staging build. This supports either branch previews in the
production project or the current dedicated `qubix-staging` Vercel project.
Production deployments keep using `.env.production`; Vercel Production variables
can override those committed public values later.

The persistent GitHub `staging` branch exists and is the staging release line.
The `qubix-staging` Vercel project must follow that branch. Protect the
deployment with Deployment Protection or a password before sharing it.

The branch is verified in Git; the Vercel branch setting must still be checked
directly whenever release automation or project ownership is audited.
Production remains manual through `pnpm run deploy` from the tracked repository.

## Release workflow

1. Build or edit on a feature branch.
2. Preview it against the staging Supabase project.
3. Test authentication, scripts, content and writes with test accounts.
4. Merge the approved change into `staging` and verify the staging deployment.
5. Fast-forward the tested staging commit into `main`.
6. Deploy production from a clean checkout and run a short smoke test.

Runtime media is bundled under `public/`; no app media may depend on the retired
legacy Supabase project. Staging authentication, profiles, progress and other
database writes remain isolated.

## Production backend baseline (2026-07-21)

The clean production project has schema/RLS migrations through
`0005_launch_hardening.sql` plus `0007_explicit_api_grants.sql`. Migration 0006
was an incremental repair for databases that had the earlier 0005 and is not
part of a fresh bootstrap. The `delete-account` Edge Function is deployed and
validates the bearer token itself before using server-only privileges.

The production `cards` table contains 1,145 reviewed public rows. Only public
catalogue content was migrated from the retired project; users, identities,
progress, sessions, reports, and screenshots were deliberately not copied.
Production Authentication has Site URL and redirect allowlisting set to
`https://strata-nine-pi.vercel.app`. Production SMTP is configured and email
delivery is confirmed; Google OAuth is configured and sign-in tested end to end.
Obsolete credentials from the setup were revoked. (Verified 2026-07-22.)

## Refreshing public content in staging

Git does not promote dynamic rows stored in Supabase. To produce idempotent SQL
chunks containing public card content only, run:

```bash
pnpm run content:export-staging-sql
```

The command reads the public production catalog and writes reviewed SQL chunks
under the ignored `.playwright-session/staging-content-sync/` directory. It does
not write to either database and never exports users, progress, sessions, or
other personal data. Review the chunks, apply them to the staging SQL editor,
run `chunk-final.sql`, and verify the resulting count before testing the app.
