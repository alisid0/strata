/**
 * build-final-drafts.mjs — assemble the canonical, deduplicated learning material
 * into per-subject master drafts for publication.
 *
 * Source of truth: the LIVE content — static deck (cards 1..84) + Supabase `cards`
 * (85+, excluding snippets). Organized into a curated topic structure per subject
 * (merging the Frye / Micro-Frye / Verma / deck author-series paths), conservatively
 * deduplicated (one canonical BB per concept; generic "Numerical/Problem" titles are
 * never merged). Writes 1945_BBs/{Physics,Mathematics,Chemistry}.md + _DEDUP-LOG.md.
 *
 *   node --env-file=.env.local scripts/build-final-drafts.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';
import { PATHS } from '../src/lib/content/paths.js';
import { DECK } from '../src/lib/content/deck.js';

const OUT = '1945_BBs';
mkdirSync(OUT, { recursive: true });

// ── Curated topic structure: section title → ordered path IDs ──────────────────
const SECTIONS = {
  Physics: [
    ['Measurement & foundations', ['P4', 'P6', 'P0', 'P0T1', 'P0T2']],
    ['Forces & motion', ['P28', 'P1', 'P7', 'P24', 'P8']],
    ['Energy & momentum', ['P29', 'P2', 'P9']],
    ['Rotational dynamics', ['P12']],
    ['Gravitation & orbits', ['P3', 'P15']],
    ['Materials, fluids & machines', ['P20']],
    ['Oscillations, waves & sound', ['P31', 'P21']],
    ['Heat & thermodynamics', ['P32', 'P14', 'P16', 'P25']],
    ['Electricity & circuits', ['P30', 'P11', 'P22']],
    ['Magnetism & electromagnetic induction', ['P17']],
    ['Optics', ['P33', 'P13', 'P26']],
    ['Modern & applied topics', ['P23', 'P27']],
    ['Vectors', ['P5', 'P10']],
    ['Calculus in physics', ['P18', 'P19']],
  ],
  Mathematics: [
    ['Arithmetic & algebra foundations', ['M5', 'M6', 'M13', 'M14']],
    ['Exponents & logarithms', ['M8']],
    ['Coordinate geometry', ['M3']],
    ['Trigonometry', ['M9']],
    ['Vectors & matrices', ['M7', 'M12']],
    ['Calculus', ['M1', 'M2', 'M15', 'M16']],
    ['Problem-solving & proof', ['M10', 'M11']],
  ],
  Chemistry: [
    ['Atomic structure', ['C1', 'C2']],
    ['Chemical bonding', ['C3']],
    ['Reactions & molecular architecture', ['C4']],
    ['Redox, electrochemistry & kinetics', ['C5']],
  ],
};

// ── Load live boards (number → {title, kicker, layers, tags}) ──────────────────
const env = Object.fromEntries(readFileSync('.env.local', 'utf8').split(/\r?\n/)
  .filter(l => l.includes('=')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; }));
const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const { data: rows, error } = await sb.from('cards').select('sort_order,kicker,title,layers,tags').gt('sort_order', 84).order('sort_order');
if (error) { console.error(error); process.exit(1); }

const board = {};
DECK.forEach((c, i) => { board[i + 1] = { n: i + 1, title: c.title, kicker: c.kicker, layers: c.layers, tags: c.tags || {} }; });
for (const r of rows) {
  if (r.tags && r.tags.kind === 'snippet') continue;
  board[r.sort_order] = { n: r.sort_order, title: r.title, kicker: r.kicker, layers: r.layers, tags: r.tags || {} };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const FLOOR_NAMES = ['Idea', 'Concrete', 'Definition', 'In action', 'Deeper', 'Deeper'];
// Titles that are distinct content even when they share a prefix — never merge these.
// (Toolkit summaries DO merge, so they're intentionally not listed here.)
const GENERIC = /^(numerical|problem|worked example|exercise|test yourself)/;

function htmlToMd(html) {
  if (html == null) return '';
  let s = typeof html === 'object' ? (html.text || '') : String(html);
  s = s.replace(/<\s*(strong|b)\s*>/gi, '**').replace(/<\/\s*(strong|b)\s*>/gi, '**')
    .replace(/<\s*(em|i)\s*>/gi, '*').replace(/<\/\s*(em|i)\s*>/gi, '*')
    .replace(/<\s*li\s*>/gi, '\n- ').replace(/<\/\s*li\s*>/gi, '')
    .replace(/<\s*\/?\s*(ul|ol)\s*>/gi, '\n')
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n\n').replace(/<\s*p[^>]*>/gi, '')
    .replace(/<[^>]+>/g, '') // strip remaining tags (formula/gloss spans etc.)
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#39;/g, "'").replace(/&quot;/g, '"')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return s;
}
function conceptKey(title) {
  let t = (title || '').split(/[:—–]| - /)[0].toLowerCase();
  t = t.replace(/^(the|a|an|why|how|what is|what's|understanding)\s+/g, '');
  t = t.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  t = t.replace(/\bnewtons\b/g, 'newton').replace(/\blaws?\b/g, 'law');
  return t;
}
function completeness(b) {
  const floors = (b.layers || []).filter(Boolean);
  const len = floors.reduce((a, l) => a + htmlToMd(l).length, 0);
  return floors.length * 100000 + len; // floors first, then total length
}
function humanize(s) { return s ? s.replace(/-/g, ' ') : ''; }

// ── Assemble per subject: canonical pick + ordered emission + dedup log ────────
const dedupLog = [];
let grandTotal = 0;

for (const subject of Object.keys(SECTIONS)) {
  // First pass: choose the canonical board for each non-generic concept across the subject.
  const canonicalFor = {};   // conceptKey → board number chosen
  const orderedNums = [];    // emission order (first occurrence), unique boards
  const seenNum = new Set();
  for (const [, pathIds] of SECTIONS[subject]) {
    for (const pid of pathIds) {
      for (const n of (PATHS[pid]?.cards || [])) {
        if (!board[n] || seenNum.has(n)) continue;
        seenNum.add(n);
        orderedNums.push(n);
      }
    }
  }
  // pick canonical per concept (most complete)
  for (const n of orderedNums) {
    const b = board[n];
    const key = conceptKey(b.title);
    if (!key || GENERIC.test(b.title.toLowerCase())) continue; // never dedup generic titles
    if (!canonicalFor[key] || completeness(b) > completeness(board[canonicalFor[key]])) {
      canonicalFor[key] = n;
    }
  }
  // emission: keep generic + canonical picks; log the dropped duplicates
  const dropped = {};
  function keep(n) {
    const b = board[n];
    const key = conceptKey(b.title);
    if (!key || GENERIC.test(b.title.toLowerCase())) return true;
    if (canonicalFor[key] === n) return true;
    (dropped[key] = dropped[key] || []).push(n);
    return false;
  }

  // Build markdown
  let count = 0;
  const lines = [];
  lines.push(`# Qubix — ${subject}`);
  lines.push('');
  lines.push(`> Final publication draft. Built from the live content (source of truth), organized by topic, and deduplicated to one canonical board per concept. Generated by \`scripts/build-final-drafts.mjs\`.`);
  lines.push('');
  const tocStart = lines.length;
  lines.push('---', '');

  const emittedNums = new Set();
  let sectionNo = 0;
  const toc = [];
  for (const [sectionTitle, pathIds] of SECTIONS[subject]) {
    sectionNo++;
    const sectionNums = [];
    for (const pid of pathIds) {
      for (const n of (PATHS[pid]?.cards || [])) {
        if (!board[n] || emittedNums.has(n)) continue;
        emittedNums.add(n);
        if (keep(n)) sectionNums.push(n);
      }
    }
    toc.push(`${sectionNo}. ${sectionTitle} — ${sectionNums.length} boards`);
    lines.push(`## ${sectionNo}. ${sectionTitle}`, '');
    for (const n of sectionNums) {
      const b = board[n];
      count++;
      const topic = humanize(b.tags?.topic) || subject.toLowerCase();
      lines.push(`### ${b.title}`);
      lines.push(`*${b.kicker || 'BB ' + n} · ${humanize(b.tags?.subject) || subject} · ${topic}*`);
      lines.push('');
      const floors = b.layers || [];
      let fi = 0;
      for (let k = 0; k < floors.length; k++) {
        const md = htmlToMd(floors[k]);
        if (!md) continue;
        lines.push(`**${FLOOR_NAMES[fi] || 'Floor ' + fi}.** ${md}`);
        lines.push('');
        fi++;
      }
      lines.push('---', '');
    }
  }
  // insert TOC
  lines.splice(tocStart, 0, '## Contents', '', ...toc.map(t => `- ${t}`), '');

  writeFileSync(`${OUT}/${subject}.md`, lines.join('\n'), 'utf-8');
  grandTotal += count;
  console.log(`${subject}: ${count} canonical boards across ${SECTIONS[subject].length} sections → ${OUT}/${subject}.md`);

  for (const key in dropped) {
    dedupLog.push(`- **${subject}** · "${key}": kept #${canonicalFor[key]} (${board[canonicalFor[key]].title}); merged ${dropped[key].map(n => `#${n} (${board[n].title})`).join(', ')}`);
  }
}

writeFileSync(`${OUT}/_DEDUP-LOG.md`, `# Dedup log — canonical board kept per overlapping concept\n\n${dedupLog.join('\n')}\n`, 'utf-8');
console.log(`\nTotal canonical boards: ${grandTotal}. Merges logged: ${dedupLog.length} → ${OUT}/_DEDUP-LOG.md`);
