# Phase 0.1 — sourcing audit

Four topic areas, built as Qubix boards, on the assumption that **Qubix will charge money
at some point**. That single assumption decides most of what follows.

---

## 1. The licence rule

Commercial use rules out anything carrying a **NonCommercial** term. Only two pools are
safe:

| Pool | Safe for a paid product | Obligation |
|---|---|---|
| **Public domain** | Yes | None, though crediting is decent practice |
| **CC BY 4.0** | Yes | Attribution, and it must be visible in the product |
| CC BY-NC / NC-SA | **No** | Excluded entirely |
| CC BY-SA | Risky | Share-alike may force your own material open. Take advice. |
| All-rights-reserved textbooks | No | Needs a licence deal |

**This kills the main recommendation you were given.** Harold Jacobs' three books,
Foerster, Sullivan and Larson are all current commercial textbooks in copyright. Their
worked examples, exercise sets and sequencing cannot be converted without a publisher
licence. The advice named them as the primary content base while flagging legal ease only
for OpenStax, which is the wrong way round.

What *is* usable from that advice is the approach, which nobody owns: curiosity hook
before formalism, gradual buildup, humour, treating the reader as capable.

**OpenStax licences vary by title.** Most are CC BY 4.0, some are CC BY-NC-SA. That
difference is decisive here and it is per book, not per publisher. Check the licence on
each title's own page before it goes near the build. Do not take it from me and do not
assume it from a sibling title.

---

## 2. What exists in the app today

Verified by reading `paths.js` rather than assumed.

| Topic | Boards | Status |
|---|---:|---|
| The Line | 21 | exists, empty |
| Coordinate geometry | 15 | exists, empty |
| Coordinate maps | 13 | exists, empty |
| Functions | 10 | exists, empty |
| Exponents & logarithms | 10 | exists, empty |
| Lines & gradients | 10 | exists, empty |
| Limits | 8 | exists, empty |
| Differentiation | 8 | exists, empty |
| Matrices | 8 | exists, empty |
| Trigonometry | 6 | exists, empty |
| **Total maths** | **109** | **all placeholder** |

**Probability, Statistics and Geometry do not exist at all.** Not empty, absent. Two of
the four topics chosen for 0.1 therefore need creating in `paths.js` before anything can
be authored into them.

### A gap in this audit worth naming

Board *titles* for these topics are not in the repo. The bundled files carry none for the
four target topics, which fits what `CLAUDE.md` says: `dynamicBoards.js` pulls titles from
the Supabase `cards` table at runtime, and the bundled boards are fallbacks for missing
rows.

**So I cannot say what each of the 109 boards is meant to teach from the repo alone.**
Before authoring, run `pnpm run audit:live-media` and pull the live titles. Writing 21
boards for The Line without knowing its existing 21 titles risks duplicating or
contradicting a plan already in the database.

---

## 3. Source candidates per topic

Only public domain and CC BY are listed. Anything NC is excluded on the commercial rule.

### The Line — number systems (21 boards, exists)

| Candidate | Licence | Notes |
|---|---|---|
| OpenStax *Prealgebra* | verify per title | Integers, fractions, decimals, reals. Maps almost board for board. |
| OpenStax *Elementary Algebra* | verify per title | Real number properties, ordering |
| Public domain classics | PD | Nineteenth-century arithmetic and algebra texts are plentiful but the register is wrong for a reluctant sixteen-year-old |

**Assessment: strong.** The best-covered of the four, and the most foundational.

### Probability & statistics (does not exist, needs creating)

| Candidate | Licence | Notes |
|---|---|---|
| OpenStax *Introductory Statistics* | verify per title | Full coverage, exercise sets, worked examples |
| OpenStax *Statistics* (high school edition) | verify per title | Closer to the target reader if it exists in the catalogue |

**Assessment: strong on source, weak on scaffolding.** No boards, no sequence, no titles.
Everything has to be designed before anything is written. Highest value if you want to
close a real curriculum gap, highest setup cost of the four.

### Functions and Trigonometry (16 boards, exists)

| Candidate | Licence | Notes |
|---|---|---|
| OpenStax *Algebra and Trigonometry* | verify per title | Direct coverage of both |
| OpenStax *Precalculus* | verify per title | Same material, aimed slightly higher |

**Assessment: strong, and strategically placed.** These sit directly beneath Limits and
Differentiation, so filling them makes the calculus work reachable rather than orphaned.

### Geometry proper (does not exist, needs creating)

| Candidate | Licence | Notes |
|---|---|---|
| Euclid's *Elements* | PD | The propositions themselves are ancient and free |
| Byrne's 1847 coloured *Elements* | PD | Famous visual edition; the coloured diagrams are the whole point and would redraw beautifully as SVG |
| OpenStax | none | **There is no OpenStax geometry text.** Confirm before relying on this line |

**Assessment: best interactive potential, worst fit for a reluctant reader.** Dragging a
construction and watching an invariant hold is the most compelling interaction in school
maths. But Euclid's register is severe, and a student who hates maths will not be won over
by a translated proposition from 300 BC. Byrne's diagrams are the way in, not his text.

---

## 4. Honest summary

| Topic | Boards exist | Commercial-safe source | Verdict |
|---|---|---|---|
| The Line | 21 | Good, verify licence | **Start here** |
| Functions & Trigonometry | 16 | Good, verify licence | Strong second, unblocks calculus |
| Probability & statistics | none | Good, verify licence | High value, needs a topic designed first |
| Geometry | none | Public domain only | Best interactions, hardest tone problem |

## 5. What to do before writing a single board

1. **Verify the licence** on each OpenStax title you intend to use. Per title. Record the
   licence and the attribution string in this file.
2. **Pull the live board titles** with `pnpm run audit:live-media`, so authoring fits the
   plan already in Supabase instead of inventing a parallel one.
3. **Decide the board format**: whether one source section becomes one board or several,
   and how sections map to floors. Getting this wrong is expensive after twenty boards.
4. **Decide where attribution lives.** CC BY obliges it, and it needs a home in the app
   before the first CC BY board ships, not after.

Only then author. On the evidence here that means The Line first, from OpenStax
Prealgebra, subject to its licence checking out.
