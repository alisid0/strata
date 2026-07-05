#!/usr/bin/env node
// One-command production deploy: build -> vercel --prod -> alias to the stable
// review URL. Run with:  npm run deploy
//
// WHY: this project has no git-push auto-deploy. Committing/pushing puts code on
// GitHub but does NOTHING to Vercel until someone runs the deploy + alias by
// hand. That gap keeps stranding changes as "committed but not live". This
// chains all three steps so a deploy is a single command.
import { execSync } from 'node:child_process';

const ALIAS = 'strata-nine-pi.vercel.app';

console.log('▸ building…');
execSync('npm run build', { stdio: 'inherit' });

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
