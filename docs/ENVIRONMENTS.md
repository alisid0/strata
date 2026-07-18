# Qubix environments

Qubix uses one codebase with isolated configuration for the public app and the
test app. Test accounts and test writes must never go to the production
Supabase project.

## Environment map

| Environment | Vite mode | Data | Analytics | Service worker | Search indexing | Author tools |
| --- | --- | --- | --- | --- | --- | --- |
| Production | `production` | Production Supabase | On | On | Allowed | Off |
| Staging/test | `staging` | Separate staging Supabase | Off | Off | Blocked | On |
| Local test | `staging` | Separate staging Supabase | Off | Off | Blocked | On |

Staging builds display a yellow environment badge. The build also refuses to
run if its Supabase URL matches the production URL.

## One-time Supabase setup

1. Create a second Supabase project named `qubix-staging` (or similar).
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

Add the following variables to the Vercel **Preview** environment only:

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
production project or a dedicated `qubix-staging` Vercel project. For a dedicated
project, add the staging variables to both its Production and Preview scopes.
Production deployments keep using `.env.production`; Vercel Production variables
can override those committed public values later.

Use a persistent branch such as `staging` for the test app. Protect its Vercel
deployment with Deployment Protection or a password before sharing it. Merge
tested changes into `main` to release them to users.

## Release workflow

1. Build or edit on a feature branch.
2. Preview it against the staging Supabase project.
3. Test authentication, scripts, content and writes with test accounts.
4. Merge the approved change into `main`.
5. Deploy production and run a short smoke test.

Public media assets may still be read from the production Storage CDN. Staging
authentication, profiles, progress and other database writes remain isolated.
