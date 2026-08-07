# Calculus course — the full arc

Working plan. Thompson's *Calculus Made Easy* (1910, public domain) is the **syllabus**,
not the text. We follow his teaching order and write every chapter ourselves, in the
voice established on the two existing pages.

Nothing here is built except the two integration pages, which now sit late in the order.

---

## Source notes

- The uploaded PDF is a Google Books scan: 296 pages, second edition, prefaced Oct 1914.
- **It has no text layer.** 295 of 296 pages are bilevel scans. OCR of the contents page
  at 300 dpi is clean; body pages with fractions and subscripts will not be. Do not plan
  any workflow that depends on OCRing the mathematics.
- If his actual wording is ever wanted, source a proofread transcription rather than
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

## Order: differentiation first

**Settled.** Differentiation comes first, integration second, as Thompson has it and as
almost every course has it since. The reasons are good ones:

- Differentiating is mechanically easier than integrating. The reader gets to *do*
  something correctly within the first page or two, instead of approximating.
- Rates of change are the more fundamental idea. Integration is best understood as
  undoing one, and undoing is hard to motivate before the thing being undone exists.
- The fundamental theorem is a genuine surprise when both operations are already
  familiar and apparently unrelated. Introduced early it is just a definition.

The two existing pages therefore move to positions **7 and 8**.

### What that costs, and it is small

The existing pages were written to assume nothing, which turns out to be a virtue: they
still work wherever they sit. Three small edits when we get there.

1. Page 7 opens by promising "nothing is assumed beyond multiplying and adding." True
   but odd as the seventh page. Reword to acknowledge what came before.
2. Page 7's jar names subtraction as differentiation. That becomes a moment of
   recognition rather than a reveal, which is better, but the wording should change from
   introducing the word to pointing out that they already know it.
3. Page 8 §5 derives `A′ = f` from scratch. With differentiation already taught this
   becomes a short application rather than a from-scratch argument, and the
   `(x+h)³` expansion in it moves earlier, to page 2 where it belongs.

---

## The arc

| Page | Title | Thompson | Status |
|---|---|---|---|
| 1 | What the symbols mean | I | planned |
| 2 | Degrees of smallness | II | planned |
| 3 | Rates of change | III, IV | planned |
| 4 | The rules | V, VI, VII, IX | planned |
| 5 | Slope, shape and time | VIII, X, XII | planned |
| 6 | Finding the best | XI | planned |
| 7 | Integration — an introduction | XVII, XIX | **built**, needs reframing |
| 8 | Integration, algebraically | XVIII | **built**, needs trimming |
| 9 | The two halves | XVIII, XIX | planned |
| 10 | Growth and waves | XIV, XV | planned |
| 11 | Harder integrals and equations | XIII, XX, XXI | optional |
| — | Partial differentiation | XVI | dropped |

---

## Page by page

Each page follows the shape that worked: a concrete situation first, hand calculations
the reader performs, one question arithmetic cannot answer, then a widget that repeats
their own work faster. No page may require scrolling back to another page to answer a
question.

### Page 1 — What the symbols mean

**Teaches** the notation, before any operation. Thompson I, and he is right to put it
first: most people who bounce off calculus bounce off `dy/dx` and `∫` rather than off
any idea.

**Hook.** `d` means "a little bit of". That is the whole chapter. A little bit of `y`
over a little bit of `x` is a ratio of two small things, and the elongated S is a sum.

**Interactive.** A notation decoder. Page 8 §1 already has one built for the integral
sign; extend the same pattern to `dy/dx`, `d²y/dx²`, and the limits.

**Size.** Short. Possibly folded into page 2 if it cannot fill a page honestly.

### Page 2 — Degrees of smallness

**Teaches** why `h²` may be thrown away when `h` may not. Thompson II, and the idea most
courses skip entirely, leaving the reader to think the algebra is a swindle.

**Hook.** Concrete comparisons of scale. A small quantity, its square, its cube, and how
absurdly fast the later ones stop mattering.

**The one hard question.** If `h` is not zero, throwing away `h²` makes the answer wrong.
So why is the result exact rather than approximate? This is the honest difficulty and
the page should not pretend otherwise.

**Payoff.** Expand `(x+h)²` and `(x+h)³` here, watch the spare `h` terms die, and the
power rule falls out on page 3 with no work left to do.

### Page 3 — Rates of change

**Teaches** the derivative itself. Thompson III and IV.

**Hook.** Two quantities where one drags the other along. Thompson uses a growing
square, which is good: widen it by a little and the area grows by two strips plus a
negligible corner, and the corner is exactly the `h²` from page 2.

**Interactive.** The window-closing widget already drafted for the jar: two readings, a
line through them, and the line settling as the gap shuts. Reusable almost as-is.

### Page 4 — The rules

**Teaches** constants, sums, products, quotients, the chain rule, second derivatives.
Thompson V, VI, VII, IX.

**Risk.** The page most likely to turn into a list, which is exactly what has been
rejected everywhere else. Every rule must be *derived* from the `(x+h)` expansion, never
stated. If a rule cannot be derived in three lines it goes in a reference card instead.

**Open question.** Whether the quotient rule earns a place at all at this level.

### Page 5 — Slope, shape and time

**Teaches** the derivative as steepness, the tangent, the second derivative as bendiness,
and velocity and acceleration. Thompson VIII, X, XII.

**Hook.** A road gradient, then a car. The distinction that always confuses: steep is not
the same as bending sharply. A straight line can be violently steep and never bend at all.

**Interactive.** A point dragged along a curve with the tangent following it, and a
second readout for how fast the slope itself is changing.

### Page 6 — Finding the best

**Teaches** maxima and minima. Thompson XI. **The highest value page in the course.**

**Hook.** Something with a real cost. The cheapest tin holding a fixed volume, the throw
that goes furthest, the price that makes the most money. At the top of a hill the slope
is zero, so set the derivative to zero and solve.

**Why it matters.** This is what derivatives are overwhelmingly used for, and it is the
first point in the course where calculus answers a question the reader could not have
answered by any other means.

### Pages 7 and 8 — the existing integration pages

Built. See the reframing notes above. Page 7 should now open by pointing out that
everything so far has gone one way, and asking what happens if you run it backwards.

### Page 9 — The two halves

**Teaches** the fundamental theorem as the surprise it is.

**Hook.** The train from page 7. That page went speed → distance. Now go
distance → speed on the same journey, same graph, opposite direction, and watch the two
operations undo each other on data the reader already has.

**Note.** With differentiation taught first this page becomes the climax of the course
rather than an aside, which is the main argument for the order.

### Page 10 — Growth and waves

**Teaches** `e` and the trigonometric functions. Thompson XIV and XV, the two best
chapters in the book.

**Hook for `e`.** What function grows at a rate equal to its own size? Compound a pound
at ever shorter intervals and watch it converge, which is the same widget shape as the
strips and the window, and that is the point.

**Hook for sine.** A tide table, a swing, mains electricity. Sine and cosine chase each
other round: differentiate one and you get the other.

### Page 11 — optional

Substitution, integration by parts, and simple differential equations. A cooling cup of
coffee is the natural hook and connects back to `e`.

### Dropped

Partial differentiation, Thompson XVI. Nothing before it needs it and nothing after it
uses it.

---

## Sizing, honestly

The two built pages are about 2,600 lines and took a full session including several
rebuilds after review. Nine more at that standard is a substantial project.

Sensible reductions:

- **Fold pages 1 and 2 together.** Notation and smallness are both short and belong
  next to each other.
- **Build 1–4 as the first release.** That is enough to differentiate a polynomial,
  which is a real skill and a natural stopping point.
- **Page 6 is the one to protect.** If the project stalls anywhere, make sure maxima and
  minima got built.

## Conventions to hold to

Carried over from the built pages, stated so they do not drift:

- One self-contained HTML file per page, no network, opens by double-clicking.
- Phone first. Every control clears a 42px touch target.
- Questions never require scrolling back to another section or page.
- Wrong answers get specific replies, not "not quite".
- Every number quoted in prose is verified against what the widget computes.
- Complete sentences. No em dashes standing in for punctuation. No claiming something is
  "the whole of" anything.
- Each page ends by admitting what it did not cover.
