# CLAUDE.md — read this first

This is **Strata**, a static, hand-built physics microlearning deck (swipe across ideas, tap to descend through layers). Chalk-on-greenboard aesthetic. No framework, no build step.

## Read these before editing, in order

1. **`README.md`** — what it is, how to run, the layer/card model.
2. **`CONTENT.md`** — every published card mapped, the **editorial voice**, and what was deliberately cut/merged (do not re-add those).
3. **`DESIGN.md`** — the exact visual system (colour tokens, fonts, chalk-texture rules) and the illustration spec for new images.
4. **`PATHS.md`** — the curated path map (cards → paths → subjects) and the **mastery-tracking system** spec (six progression states, three values). Design only so far; has OPEN DECISIONS to resolve with the author before building.

## Hard rules (keep future work in sync with the preset)

- **All content lives in the `DECK` array in `index.html`.** Card shape: `C(act, kicker, title, [layers], img)`. Layer 0 = swipe card (shows image if present); deeper layers = dig-in text. `null` skips a layer.
- **Use the CSS variables in `:root`** for every colour. Never hard-code hex outside the tokens. Never introduce a new font — the three hand fonts are fixed.
- **Match the editorial voice in `CONTENT.md`**: plain definitions, concrete scenarios, no editorialising/hype, mechanism over assertion, minimal bold, kill em-dash stacking and cute parallelism.
- **New illustrations** follow the prompt + conventions in `DESIGN.md`, landscape, saved as `images/card-NN.png`. The card links to its image purely by filename.
- **Renumber `"Card NN"` kickers** to stay continuous after add/remove. The counter and progress bar derive their total from `DECK.length`, so don't hand-edit those.
- **Don't break the two-axis interaction** (← → across cards, ↓ ↑ through layers) or the depth-ladder behaviour.
- **`draft/index.html` is not publishable.** It's the earlier-voice remainder (calculus → inverse-square → closing). When working it, apply the `CONTENT.md` voice and consider consolidating thin cards into fewer deeper ones (as was done with the bus card). It still needs a card that cleanly names differentiation vs integration and that they are inverse operations.

## Run

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Serve from the project root so `images/` resolves. Opening `index.html` over `file://` may not load images/fonts reliably.

## Current state

- `index.html`: edited & publishable, 11 illustrated cards (Acts I–II: motion, force, energy).
- `draft/index.html`: 31 draft cards, unedited.
- All 11 published cards have a matching `images/card-NN.png`, verified.
