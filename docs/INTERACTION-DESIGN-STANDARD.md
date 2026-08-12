# Qubix interaction design standard

Use this standard for every board-level interaction. An interaction is a small
learning instrument, not decoration and not a miniature assessment.

## Admission rule

Add an interaction only when manipulating one or two quantities makes the
board's central relationship easier to understand. Historical, narrative,
definitional, and recap boards remain text-first unless manipulation reveals
something the prose cannot.

## Required anatomy

Every interaction must provide:

1. A human-readable model title. Never expose BB IDs or internal names.
2. One short experiment prompt describing what to change or compare.
3. A clearly framed simulation surface separated from the board prose.
4. Controls with visible labels, generous touch targets, and keyboard support.
5. A live readout that explains the consequence, not merely the raw value.
6. A reset action that restores the authored starting state.
7. A quiet usage hint. Do not compete with the lesson text.

## Visual language

- Match the Qubix warm neutral palette and subject accent variables.
- Use layered surfaces, fine borders, restrained shadows, and a subtle
  technical grid to create depth without visual noise.
- Use one accent for the manipulated quantity and the danger colour only for a
  genuine contrast, constraint, or second quantity.
- Prefer clear geometry and generous whitespace over labels inside diagrams.
- Keep typography hierarchical: small uppercase model label, concise title,
  secondary prompt, prominent result.
- Avoid novelty UI, emoji controls, glossy gradients, oversized handles, and
  decorative animation.

## Behaviour

- One changed control must produce immediate, meaningful feedback.
- Derived values and formulas must stay mathematically correct at every control
  extreme.
- Pointer interaction must not accidentally navigate between Reader boards.
- Respect `prefers-reduced-motion`; movement must never be required to read the
  result.
- Reset must restore sliders, toggles, and the explanatory readout together.

## Repetition across floors

- An interaction may reappear on later floors when the learner must reuse the
  same model to interpret a formula, compare a new case, or verify a conclusion.
- Repeat at a deliberate learning turn, not automatically on every floor.
- Change the prompt to match the later floor while keeping the model visually
  and behaviourally consistent.
- Do not repeat an interaction on consecutive floors when the prose adds no new
  operation or interpretation.

## Responsive and accessible quality bar

- Design for a 390 px phone first, then verify the wider three-board Reader.
- Stack paired controls on narrow screens and keep every control at least 44 px
  tall where practical.
- Keep diagrams legible without horizontal scrolling.
- Every input needs an accessible label; button state must be communicated with
  `aria-pressed` when appropriate; live results use clear text.
- Focus indicators must remain visible in light and dark themes.

## Technical media rule

Graphs, geometry, particles, circuits, quantities, and labelled scientific
models remain deterministic SVG, HTML/CSS, canvas, or Three.js. Do not use
generated raster imagery for exact technical information.
