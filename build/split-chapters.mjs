/**
 * split-chapters.mjs — cut the Gutenberg LaTeX (ebook 33283, Thompson's
 * "Calculus Made Easy", 2nd ed., public domain) into one source file per
 * chapter, plus a manifest.
 *
 * We split on Thompson's OWN structure, so a chapter file is exactly his
 * chapter — that is the test the plan sets for every decision.
 *
 *   \Chapter{I}{Title}                     numbered
 *   \Chapter[RUNNING HEAD]\n{II}{Title}    running head can sit on its own line
 *   \ChapterStar[Opt]{Title}               unnumbered (Prologue, Epilogue, ...)
 *
 * Output: build/chapters/NN-slug.tex + build/chapters/manifest.json
 *
 *   node build/split-chapters.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const SRC = new URL('../content-drafts/33283-t.tex', import.meta.url);
const OUT = new URL('./chapters/', import.meta.url);

const raw = readFileSync(SRC, 'latin1'); // Gutenberg TeX is latin1, not utf8

// Main matter only: skip the preamble, the title page and the contents.
const start = raw.indexOf('\\mainmatter');
const end = raw.indexOf('\\end{document}');
if (start < 0 || end < 0) throw new Error('could not find \\mainmatter / \\end{document}');
const body = raw.slice(start, end);

// Match either chapter form. [\s\S]*? across the optional arg lets the running
// head sit on its own line, which it does for several chapters.
const RE = /\\Chapter(?:\[[\s\S]*?\])?\s*\{([^}]*)\}\s*\{([^}]*)\}|\\ChapterStar(?:\[[\s\S]*?\])?\s*\{([^}]*)\}/g;

const hits = [];
for (let m; (m = RE.exec(body)); ) {
  hits.push({
    index: m.index,
    number: m[1] ?? null,               // roman numeral, or null when unnumbered
    title: (m[2] ?? m[3] ?? '').replace(/\s+/g, ' ').trim()
  });
}

mkdirSync(OUT, { recursive: true });

const slug = (s) => s.toLowerCase().replace(/\\[a-z]+/gi, '').replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '').slice(0, 48);

const manifest = hits.map((h, i) => {
  const text = body.slice(h.index, i + 1 < hits.length ? hits[i + 1].index : body.length);
  const name = `${String(i).padStart(2, '0')}-${h.number ? h.number.toLowerCase() + '-' : ''}${slug(h.title)}.tex`;
  writeFileSync(new URL(name, OUT), text, 'latin1');

  // What's in it: his exercise sets, and how much maths needs pre-rendering.
  const exercises = [...text.matchAll(/\\Exercises\s*\{([^}]*)\}/g)].map(x => x[1]);
  const display = (text.match(/\\begin\{(equation|align|gather|multline)\*?\}|\\\[/g) || []).length;
  const inline = (text.match(/\$[^$]+\$/g) || []).length;

  return {
    file: name,
    number: h.number,
    title: h.title,
    lines: text.split('\n').length,
    exercises,
    mathDisplay: display,
    mathInline: inline
  };
});

writeFileSync(new URL('manifest.json', OUT), JSON.stringify(manifest, null, 2));

const numbered = manifest.filter(c => c.number);
console.log(`chapters written: ${manifest.length}  (numbered: ${numbered.length})`);
console.log(`exercise sets found: ${manifest.reduce((n, c) => n + c.exercises.length, 0)}`);
console.log('\nfirst six:');
for (const c of manifest.slice(0, 6)) {
  console.log(`  ${(c.number || '—').padEnd(5)} ${c.title.slice(0, 44).padEnd(46)} ${String(c.lines).padStart(4)} lines  ex:[${c.exercises.join(',') || '-'}]  math ${c.mathDisplay}d/${c.mathInline}i`);
}
