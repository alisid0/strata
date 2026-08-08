/**
 * render-math.mjs — TeX -> standalone inline SVG, no browser, no runtime JS.
 *
 * mathjax-full with the SVG output jax, rendered in Node with no browser. Each
 * expression comes back as a SELF-CONTAINED inline SVG with its glyphs inlined,
 * so a chapter needs no runtime JavaScript, loads no fonts, and looks identical
 * on every device — including opened straight off disk with no server.
 *
 * Emit styleCss() once in <head>; drop each render() wherever the equation goes.
 * See render() for why each expression gets its own document — the shared-cache
 * approach fails silently in exactly the context these pages must survive.
 *
 *   node render-math.mjs --test   # self-test: no dangling glyph refs + a visual page
 */
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

export class PageMath {
  constructor() { this.css = ''; }

  /** TeX -> a fully self-contained inline <mjx-container> SVG.
   *
   *  A FRESH document per expression is deliberate, and was arrived at by
   *  testing rather than assumption. Sharing one document — with a global OR a
   *  local cache — makes MathJax define each glyph once and <use>-reference it
   *  from every later expression. Those references cross <svg> roots, and a
   *  cross-root "#id" does not resolve in a double-click-to-open static file,
   *  which is exactly the context these pages must survive. The symptom is
   *  brutal and silent: fraction bars draw, every letter and digit vanishes.
   *
   *  Rendering each expression through its own document inlines every glyph it
   *  uses, so an equation renders correctly wherever it is dropped. */
  render(tex, { display = false } = {}) {
    const input = new TeX({ packages: AllPackages });
    const output = new SVG({ fontCache: 'local' });
    const doc = mathjax.document('', { InputJax: input, OutputJax: output });
    const html = adaptor.outerHTML(doc.convert(String(tex).trim(), { display }));
    if (!this.css) this.css = adaptor.textContent(output.styleSheet(doc));
    return html;
  }

  /** No-op: glyphs are inlined per expression. Kept so page templates can call
   *  it unconditionally. */
  fontCacheSvg() { return ''; }

  /** MathJax CSS. Emit ONCE in <head>. Available after the first render(). */
  styleCss() {
    if (!this.css) this.render('x');
    return this.css;
  }
}

// ─────────────────────────────── self-test ───────────────────────────────
if (process.argv.includes('--test')) {
  const { writeFileSync } = await import('node:fs');
  const page = new PageMath();

  // Thompson's actual kinds of expression.
  const exprs = [
    ['\\dfrac{dy}{dx}', true],
    ['(x + dx)^2 = x^2 + 2x\\,dx + (dx)^2', true],
    ['\\dfrac{(x+dx)^n - x^n}{dx}', true],
    ['\\dfrac{d(x^n)}{dx} = n\\,x^{n-1}', true],
    ['\\int_0^{3} x^2 \\, dx = 9', true],
    ['\\sqrt{x} = x^{\\frac12}', true],
    ['y = ax^2 + bx + c', false]
  ];
  const rendered = exprs.map(([e, d]) => page.render(e, { display: d }));
  const cache = page.fontCacheSvg();
  const css = page.styleCss();

  // Correctness: every glyph a <use> points at is defined inline in its own
  // expression (local cache), so nothing should dangle.
  const all = rendered.join('');
  const refs = new Set([...all.matchAll(/href="#([^"]+)"/g)].map(m => m[1]));
  const have = new Set([...all.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  const dangling = [...refs].filter(id => !have.has(id));

  const bytes = Buffer.byteLength(all, 'utf8');
  console.log(`expressions: ${rendered.length}`);
  console.log(`glyph refs: ${refs.size}  |  glyph ids inline: ${have.size}`);
  console.log(`DANGLING refs (must be 0): ${dangling.length}` + (dangling.length ? '  -> ' + dangling.join(',') : ''));
  console.log(`total SVG (${rendered.length} exprs, local cache): ${(bytes / 1024).toFixed(1)} kB  (~${(bytes / rendered.length / 1024).toFixed(1)} kB/expr)`);

  // Anchor to THIS FILE, not the cwd: a cwd-relative path silently writes a
  // second copy when the script is run from the repo root, and you end up
  // inspecting a stale file while believing you changed something.
  const outPath = new URL('_mathtest.html', import.meta.url);
  writeFileSync(outPath,
    `<!doctype html><meta charset="utf-8"><title>math test</title>
<style>${css}
body{font:16px/1.6 system-ui;max-width:640px;margin:40px auto;padding:0 16px}
.e{margin:18px 0;padding:12px;border:1px solid #ddd;border-radius:8px}</style>
<h1>Pre-render self-test</h1>
${cache}
${rendered.map((r, i) => `<div class="e"><code>${exprs[i][0].replace(/</g,'&lt;')}</code><br>${r}</div>`).join('\n')}`);
  console.log('wrote build/_mathtest.html');

  if (dangling.length) { console.error('FAIL: dangling glyph references'); process.exit(1); }
  console.log('OK');
}
