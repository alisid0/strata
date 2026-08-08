# Figures in chapters I to V

OCR recovers none of these. They exist only as ink in the scan, so this is a separate
job from the text extraction.

`figures/` holds reference crops taken from the 300 dpi renders. They are for looking
at while redrawing, not for use in the product. See the note at the bottom.

## What is there

| Fig. | Book page | What it shows | Crop | Checked by eye |
|---|---|---|---|---|
| 1 | 6 | A plain square, both sides labelled `x` | `book-p06.png` | yes |
| 2, 3 | 7 | The same square grown by `dx`: two strips and the corner `(dx)²`, drawn at a large `dx` and then a small one | `book-p07-fullpage.png` | no |
| 4 | 10 | Diagram for relative growings | `book-p10.png` | no |
| 5 | 11 | Right triangle `O`, `A`, `B`, with braces marking `x` along the base and `y` up the side, and a second sloping line showing the growth | `book-p11.png` | yes |
| — | 22 | Boxed table: `y` against `dy/dx`, giving `x²→2x`, `x³→3x²`, `x⁴→4x³` | `book-p22.png` | yes |
| 6 | 28, 29 | A pair of graphs side by side, `y` against `x` on the left and `dy/dx` against `x` on the right, joined by dashed construction lines | `book-p28.png`, `book-p29-fullpage.png` | partly |

Two crops are whole pages because the figures span nearly the full text width and my
band detector could not isolate them. `book-p28.png` is clipped at the bottom. Neither
matters much, since these are only reference.

## Automatic detection did not work well

Worth recording so nobody repeats it. Finding figures by looking for bands of ink
narrower than the text column catches boxed tables and displayed equations too, and
misses any figure that spans the full width. Adding a test for regular line spacing to
tell prose from diagrams still left about a third of the hits wrong.

The reliable method turned out to be the obvious one: the text says "Fig. 1" and so on,
so grep the OCR for figure references, note which book pages they fall on, and crop
those pages. Six figures in five chapters, found in one command.

## These must be redrawn, not pasted in

`CLAUDE.md` in this repo is explicit: technical visuals, meaning graphs, formulae,
geometry, labels and quantities, must be deterministic SVG, canvas or Three.js, and
generated text must never be baked into raster frames. A 1910 bilevel scan of a hand
drawn square is exactly what that rule exists to prevent.

So every one of these becomes an SVG. That is not a loss. Redrawn, they can carry live
labels, respond to a slider and re-theme for dark mode, none of which a scan can do.

One is already done. Chapter 1 of the course redraws Figs. 1 to 3 as a single live SVG
where dragging `dx` shrinks the strips and the corner together, and the corner's share
of the gain is reported as a number. That is the model for the rest.

Remaining to draw: Fig. 4, Fig. 5, Fig. 6, and the table from page 22, which should be
an HTML table rather than a picture of one.
