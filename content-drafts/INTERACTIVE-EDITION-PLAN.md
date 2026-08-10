# Calculus Made Easy — plan for an interactive edition

Supersedes `calculus-course-plan.md`, which planned a course *inspired by* the book.
This plans a conversion *of* the book.

---

## 1. What the product is

A phone-first web edition of Thompson's text where his prose is the content, his figures
are redrawn so they move, and his own exercises are checkable.

The test for every decision: **would Thompson recognise this as his chapter?** If a page
teaches something he does not teach, or in an order he does not use, it belongs in a
different product.

## 2. The thing that makes this work

**The book already contains its own question bank.** Chapters IV and V end with
"Exercises I" and "Exercises II", and there is an Answers section at book page 254
covering the exercise sets right through the book.

This removes the problem that has dogged everything so far. The guided steps, the
checkable answers and the review questions can all be *his*, with our machinery only
providing the checking, the specific replies to wrong answers, and the ordering. We
invent the interaction, not the mathematics.

Chapters I to III have no exercises. They are short and expository, and their
interactivity comes from the figures instead.

## 3. Source

Two candidates, and the choice depends on scope.

**For chapters I to V**, use the OCR already in `calculus-made-easy-text/`. The prose is
sound. About 96 lines of mathematics need repair against the scan, which is an
afternoon. The figures are already located and three of seven are already redrawn.

**For anything beyond chapter V**, use the Project Gutenberg LaTeX source, ebook 33283,
file `33283-t.tex`, roughly 395 kB. Volunteers have already proofread it with the
mathematics marked up. Repairing OCR by hand across twenty-two chapters would be several
hundred lines of hand-checked algebra and is not worth doing when the work exists.

The tooling in this session could not fetch that file. It downloads normally in a
browser and can be dropped into the repo.

## 4. The one architectural decision

Every page so far is a single self-contained file that opens by double-clicking with no
network. Faithful mathematics has to be rendered somehow. Three options:

| Option | Cost | Keeps files standalone |
|---|---|---|
| Pre-render each expression to inline SVG at build time | A build step, and expressions become fixed images | Yes |
| Bundle KaTeX into every page | About 300 kB per page including fonts | Yes, but files get heavy |
| Hand-code with HTML entities, as the existing pages do | Free, but only good for simple expressions | Yes |

**Settled: pre-rendered SVG**, with the existing entity approach kept for anything simple
enough not to need it.

The pipeline is tested and works. MathJax renders TeX to standalone SVG in Node with no
browser, using `mathjax-full`, the `liteAdaptor` and the SVG output jax. Thompson's kind
of expression comes out cleanly: `dy/dx`, the expansion of `(x+dx)²`, the difference
quotient, the power rule, a definite integral with limits, and a square root all render
correctly.

**Correction: use `fontCache: 'local'`, not global.** My earlier recommendation of the
global cache was wrong, and the toolchain in `build/render-math.mjs` is right to reject
it.

Global caching defines each glyph once and `<use>`-references it from every later
expression. Those references cross `<svg>` roots, and a cross-root `#id` does not resolve
in a file opened by double-clicking, which is exactly the context these pages have to
survive. Verified: with the global cache, all 47 glyph references in a three-expression
sample dangle. The failure is silent and vicious — fraction bars draw, every letter and
digit disappears. With the local cache, zero dangle.

**But pre-rendering everything does not scale, and the size numbers say so.**

| | Expressions | Pre-rendered SVG |
|---|---|---|
| Chapter III alone | 192 | about 920 kB |
| Chapters I to V | 598 | about 2.9 MB |
| The whole book | 3,991 | about 18.7 MB |

Nearly a megabyte for one chapter is not a phone-friendly page.

**So render selectively.** Measured across chapters I to V, most of his inline maths is
not complex at all:

| What the expression is | Share |
|---|---|
| A single symbol, such as `x` or `dx` | 47.5% |
| Trivial, a few characters | 19.5% |
| Nothing but a sub or superscript | 12.1% |
| Genuinely needs rendering: fractions, integrals, roots | 10.5% |
| Other | 10.4% |

Four fifths of it renders perfectly well as HTML entities and `<sup>` tags, which is what
the existing pages already do and what keeps them light. Send only the remaining fifth
through MathJax.

That brings chapters I to V down from about 2.9 MB to roughly 570 kB, and makes a chapter
weigh about what a photograph does.

**The rule:** display equations and anything containing a fraction, integral, root or
stacked construction becomes SVG. Everything else stays as markup. The classifier for
this is about ten lines and belongs in the build.

## 5. Architecture

```
index.html                     contents, progress across chapters, resume where you left off
cme-01.html … cme-NN.html      one file per chapter, self-contained
build/                         source text, figure sources, the equation pre-renderer
```

Shared conventions already established and worth keeping:

- Phone first, every control clearing a 42 px touch target
- Progress under one `localStorage` key, namespaced per chapter, as the two calculus
  chapters already do
- No question requiring the reader to scroll back to another section or page
- Wrong answers get a specific reply naming the misconception, never "not quite"
- Every number quoted in prose verified against what the widget computes

## 6. The per-chapter recipe

Repeatable, so chapters get faster rather than slower.

1. **Text.** Take his prose, split into sections at his own natural breaks, keep his
   wording. Modernise nothing except obvious OCR damage.
2. **Equations.** Pre-render. Check each against the scan.
3. **Figures.** Redraw as SVG. Where a slider adds understanding, make it live;
   otherwise leave it static. Not every figure needs to move.
4. **Worked examples.** His examples become locked guided steps, with his numbers.
5. **Exercises.** His exercise set becomes the checkable questions, with his answers
   as the key.
6. **Wrong-answer replies.** Ours. This is where the teaching value we add actually sits,
   and it needs a pass of thinking per question about what a reader would plausibly get
   wrong and why.
7. **Review.** Tag each question with the idea it tests, and let the adaptive review
   build itself, as chapters 1 and 2 already do.

## 7. Phases

**Phase 0. Shell and toolchain.** Build `index.html` and the shared assets. Build the
equation pre-renderer around `mathjax-full`. Parse the Gutenberg LaTeX into per-chapter
source. Redraw Figs. 4, 5, 6 and convert the page 22 table to HTML. Nothing user-facing
ships. The OCR repair is no longer part of this, since the source is proofread.

**Phase 1. Chapters I to III.** Short, expository, no exercises. Proves the pipeline on
the easy case and produces something openable.

**Phase 2. Chapters IV and V.** The first chapters with his exercises, so the first real
test of the question pipeline. **This is the first honest release**: at the end of it a
reader can differentiate a polynomial, using his text and his problems.

**Phase 3. Chapter VI onward.** Only with the Gutenberg source in hand. Reassess after
phase 2, since by then the true cost per chapter is known rather than estimated.

## 8. What happens to what already exists

| File | Fate |
|---|---|
| `calculus-1-small-things.html` | Superseded. It is our content following his order. Keep as reference for the interaction patterns, do not ship alongside the conversion. |
| `calculus-2-the-pattern.html` | Same. |
| `integration.html`, `integration-part-2.html` | Keep as a separate short course. They cover his chapters XVII and XIX in our own way and do it well. Do not merge. |
| `calculus-course-plan.md` | Superseded by this document. |
| `calculus-made-easy-text/` | Becomes the build input for phases 0 to 2. |

The two calculus chapters are not wasted. Every interaction pattern the conversion needs
was worked out in them: locked steps, predict before revealing, specific wrong-answer
replies, the adaptive review, shared progress. That machinery ports directly.

## 9. Effort, honestly

Chapters 1 and 2 of the course ran to about 1,950 lines and took a working session each,
including rebuilds after review. A converted chapter should be cheaper, because the
content is written and the questions exist, but heavier on verification, because every
equation and every answer must be checked against the source.

Estimate one working session per chapter for phases 1 and 2, so roughly five sessions to
a first release, plus one for phase 0.

## 10. Still open

- Whether phase 1 ships publicly or stays internal until phase 2 is done.

Settled since first writing: equations pre-render to SVG with a global font cache, and
the Gutenberg LaTeX is the source from the start, so the OCR repair in phase 0 is no
longer needed. The extracted chapters stay useful for checking a passage against this
particular edition.
