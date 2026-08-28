#!/usr/bin/env node
// One-command STEM deploy: build -> vercel --prod -> alias to the stable
// STEM URL. Run with:  pnpm run deploy
//
// WHY: this project has no git-push auto-deploy. Committing/pushing puts code on
// GitHub but does NOTHING to Vercel until someone runs the deploy + alias by
// hand. That gap keeps stranding changes as "committed but not live". This
// chains all three steps so a deploy is a single command.
//
// THIS REPO DOES NOT OWN qubix.university OR www.qubix.university.
// Both hostnames are Qubix University (alisid0/QUBIX_UNI-, Vercel project
// qubix-university). Aliasing this STEM build onto either hostname replaces
// the live data-science site with the old swipe app. The only default alias
// is the dedicated STEM host. To retake a University domain you must set
// QUBIX_FORCE_APEX_ALIAS=1 — do not do that by accident.
import { execSync } from 'node:child_process';

const STABLE_ALIAS = 'strata-nine-pi.vercel.app';
const UNIVERSITY_ALIASES = ['qubix.university', 'www.qubix.university'];

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

function aliasTo(alias) {
  execSync(`npx vercel alias set ${url} ${alias}`, { stdio: 'inherit' });
  console.log(`  ✓ aliased ${alias}`);
}

console.log(`▸ aliasing ${url} → ${STABLE_ALIAS}…`);
aliasTo(STABLE_ALIAS);

if (process.env.QUBIX_FORCE_APEX_ALIAS === '1') {
  console.warn('▸ QUBIX_FORCE_APEX_ALIAS=1 — aliasing STEM over Qubix University domains');
  for (const alias of UNIVERSITY_ALIASES) {
    try {
      aliasTo(alias);
    } catch {
      console.warn(`  ⚠ ${alias} not aliased`);
    }
  }
} else {
  for (const alias of UNIVERSITY_ALIASES) {
    console.warn(`  ⚠ not aliasing ${alias} — that origin is Qubix University (alisid0/QUBIX_UNI-).`);
  }
}

console.log(`\n✅ live STEM: https://${STABLE_ALIAS}`);
console.log('   University remains https://qubix.university (and www).');
