#!/usr/bin/env node
// One-command STEM deploy: build -> vercel --prod -> alias to the stable
// STEM URL. Run with:  pnpm run deploy
//
// WHY: this project has no git-push auto-deploy. Committing/pushing puts code on
// GitHub but does NOTHING to Vercel until someone runs the deploy + alias by
// hand. That gap keeps stranding changes as "committed but not live". This
// chains all three steps so a deploy is a single command.
//
// THIS REPO DOES NOT OWN THE APEX DOMAIN. `https://qubix.university` is served
// by alisid0/QUBIX_UNI- (Qubix University). Aliasing this STEM build onto the
// apex would replace the live University product. Default aliases are the
// stable STEM host and www (which currently still points here). To retake the
// apex you must set QUBIX_FORCE_APEX_ALIAS=1 — do not do that by accident.
import { execSync } from 'node:child_process';

const STABLE_ALIAS = 'strata-nine-pi.vercel.app';
const STEM_ALIASES = ['www.qubix.university'];
const APEX_ALIAS = 'qubix.university';

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

for (const alias of STEM_ALIASES) {
  try {
    aliasTo(alias);
  } catch {
    console.warn(`  ⚠ ${alias} not aliased yet — add + DNS-verify the domain in Vercel first (continuing)`);
  }
}

if (process.env.QUBIX_FORCE_APEX_ALIAS === '1') {
  console.warn(`▸ QUBIX_FORCE_APEX_ALIAS=1 — aliasing STEM build onto ${APEX_ALIAS}`);
  try {
    aliasTo(APEX_ALIAS);
  } catch {
    console.warn(`  ⚠ ${APEX_ALIAS} not aliased`);
  }
} else {
  console.warn(`  ⚠ not aliasing ${APEX_ALIAS} — that origin is Qubix University (alisid0/QUBIX_UNI-).`);
  console.warn('    Set QUBIX_FORCE_APEX_ALIAS=1 only if you intend to replace it.');
}

console.log(`\n✅ live STEM: https://${STABLE_ALIAS}`);
console.log(`   www.qubix.university 301s to https://${APEX_ALIAS} (University)`);
console.log(`   apex University remains https://${APEX_ALIAS}`);
