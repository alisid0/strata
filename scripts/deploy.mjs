#!/usr/bin/env node
// One-command production deploy: build -> vercel --prod -> alias to the stable
// production URL. Run with:  pnpm run deploy
//
// WHY: this project has no git-push auto-deploy. Committing/pushing puts code on
// GitHub but does NOTHING to Vercel until someone runs the deploy + alias by
// hand. That gap keeps stranding changes as "committed but not live". This
// chains all three steps so a deploy is a single command.
//
// THIS REPO OWNS PRODUCTION. `strata-nine-pi.vercel.app` is served from here.
// The legacy untracked `Strata` folder is a different Vercel project and is
// blocked from taking this alias — see ../scripts/deploy.mjs there.
import { execSync } from 'node:child_process';

const ALIAS = 'strata-nine-pi.vercel.app';

// Build production EXPLICITLY. `npm run build` with no argument infers the mode
// from the local environment, so on a machine configured for staging it would
// produce a staging build — pointed at the staging Supabase — and this script
// would then alias it to production. Passing the mode removes that trapdoor.
console.log('▸ building (production, explicit)…');
execSync('node scripts/build-app.mjs production', { stdio: 'inherit' });

console.log('▸ deploying to Vercel (production)…');
const out = execSync('npx vercel --prod --yes 2>&1', { encoding: 'utf8' });
const url = (out.match(/https:\/\/strata-[a-z0-9-]+\.vercel\.app/) || [])[0];
if (!url) {
  console.error(out);
  throw new Error('Could not find a deployment URL in the vercel output.');
}
console.log('  deployed: ' + url);

console.log(`▸ aliasing ${url} → ${ALIAS}…`);
execSync(`npx vercel alias set ${url} ${ALIAS}`, { stdio: 'inherit' });

console.log(`\n✅ live: https://${ALIAS}`);
