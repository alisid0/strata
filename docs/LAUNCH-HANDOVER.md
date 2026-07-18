# Qubix launch handover

Last updated: 2026-07-18

This is the current technical handover for taking Qubix from staging to an
Android closed beta and then a public release. Read `AGENTS.md` and
`docs/ENVIRONMENTS.md` before changing authentication, Supabase, Vercel, DNS,
or the release process.

## Executive state

- The application is a Vite/Svelte PWA backed by Supabase.
- GitHub `main` is the production source branch.
- The isolated test application is live at `https://qubix-staging.vercel.app`.
- Staging uses the Supabase project `Qubix Staging`, ref
  `atmmfkhjsdqqwnhqifxm`, and must never receive production user data.
- Production deployment remains manual through `pnpm run deploy`.
- `qubix.arcavetech.co.uk` is currently attached to the staging Vercel project.
  Move it to the dedicated production project before making it public.
- The Google Play organisation developer account has been created for Arcave
  Technologies. Play Console developer account ID:
  `6992886775198578677`.
- Ownership of `arcavetech.co.uk` has been verified in Google Search Console
  through a DNS TXT record, and the Play Console website-verification blocker
  has cleared. Do not remove the Search Console verification record from DNS.
- The official Companies House company certificate was ordered and paid for on
  2026-07-18. Confirm the issued document has been downloaded before using the
  original, unedited file for Google organisation/identity verification.
- Google Play currently blocks app creation until the remaining account
  verification tasks are completed.

## Google Play account blockers

Complete these in Play Console before attempting to create the Android app:

1. Download and check the paid Companies House company certificate when it is
   issued.
2. Upload the original, unedited official organisation document requested by
   Google.
3. Wait for Google to approve the organisation and identity verification.
4. Verify the organisation and public developer phone numbers.
5. Clear any remaining account-level issues shown by Play Console.

Google states that document review can take several days. This is the first
external dependency on the release path.

## Required release workflow

The intended flow is:

```text
feature branch -> staging branch -> staging web QA -> Android internal test
-> main -> production deploy
```

One release-process task remains: create a persistent `staging` branch and
configure the `qubix-staging` Vercel project to follow it instead of `main`.
Until that is done, a push to `main` updates staging automatically while the
public production deployment remains manual.

Safe commands:

```bash
pnpm run dev
pnpm run build:staging
pnpm run build:production
```

Treat `pnpm run dev:production` as exceptional because it connects local code
to production services. Never commit environment files, Supabase service-role
keys, Vercel tokens, Android signing material, or other secrets.

## Authentication launch gate

The code already contains:

- email/password sign-up and login;
- Google OAuth entry;
- password recovery handling;
- persistent Supabase sessions;
- environment-specific redirect handling;
- phone authentication hidden by default.

Before public launch:

1. Configure production SMTP/transactional email in Supabase.
2. Configure and verify Google OAuth for production and staging.
3. Set the final Site URL and redirect allowlists in both Supabase projects.
4. Test sign-up, email confirmation, login, logout, password recovery, expired
   links, and Google OAuth end to end on web and Android.
5. Audit Row Level Security for every user-data table.
6. Add an in-app full account deletion flow. The existing
   `delete_my_user_data()` database function removes learning data but does not
   remove the Supabase Auth identity. Full deletion requires a secure
   server-side function using a service-role key after explicit confirmation.
7. Add a user data export or documented data-request route before wide release.

No separate authentication platform is required for the initial launch.
Supabase Auth is the selected service. Qubix login should remain email/password
plus Google; Android distribution does not require phone login.

## Production infrastructure gate

1. Confirm the dedicated production Vercel project and production Supabase
   configuration.
2. Move `qubix.arcavetech.co.uk` from staging to production.
3. Keep staging at `qubix-staging.vercel.app`, protected from indexing.
4. Verify HTTPS, canonical URLs, Supabase callbacks, service-worker behaviour,
   and production analytics configuration.
5. Add production error monitoring and document rollback procedures.
6. Remove any public-site password only after the launch QA gate passes.

## Maths and LaTeX state

Qubix does not currently ship a full LaTeX engine. The active formatter is
`src/lib/content/mathFormat.js`, which handles basic superscripts, subscripts,
vectors, isotope notation, and chemical charges.

It does not provide complete typesetting for fractions, roots, matrices,
integrals, sums, aligned equations, or multi-line derivations. If those appear
in the launch curriculum, integrate KaTeX into the Reader, quizzes, workshops,
and snippets before public release. Use a defined inline/display syntax,
sanitize content, add accessibility text, and test equation overflow on narrow
Android screens. "Matex" is not part of the current stack.

KaTeX is not required to produce the first internal Android build if the beta
content only uses notation supported by the existing formatter.

## Android packaging gate

There is currently no Android, Capacitor, Trusted Web Activity, Bubblewrap, or
Digital Asset Links configuration in this repository.

The quickest launch route for the existing PWA is a Trusted Web Activity:

1. Choose the permanent application ID, for example
   `uk.co.arcavetech.qubix`.
2. Create the Android wrapper and bind it to the final production URL.
3. Publish `/.well-known/assetlinks.json` for the production domain.
4. Enable Google Play App Signing and protect the upload key.
5. Generate a signed Android App Bundle (`.aab`) with a valid version name and
   monotonically increasing version code.
6. Test installation, back navigation, offline/error behaviour, authentication
   callbacks, session persistence, and upgrades on real Android devices.

Use Play Console internal testing first, then closed testing, then production.
Capacitor can be considered later if native push notifications, deeper offline
storage, or other device integrations become necessary.

## Play Store app setup

After account verification unlocks app creation:

1. Create Qubix as an app in Play Console.
2. Complete the store listing, privacy URL, support contact, Data Safety, App
   Access, target audience, content rating, advertising, and policy forms.
3. Give reviewers working test credentials or precise access instructions.
4. Upload the signed `.aab` to internal testing.
5. Resolve Play Console pre-launch report failures before closed testing.
6. Promote a tested build through closed testing before requesting production
   review.

## Legal and trust blockers

- Replace `CONTACT_EMAIL_PLACEHOLDER` in `public/privacy.html` and
  `public/terms.html` with a monitored support address.
- Ensure the privacy policy matches actual Supabase, Vercel, analytics, and
  Google OAuth processing.
- Document account deletion, data retention, and data-request handling.
- Decide the minimum user age and whether the product targets children or
  school-age learners.
- Obtain appropriate review of UK GDPR, children's privacy, copyright, and
  AI-assisted content wording before a wide or paid launch.

## Technical QA gate

The release candidate must pass:

- email sign-up, confirmation, login, recovery, Google login, logout, session
  restoration, and account deletion;
- guest-to-account conversion and cross-device progress synchronisation;
- every launch subject, path, reader flow, workshop, scoring path, retry, and
  completion state;
- light/dark themes, small/large Android screens, touch, Android back, slow
  networks, interrupted writes, offline recovery, images, GIFs, 3D, audio, and
  maths notation;
- production security checks, RLS isolation, no secret exposure, no severe
  console errors, and no broken network requests.

Existing Svelte accessibility warnings and large JavaScript chunk warnings are
non-blocking for internal testing, but remain cleanup work before a broad
release.

## Ordered next actions

1. Download the paid Companies House certificate and submit the original,
   unedited document for Play Console identity verification.
2. Create the permanent `staging` branch and point staging Vercel at it.
3. Configure production SMTP and Google OAuth in Supabase.
4. Implement full account deletion.
5. Replace legal-page contact placeholders.
6. Decide whether launch content requires KaTeX and implement it if needed.
7. Finalise the production Vercel project and move the custom domain.
8. Create the Android Trusted Web Activity and signed `.aab`.
9. Run authentication, progress, workshop, device, and security QA on staging.
10. Upload to Play Console internal testing, fix findings, then begin a closed
    beta.

## Not launch blockers for internal testing

Full audio coverage, an illustration for every lesson, advanced gamification,
leaderboards, push notifications, subscriptions, referrals, teacher tools, an
AI tutor, and large new curriculum branches can wait until after the first
closed beta.
