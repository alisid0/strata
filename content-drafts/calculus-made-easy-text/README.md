# Calculus Made Easy — text extraction, chapters I to V

Text of Silvanus P. Thompson's *Calculus Made Easy*, second edition 1914, extracted
from the Google Books scan in the uploads folder.

Thompson died in 1916, so the work is out of copyright. The scan's own front matter
says the same, and Project Gutenberg publishes it as public domain.

## What is here

| File | Chapter | Book pages | Scan pages | Words |
|---|---|---|---|---|
| `ch01-to-deliver-you-from-the-preliminar.txt` | I. To Deliver You From The Preliminary Terrors | 1–2 | 22–23 | 328 |
| `ch02-on-different-degrees-of-smallness.txt` | II. On Different Degrees of Smallness | 3–8 | 24–29 | 1,338 |
| `ch03-on-relative-growings.txt` | III. On Relative Growings | 9–17 | 30–38 | 1,921 |
| `ch04-simplest-cases.txt` | IV. Simplest Cases | 18–25 | 39–46 | 1,365 |
| `ch05-next-stage-what-to-do-with-constan.txt` | V. Next Stage. What To Do With Constants | 26–34 | 47–55 | 1,690 |

`raw-pages/` holds the untouched OCR for each scan page, so any cleaned line can be
checked against what actually came out of the recogniser.

Every chapter file carries `[book page N]` markers, so any passage can be found in
the scan by adding 21 to get the scan page.

## How it was produced

1. `pdftoppm -r 300` to render each page.
2. `tesseract --psm 6` on each page.
3. A conservative cleanup pass: running heads and their page numbers removed from the
   top of each page, words rejoined where a hyphen split them across a line break,
   repeated spaces collapsed. **Nothing that looked like mathematics was touched.**

## Quality, honestly

**The prose is good.** Long stretches are correct as they stand, and where it is wrong
it is usually obvious, such as a capitalised first word coming out as `Tue` instead of
`THE`.

**The mathematics is not usable as it stands.** About 11% of lines carry visible damage.
The recurring failures, counted across all five chapters:

| What OCR produced | What the book has | Count |
|---|---|---|
| `da` | `dx` | 30 |
| `dz` | `dx` | 11 |
| `dw` | `dx` | 1 |
| bare `a` next to an operator | `x` | 22 |
| stray `w` | `x` | 10 |
| `?` | a superscript, usually `²` | 53 |

So `(dx)²` comes out as `(da)?`, and `dy = 2x·dx` comes out as `dy =2x- da.` The pattern
is consistent, which is encouraging, but it cannot be fixed by find and replace alone
because `a` is also a legitimate letter in the text.

Figures are lost entirely by OCR. They have been located and cropped separately as
reference images. See FIGURES.md.

## What to do next

Two options, and the second is better.

**Proofread these files against the scan.** Roughly 850 lines, of which about 96 need
attention. Feasible for five chapters, tedious and error-prone for twenty-two.

**Use the Project Gutenberg transcription instead.** Ebook 33283, and specifically the
LaTeX source at `files/33283/33283-t/33283-t.tex`, about 395 kB. Volunteers proofread it
and the mathematics is properly marked up, which removes this entire problem. It could
not be fetched from this session's tooling, but it downloads normally in a browser.

If the goal is a faithful conversion of the whole book, take the second path. These
files are useful for checking a transcription against this particular edition, and for
seeing exactly what Thompson wrote in the five chapters we have been working near.

## Rendering the mathematics later

Whatever the source, the existing course pages are single self-contained files with no
network access. Faithful mathematics means either bundling a renderer such as KaTeX,
roughly 300 kB with fonts, or pre-rendering every expression to inline SVG at build
time. Pre-rendering keeps the files standalone. Worth deciding before conversion starts
rather than after a dozen pages are built.
