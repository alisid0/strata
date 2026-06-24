/**
 * Lightweight render-time math typography — no LaTeX engine, no dependency.
 *
 * The BB and quiz content is authored in a plaintext maths convention (Unicode
 * symbols plus `X_sub`, `x^pow`, and combining-arrow vectors like F⃗). Browsers
 * render the underscores literally and the combining arrow inconsistently, which
 * reads as unpolished. This pass upgrades those conventions to clean HTML at
 * render time:
 *
 *   F_net   → F<sub>net</sub>          v_rms → v<sub>rms</sub>
 *   r^1.5   → r<sup>1.5</sup>          x^{n+1} → x<sup>n+1</sup>
 *   F⃗ a⃗ v⃗ → <span class="vec">F</span>  (styled as a proper vector)
 *
 * It is deliberately conservative: it only ever touches text *between* tags
 * (never tag names or attributes), and the sub/sup bases are limited so prose
 * underscores in ordinary words are unlikely to be caught. Existing Unicode
 * super/subscripts (², ₀, ⁻¹) are left untouched.
 */

// Combining over-arrows used for vectors: U+20D7 (right), U+20D6 (left).
const VEC = /([A-Za-z])[⃗⃖]/g;

// A subscript/superscript may follow a letter, digit, closing bracket, a vector
// span we just emitted (so `</span>`'s `>`), or a few common unit glyphs.
const PRE = 'A-Za-z0-9)\\]>°℃πΩμ';

const SUP = new RegExp(`([${PRE}])\\^(\\{[^}]{1,16}\\}|-?[A-Za-z0-9.]{1,8})`, 'g');
const SUB = new RegExp(`([${PRE}])_(\\{[^}]{1,18}\\}|[A-Za-z0-9]{1,14})`, 'g');

function vectors(t) {
  return t.replace(VEC, '<span class="vec">$1</span>');
}
function subsup(t) {
  t = t.replace(SUP, (_m, a, b) => `${a}<sup>${b.replace(/[{}]/g, '')}</sup>`);
  t = t.replace(SUB, (_m, a, b) => `${a}<sub>${b.replace(/[{}]/g, '')}</sub>`);
  return t;
}

/** Run `fn` only on the text between tags, never inside `<...>`. */
function onTextNodes(html, fn) {
  return html.replace(/<[^>]+>|[^<]+/g, (chunk) => (chunk[0] === '<' ? chunk : fn(chunk)));
}

/** Format an HTML string (BB floor content). Tags are preserved untouched. */
export function formatMath(html) {
  if (!html) return html;
  return onTextNodes(html, (t) => subsup(vectors(t)));
}

/** Escape a plain-text string, then format — for plain-text contexts (quizzes). */
export function formatMathText(text) {
  if (text == null) return '';
  const escaped = String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return subsup(vectors(escaped));
}
