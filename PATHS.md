# Paths & mastery system — spec for implementation

Status: **design only.** No code, storage, or quizzes built yet. This documents the structure so the data model, backend, and quizzes can be built against it. Cards live in `index.html` (the `DECK` array); this defines how they group into **paths** and how a learner's progress through a path is tracked.

---

## 1. Concept

- A **board** = one card in the deck (37 today).
- A **path** = a curated, ordered sequence of related boards — a coherent learning journey a student walks through. State and mastery attach to the **path**, not the individual board.
- Paths are grouped under three **subjects**: Physics, Maths, Chemistry.

Paths are **curated**, not auto-derived from the `topic` tag (raw tags fragment into single-card groups with gaps). The mapping below is the source of truth.

---

## 2. The path map (37 cards → 8 paths)

### Physics
**P1 · Forces & motion** — cards 3, 4, 5, 6, 7, 8, 9
Rocks don't move → friction → surface up close → F=ma → the bus → third law → stopping → crumple zones.

**P2 · Energy** — cards 10, 11
Energy → energy is never lost.

**P3 · Gravity** — card 16
Everything pulls on everything. *(stub; will grow)*

**P4 · Vectors & motion in 2D** — cards 21, 22, 23, 25, 26, 27, 28, 29
Vectors & scalars → resultants → resolving a diagonal → three accelerators → number line → the grid → falling rock → the perfect arc.

### Maths
**M1 · Getting infinitely close** — cards 12, 13, 14, 15
Limits → measuring a circle → functions → applying a limit.

**M2 · Trigonometry** — cards 17, 18, 19, 20, 24
What trig is → right triangle → sin/cos/tan → captain's problem → radians.

**M3 · Graphs & curves** — cards 26, 27, 30, 31, 32
Number line → the grid → Dot's parabola → Dash's line → the kissing curves.

### Chemistry
**C1 · Into the atom** — cards 33, 34, 35, 36, 37
Science of exceptions → the mole → elements → the atom → subatomic particles.

---

## 3. OPEN DECISIONS (not yet settled by the author — resolve before building)

1. **Can a card belong to more than one path?** Cards 26 & 27 (number line, the grid) are listed in BOTH P4 and M3, because the coordinate grid underpins projectile motion *and* graphing. Default assumed here: **yes, shared membership allowed.** If paths must be disjoint, 26/27 need a single home.
2. **Intro cards.** Cards 1 (The whole game) and 2 (Stuff takes up space) are currently in **no path** — treated as deck intro. Confirm: leave unpathed, or assign.
3. **Content redundancy across paths.** Card 25 (three accelerators) and Card 6 (the bus) both teach velocity/acceleration, split across P4 and P1. Author chose to keep both earlier; flagged here as intentional, confirm it stays.
4. Act tags in `index.html` are still provisional (chemistry sits under Act II "Energy"; cards 25–29 under Act I). Paths and acts are different axes — but a future restructure may want acts to mirror these paths.

---

## 4. Progression states (per path, per learner)

A path climbs these six states based on learner activity:

| State | Trigger |
|-------|---------|
| **Wandered** | Opened the path once. |
| **Checked** | Opened the string of related boards in the path. |
| **Well read** | Took the path's quiz once and passed once. |
| **Recalled** | Returned to the path ~7 days later. |
| **Mastered once** | Passed the quiz with ≥9/10. |
| **Mastered twice** | Recalled the whole path after ~28 days AND passed quiz ≥9/10. |

Notes for implementation:
- States are ordered; a learner progresses upward. (Decide: can a state be lost/decay if not recalled? Not specified yet.)
- "Quiz" does not exist yet — to be built later. States 3, 5, 6 depend on it.
- Time gaps (7 days, 28 days) imply per-path timestamps in the stored record.

---

## 5. The three values (to define precisely later)

Three metrics are to be derived per path (and presumably rolled up per subject / overall):

- **Reading value** — from opening / reading activity (Wandered, Checked, Recalled).
- **Testing value** — from quiz performance (Well read, Mastered once/twice).
- **Recall value** — from returning after time gaps and re-passing (Recalled, Mastered twice).

Exact formulas are **not yet specified.** Author to define how each state contributes to each value, and how the three combine into an overall mastery picture.

---

## 6. Storage (later)

Progress will be stored via a backend (not built yet). The per-learner record will need, per path: current state, timestamps of key events (first open, quiz passes, last recall), and quiz scores. Design the schema so the six states and three values can be computed from stored events rather than stored as flags only.

---

## 7. What to do next (for Claude Code)

1. Resolve the open decisions in §3 with the author.
2. Add a `paths` manifest (subject → path → ordered card numbers) — likely a separate JSON/JS object rather than per-card fields, so a card can join multiple paths.
3. Define the value formulas (§5) and the state-transition rules (§4) precisely.
4. Build quizzes (separate workstream) — states 3/5/6 unblock once quizzes exist.
5. Build the backend/storage (§6).
Do not hard-code progress in the browser; the deck (`index.html`) stays a pure content+render layer until the backend lands.
