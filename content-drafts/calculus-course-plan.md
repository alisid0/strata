# Calculus course — the full arc

Working plan. Thompson's *Calculus Made Easy* (1910, public domain) is the **syllabus**,
not the text. We follow his teaching order where it earns its place and write every
chapter ourselves, in the voice established on the two existing pages.

Nothing here is built yet except pages 1 and 2.

---

## Source notes

- The uploaded PDF is a Google Books scan: 296 pages, second edition, prefaced Oct 1914.
- **It has no text layer.** 295 of 296 pages are bilevel scans. OCR of the contents page
  at 300 dpi is clean; body pages with fractions and subscripts will not be. Do not plan
  any workflow that depends on OCRing the maths.
- If his actual wording is ever needed, source a proofread transcription rather than
  OCRing this scan.
- Copyright expired. Using the chapter progression is unproblematic; we are not
  reproducing his prose.

## Thompson's chapters, for reference

| | Chapter | p. |
|---|---|---|
| I | To Deliver You From The Preliminary Terrors | 1 |
| II | On Different Degrees of Smallness | 3 |
| III | On Relative Growings | 9 |
| IV | Simplest Cases | 18 |
| V | Next Stage. What To Do With Constants | 26 |
| VI | Sums, Differences, Products and Quotients | 35 |
| VII | Successive Differentiation | 49 |
| VIII | When Time Varies | 52 |
| IX | Introducing a Useful Dodge | 67 |
| X | Geometrical Meaning of Differentiation | 76 |
| XI | Maxima and Minima | 93 |
| XII | Curvature of Curves | 112 |
| XIII | Other Useful Dodges | 121 |
| XIV | On True Compound Interest and the Law of Organic Growth | 134 |
| XV | How to Deal with Sines and Cosines | 165 |
| XVI | Partial Differentiation | 175 |
| XVII | Integration | 182 |
| XVIII | Integrating as the Reverse of Differentiating | 191 |
| XIX | On Finding Areas by Integrating | 206 |
| XX | Dodges, Pitfalls and Triumphs | 226 |
| XXI | Finding Some Solutions | 234 |
| XXII | Epilogue and Apologue | 249 |

---

## The one structural decision

**Thompson teaches differentiation first and integration last. We have done the
opposite, and should keep going that way.**

His order is the traditional one. Ours happened by accident and turned out better for
this audience, for three reasons:

1. Totals are more intuitive than rates. A jar filling up and a train covering ground
   need no setup. "Rate of change at an instant" needs a limit before it means anything.
2. The jar in page 1 already teaches differentiation without naming it. Subtracting two
   readings *is* a derivative. The ground is prepared.
3. Page 2 §5 already derives `A′ = f` and expands `(x+h)³`. Differentiation is now
   demanded by what we have built, which is the best possible reason to introduce it.

So: **integration → rates → what rates are for → the two together → harder functions.**
Thompson's chapters get redistributed accordingly.

---

## The arc

| Page | Title | Thompson | Status |
|---|---|---|---|
| 1 | Integration — an introduction | XVII, XIX | **built** |
| 2 | Integration, algebraically | XVIII, and I for notation | **built** |
| 3 | Rates | II, III | planned |
| 4 | The rules | IV, V, VI, VII, IX | planned |
| 5 | Slope and shape | X, XII | planned |
| 6 | Finding the best | XI | planned |
| 7 | The two halves | XVIII again, properly | planned |
| 8 | Growth that feeds itself | XIV | planned |
| 9 | Things that go round | XV | planned |
| 10 | Harder integrals | XIII, XX | optional |
| 11 | Equations about change | XXI | optional |
| — | Partial differentiation | XVI | probably drop |

---

## Page by page

Each page follows the shape that worked: a concrete situation first, hand
calculations the reader performs, one question arithmetic cannot answer, then a widget
that repeats their own work faster. No page may depend on remembering another page in
order to answer a question.

### Page 3 — Rates

**Teaches** the derivative as a limit of differences. Thompson II and III.

**Hook.** The jar again, but the money now trickles in continuously instead of arriving
each morning, so the gap between readings can shrink below a day. Drafted once already
and cut; the numbers were good and are worth reusing: with `F(t) = t²`, every window
gives exactly `6 + h`, so the pattern is visible by hand before any widget.

**The one hard question.** No window is short enough to *be* an instant, and a window of
zero width gives nothing over nothing. So what does "the rate right now" even mean?

**Watch for.** This is the page where "degrees of smallness" belongs — why `h²` can be
thrown away when `h` cannot. Thompson is very good on this and it is the idea most
courses skip.

### Page 4 — The rules

**Teaches** the power rule, constants, sums, products, quotients, the chain rule.
Thompson IV, V, VI, VII, IX.

**Hook.** Weak on its own. This is the page most at risk of becoming a list of rules,
which is exactly what the reader has been rejecting all along. Each rule needs to be
*derived* from the `(x+h)` expansion rather than stated, the way page 2 §5 does.

**Open question.** Whether the product and quotient rules earn their place at all, or
whether they belong in a reference card. Decide when writing.

### Page 5 — Slope and shape

**Teaches** the derivative as steepness, the tangent, and the second derivative as
bendiness. Thompson X and XII.

**Hook.** A road gradient or a hillside. The distinction that matters and always
confuses: steep is not the same as bending sharply. A straight line can be violently
steep and never bend.

**Interactive.** A point dragged along a curve with its tangent following, and a second
readout showing how fast the slope itself is changing.

### Page 6 — Finding the best

**Teaches** maxima and minima. Thompson XI.

**Hook.** The strongest one available in the whole book. Something with a real cost:
the cheapest tin can holding a fixed volume, the throw that goes furthest, the price
that makes the most money. At the top of a hill the slope is zero, so set the derivative
to zero and solve.

**Why it matters.** This is what derivatives are overwhelmingly *for*, and nothing on
the existing pages touches it. If only one more page ever gets built, build this one.

### Page 7 — The two halves

**Teaches** the fundamental theorem as a single idea rather than a trick.

**Hook.** Return to the train. Page 1 went speed → distance. Now go distance → speed on
the same journey, same graph, opposite direction, and show the two operations undoing
each other on data the reader already knows.

**Note.** Page 2 §5 already proves this algebraically. Page 7 is the picture, not the
proof, and should say so.

### Page 8 — Growth that feeds itself

**Teaches** `e`, exponential growth and decay. Thompson XIV, the best chapter in the book.

**Hook.** Interest that compounds continuously; a population; a cooling cup of coffee.
The defining question: what function grows at a rate equal to its own size?

**Interactive.** Compounding a pound at ever shorter intervals and watching it converge
on `e`. Same shape as the strip and window widgets, which is the point.

### Page 9 — Things that go round

**Teaches** differentiating sine and cosine. Thompson XV.

**Hook.** A tide table, a swing, mains electricity. Sine and cosine chase each other:
differentiate one and you get the other.

### Pages 10 and 11 — optional

Substitution, integration by parts, and simple differential equations. Only worth
building if the earlier pages land. A cooling cup of coffee is the natural hook for
page 11 and connects back to page 8.

### Dropping partial differentiation

Thompson XVI. Nothing before it needs it, and nothing after it uses it. Out unless a
specific reason appears.

---

## Sizing, honestly

Pages 1 and 2 together are about 2,600 lines and took a full working session, including
several rebuilds after review. Nine more pages at that standard is a large project, not
an afternoon. Two ways to cut it down:

- **Build page 6 next and stop.** Maxima and minima is the highest value per page by a
  wide margin.
- **Build 3, 4 and 7 as one page.** Rates, rules and the fundamental theorem compress
  reasonably into a single longer page if the rules section stays short.

## Conventions to hold to

Carried over from the existing pages, and worth stating so they do not drift:

- One self-contained HTML file per page, no network, opens by double-clicking.
- Phone first. Every control clears a 42px touch target.
- Questions never require scrolling back to another section.
- Wrong answers get specific replies, not "not quite".
- Every number quoted in prose is verified against what the widget computes.
- Complete sentences. No em dashes standing in for punctuation. No claiming something is
  "the whole of" anything.
- Each page ends by admitting what it did not cover.
