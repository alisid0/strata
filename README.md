# Strata — Physics, layer by layer

A swipeable, tap-to-descend physics microlearning deck. Each card is one idea; tapping "dig in" descends through deeper layers of the same idea (concrete picture → definition → the law). Swiping moves across ideas. Styled as hand-drawn chalk on a green board.

## Run it

It's a static site. No build step.

```bash
# from the project root
python3 -m http.server 8000
# open http://localhost:8000
```

Or open `index.html` directly in a browser — but serve it over http if images or fonts misbehave under `file://`.

## Structure

```
strata-project/
├── index.html        # the published deck (11 cards, illustrated)
├── images/           # chalkboard illustrations, one per card
│   ├── card-01.png   # card N's illustration -> images/card-NN.png
│   └── ...
└── draft/
    └── index.html    # unedited remainder (calculus thread onward) — NOT publishable yet
```

The card-to-image link is by filename: card number `N` loads `images/card-NN.png` (zero-padded). To change an illustration, replace the PNG; no code change needed.

## How the deck works (the layer model)

Each card is a `C(...)` entry in the `DECK` array inside `index.html`:

```js
C(act, kicker, title, [layer0, layer1, layer2, layer3], img)
```

- **act** — `"I"`, `"II"`, etc. Groups cards into sections.
- **kicker** — e.g. `"Card 07"`. Display label.
- **title** — shown on text layers.
- **layers** — array of HTML strings, one per depth. `null` skips that depth. Depth 0 = the swipe card; deeper = "dig in" levels.
- **img** — optional `"images/card-NN.png"`. When present, **depth 0 shows the image full-bleed** instead of text; deeper layers render their text normally.

Navigation:
- **Swipe ← / →** (or arrow keys, or on-screen arrows) moves across cards.
- **Tap "dig in" / ↓** descends a layer. **↑** ascends.
- The left-edge dot ladder shows current depth. "Bedrock reached" = no deeper layer.

## Editing content

All copy lives in the `DECK` array in `index.html`. Cards are numbered sequentially; if you add or remove one, renumber the `"Card NN"` kickers so they stay continuous (the counter and progress bar derive their total from `DECK.length` automatically, so those need no manual update).

## Status

- `index.html` — **edited and publishable** (cards 1–11, Acts I–II: motion, force, energy).
- `draft/index.html` — **draft only**, written in an earlier voice, not yet edited. Covers the calculus thread, the inverse-square laws, and the closing act. Needs the same editing pass before publishing.

## Notes / known constraints

- Handwritten fonts (Kalam, Patrick Hand, Architects Daughter) load from Google Fonts at runtime — needs internet on first load, then cached. To go fully offline, self-host the fonts and update the `<link>` in `index.html`.
- Images are landscape; cards are portrait-ish. They're set to `contain` (whole image always visible, may letterbox) rather than `cover` (fills, crops). Change `.card-image { background-size }` in the CSS to switch.
- No backend, no storage, no external JS dependencies beyond the fonts.
