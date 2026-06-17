# AUTHORING.md — The Loop: content creation process

This is how every BB gets written. The author (you) does not need to be an expert in the topic. The process is designed so that if *you* can learn it and explain it, a student encountering it for the first time can too.

---

## The Loop

```
Instance 1 → Instance 2 → (Instance 3) → Draft 1 → Draft 2 → Draft 3
                                                                    ↓ if failed
                                                               restart loop
```

Three attempts at drafting. Three loops maximum before a topic is shelved and restarted fresh.

---

## Before you begin: prerequisite check

Every BB sits on top of others. Before running the Loop, flag which BBs must come first (the `buildsOn` list). If those BBs don't exist yet, write them first. Snell's Law, for example, requires BBs on waves, mediums, and the speed of light — without those, the Loop will stall.

---

## Instance 1 — intuition and knowledge probe

**No formula. No textbook definition. No technical terms introduced yet.**

AI asks 3 questions that test:
- What the author already knows or has observed in everyday life
- Where their intuition is right (confirm it)
- Where the gap is (note it, don't fill it yet)

Questions should be grounded in something *observable* — a straw in water, a fish, a marching band. Never open with the abstract. Find the foothold first.

AI marks what's right, what's close, and what's missing — then moves to Instance 2.

---

## Instance 2 — textbook definition + Q&A

AI gives the clean, single-sentence textbook definition of the topic plus the formula (if one exists).

Author asks any questions until it clicks. AI answers plainly — no hype, no over-explaining.

When the author says **"done"**, both Instance 1 and Instance 2 are marked complete.

---

## Instance 3 — deep clarification (optional, author-triggered)

For complex topics only. Author says "trigger Instance 3."

AI goes deeper: edge cases, why the formula works mechanically, what breaks the rule and why.

Not every topic needs this. Most won't.

---

## Draft phase

Once instances are complete, the author gives the first draft — typed or dictated, rough is fine.

### Draft 1
Author's own words. AI notes:
- What works (keep it)
- What's factually off (flag and fix)
- What's editorial/hype (cut it)
- What's missing (the observable hook, usually)

AI proposes Draft 2 based on the feedback.

### Draft 2
AI's polish of the author's words — same structure, tighter language.
Author approves, adjusts, or rejects.

### Draft 3
Final pass if needed. If this still doesn't land, the loop restarts from Instance 1.

---

## Editorial rules (apply to every draft)

These come from `CONTENT.md` and apply without exception:

- **Start with the observable.** The hook is always something the reader can see or has already noticed — the straw, the fish, the crumple zone. Name the law *after* the phenomenon, never before.
- **No hype.** Cut "timeless," "revolutionary," "proven," "fascinating." The mechanism speaks for itself.
- **Plain definitions.** One clean sentence. Not a paragraph.
- **Mechanism over assertion.** Don't say "it works this way." Show the step that makes it work.
- **Minimal bold.** Only the first use of the named term being introduced.
- **No em-dash stacking.** Short sentences over compound clauses.

---

## What the final BB looks like

| Floor | Content |
|-------|---------|
| 0 | The swipe card — the hook + one-line statement of what the law/idea is. No formula. |
| 1 | The concrete — a real scenario that shows the idea in action. |
| 2 | The definition — the clean textbook version, formula introduced here if applicable. |
| 3 | In action — where it's applied, what it predicts, what it explains. |
| 4 | The law / bedrock — the full formal statement, edge cases, what breaks it. |

Not every BB needs all 5 Floors. Shallow ideas are complete at Floor 1 or 2.

---

## Example — Snell's Law (completed loop)

**Instance 1 findings:**
- Author knew: refraction = bending (not bouncing), fish appears in wrong position, material controls the bend
- Author's gap: didn't know what the refractive index (n) was or what the angles were measured from

**Instance 2 Q&A:**
- Clarified: the normal (imaginary perpendicular line), angle of incidence, angle of refraction, refractive index as "how much the material slows light"
- Flag raised: Snell's Law assumes prior BBs on waves, mediums, speed of light — those are missing prerequisites

**Draft 1 (author):**
> "Like all the other laws of physics we have a timeless and proven law for reflection and refraction. Angle of incidence and angle of refraction have a relationship that can be expressed as their angles. It is called Snell's law."

**Issues found:** mixed in reflection (wrong), used hype ("timeless and proven"), no observable hook.

**Draft 2 (final — Floor 0):**
> A straw in a glass of water looks bent at the surface. A fish underwater isn't where it appears to be. Both are the same thing happening: light bending as it crosses from one material into another.
>
> The angle it comes in at and the angle it bends to have an exact, predictable relationship. That relationship is Snell's Law.
