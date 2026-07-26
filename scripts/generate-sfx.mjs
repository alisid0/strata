// generate-sfx.mjs — generate UI sound effects with the ElevenLabs
// Sound Effects API, saved as MP3s the app plays from /public/sounds/.
//
// IMPORTANT: this uses ElevenLabs *Sound Generation*, which is a separate
// permission from Text-to-Speech. If your API key lacks it the call returns
// 401/permission and this script says so clearly — in that case either enable
// "Sound Generation" on the key in the ElevenLabs dashboard, or just drop your
// own MP3s into public/sounds/ (same filenames) and skip this entirely.
//
// Usage:
//   node --env-file=.env.local scripts/generate-sfx.mjs            # all effects
//   node --env-file=.env.local scripts/generate-sfx.mjs award      # just one
//
// Prereq: ELEVENLABS_API_KEY in .env.local (gitignored).
import { writeFile, mkdir } from 'node:fs/promises';

const KEY = process.env.ELEVENLABS_API_KEY;
if (!KEY) {
  console.error('Missing ELEVENLABS_API_KEY. Run with: node --env-file=.env.local scripts/generate-sfx.mjs');
  process.exit(1);
}

const OUT = 'public/sounds';
const ENDPOINT = 'https://api.elevenlabs.io/v1/sound-generation';

// The app's effect set. `name` becomes public/sounds/<name>.mp3, which sfx.js
// looks up. Tune the prompts (or replace the files) to taste; keep them short
// and dry (no long reverb tail) so they feel snappy in-app.
const SFX = [
  { name: 'award',    seconds: 0.8, prompt: 'A short, bright, cheerful UI reward chime: one clean bell "ding", positive and crisp, no reverb tail, mobile-game success feedback.' },
  { name: 'bonus',    seconds: 1.4, prompt: 'A celebratory ascending sparkle chime, "achievement unlocked", warm magical shimmer resolving upward, rewarding but quick.' },
  { name: 'correct',  seconds: 0.5, prompt: 'A soft, satisfying positive pop for a correct answer: gentle, clean, very short, friendly.' },
  { name: 'complete', seconds: 1.8, prompt: 'A short triumphant fanfare for finishing a lesson: warm bells and a hint of brass, upbeat and resolved, not cheesy.' },
];

async function gen({ name, prompt, seconds }) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'xi-api-key': KEY, 'Content-Type': 'application/json', accept: 'audio/mpeg' },
    body: JSON.stringify({ text: prompt, duration_seconds: seconds, prompt_influence: 0.4 }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    if (res.status === 401 || /permission|sound_generation|missing_permission/i.test(body)) {
      throw new Error(
        `HTTP ${res.status} — the API key lacks the "Sound Generation" permission. ` +
        `Enable it in the ElevenLabs dashboard (or use a key that has it), or drop your own ` +
        `MP3s in ${OUT}/ and skip this script. Details: ${body.slice(0, 180)}`);
    }
    throw new Error(`HTTP ${res.status}: ${body.slice(0, 180)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await mkdir(OUT, { recursive: true });
  await writeFile(`${OUT}/${name}.mp3`, buf);
  console.log(`  ✓ ${OUT}/${name}.mp3  (${(buf.length / 1024).toFixed(1)} KB)`);
}

const only = process.argv[2];
const list = only ? SFX.filter((s) => s.name === only) : SFX;
if (!list.length) {
  console.error(`No effect named "${only}". Options: ${SFX.map((s) => s.name).join(', ')}`);
  process.exit(1);
}

console.log(`Generating ${list.length} sound effect(s) via ElevenLabs → ${OUT}/`);
let failures = 0;
for (const s of list) {
  try { await gen(s); } catch (e) { failures++; console.error(`  ✗ ${s.name}: ${e.message}`); }
}
process.exit(failures ? 1 : 0);
