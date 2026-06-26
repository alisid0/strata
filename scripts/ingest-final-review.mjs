// Ingest the finalised publishable BBs into Supabase as a self-contained
// "Final draft" review topic — separate dynamic cards (sort_order 800+),
// tagged reviewStatus:'final' so the app colour-codes them green. Re-runnable:
// it clears the previous review boards (sort_order >= 800) and rebuilds.
//
//   node --env-file=.env.local scripts/ingest-final-review.mjs
//
// Source of truth: 1945_BBs/_PUBLISHABLE.md. Only sections with **Floor**
// markers are ingested (snippets are already live; the recap is skipped).

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const s = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const md = readFileSync('1945_BBs/_PUBLISHABLE.md', 'utf8');

const REVIEW_BASE = 800;

function toHtml(text) {
  let t = text.trim();
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>'); // bold first
  t = t.replace(/\*([^*]+)\*/g, '<em>$1</em>');             // then italics
  return t
    .split(/\n\s*\n/)
    .map(p => `<p>${p.replace(/\n/g, ' ').trim()}</p>`)
    .filter(p => p !== '<p></p>')
    .join('');
}

const sections = md.split(/\n(?=## )/).filter(x => x.startsWith('## '));
const boards = [];

for (const sec of sections) {
  const heading = sec.split('\n')[0].replace(/^##\s*/, '');
  const dash = heading.indexOf(' — ');
  const title = (dash >= 0 ? heading.slice(dash + 3) : heading).trim();

  const floorRe = /\*\*Floor\s+\d+\s*—[^:]*:\*\*\s*([\s\S]*?)(?=\n\s*\n\*\*Floor|\n\s*\n---|\n---|$)/g;
  const layers = [];
  let m;
  while ((m = floorRe.exec(sec)) !== null) layers.push(toHtml(m[1]));

  if (layers.length === 0) continue; // snippet / recap / intro — skip
  boards.push({ title, layers });
}

console.log(`Parsed ${boards.length} finalised BBs from _PUBLISHABLE.md`);

const { error: delErr } = await s.from('cards').delete().gte('sort_order', REVIEW_BASE);
if (delErr) { console.error('delete failed:', delErr.message); process.exit(1); }

let so = REVIEW_BASE;
const rows = boards.map(b => ({
  sort_order: so++,
  act: 'I',
  kicker: 'Final draft',
  title: b.title,
  layers: b.layers,
  img_url: null,
  tags: { subject: 'physics', reviewStatus: 'final', kind: 'bb', source: 'publishable-review' },
}));

const { error: insErr } = await s.from('cards').insert(rows);
if (insErr) { console.error('insert failed:', insErr.message); process.exit(1); }

console.log(`Inserted ${rows.length} review boards (sort_order ${REVIEW_BASE}-${so - 1}):`);
rows.forEach(r => console.log(`  ${r.sort_order} | ${r.layers.length} floors | ${r.title}`));
console.log(`\nWire into paths.js: cards: [${rows.map(r => r.sort_order).join(', ')}]`);
