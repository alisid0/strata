# BB Authoring Template

Submit one BB at a time. Fill all fields. Follow the editorial voice in `CONTENT.md`.

## Format

Copy this whole block, fill it in, and submit via:
- **App:** https://strata-nine-pi.vercel.app/ → Author tab
- **GitHub PR:** add to `src/lib/content/deck.js`
- **Form:** [Google Sheets → Apps Script → Supabase]

---

```json
{
  "title": "Write the title here — plain language, no jargon",
  "subject": "physics|maths|chemistry",
  "topic": "forces|energy|calculus|trigonometry|...",
  "concept": "key concepts, semicolon-separated",
  "tier": "g0",
  "buildsOn": ["Card 05", "Card 14"],
  "floors": [
    "<p>Floor 0 (Idea): The swipe card. One paragraph. Start with something observable — a bus, a ball, a straw in water.</p>",
    "<p>Floor 1 (Concrete): A real scenario showing the idea in action. Use 'you' or a named character.</p>",
    "<p>Floor 2 (Definition): The textbook version. Clean, single-sentence definition. Formula here if applicable.</p>",
    "<p>Floor 3 (In action): Where it's applied, what it predicts, what it explains. Real-world examples.</p>",
    "<p>Floor 4 (The law / bedrock): Full formal statement, formula box, edge cases. Not every BB needs all 5 floors. Use null to skip.</p>"
  ],
  "imagePrompt": "Describe the chalkboard illustration. Landscape. Chalk on dark green board. Keep it to one clear diagram."
}
```

## Floor rules

| Floor | Purpose | Length | When to skip |
|-------|---------|--------|-------------|
| 0 | Idea — swipe card, hook, one-line statement | 1-3 sentences | Never |
| 1 | Concrete — real scenario, observable | 2-4 sentences | Shallow ideas complete at floor 0 |
| 2 | Definition — textbook, formula introduced | 1 paragraph | If floor 1 already defines it |
| 3 | In action — applications, predictions | 1-2 paragraphs | Optional |
| 4 | The law — formal statement, edge cases | 1 paragraph | Optional |

Use `null` to skip floors. A BB can be complete at floor 1 or 2.

## Editorial voice (mandatory)

- Start with the observable — something the reader can see or has noticed
- Plain definitions, concrete scenarios over clever metaphors
- No hype: cut "timeless," "revolutionary," "fascinating," "mind-blowing"
- Mechanism over assertion — show the step that makes it work
- Minimal bold — only the first use of the named term
- No em-dash stacking — short clean sentences
- One earned philosophical line allowed, sparingly

## Tags guide

| Field | Purpose | Example |
|-------|---------|---------|
| `subject` | physics, maths, or chemistry | `"physics"` |
| `topic` | narrow grouping | `"mechanics"`, `"calculus"`, `"trigonometry"`, `"coordinate-geometry"` |
| `concept` | semicolons, kebab-case | `"inertia; newtons-first-law"` |
| `tier` | always g0 for now | `"g0"` |
| `buildsOn` | prerequisite card labels | `["Card 06", "Card 21"]` |

## Image prompt guide

Describe what the chalkboard illustration should show. Use the established style:
> Hand-drawn white chalk on dark green chalkboard (#1f3b30). Rough imperfect lines with faint dust. Simple, clear, diagrammatic — a teacher's quick board sketch. Off-white chalk for main lines; pale yellow (#f2d585) and pale green (#a9d6a0) for emphasis. No photography, no realism. Flat educational diagram. Generous empty board space. 1:1 square.

Specify the content: "A chalk number line with 0 at centre, a point at 3 labelled in yellow, and a point at -1 labelled in green."

## Card numbering

Don't assign a card number yourself. Cards are numbered sequentially. The reviewer will slot your BB in and renumber everything.
