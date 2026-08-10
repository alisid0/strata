# Claude Handoff — Interactive Material Plan

> Generated: 2026-08-02 | Based on full production audit and codebase walkthrough

This is a phased execution plan for creating interactive material across the
Qubix curriculum. Every section tells you what exists, what's missing, which
files control it, and the exact steps to add more.

---

## Current state: the hard numbers

```
429 total boards (lessons) across 40 topics
304 boards (71%) have ZERO authored text floors ← PLACEHOLDERS
125 boards have at least some text content
 56 boards have Three.js 3D interactive media (all chemistry)
  3 boards have pixel-art scenes
  1 board has a concept explorer (system design)
 30+ interactive workshop components exist across all subjects
 16 Solve First discovery workshops mapped to Learn First pairs
```

| Subject | Boards | With text | With 3D media | Placeholder |
|---|---:|---:|---:|---:|
| Mathematics | 109 | **0** | 0 | **109** |
| Physics | 121 | 44 | 0 | 77 |
| Chemistry | 99 | 22 | 56 | 77 |
| Computing | 100 | 59 | 0 | 41 |

The 7 bundle-only topics (68 boards — Electricity, Thermo, Optics, Structure &
Reactions, Quantitative Chem, AI-era, AI Behind the Curtain) have generic 4-floor
bundled text but NO Three.js media and NO Supabase rows.

---

## The interactive toolkit (what you can deploy right now)

All of these are production-ready components. You don't need to build new ones —
just wire existing boards to existing components by adding entries.

### 1. Three.js 3D scenes (`src/lib/components/media/ThreeScene.svelte`)

Wire via `src/lib/content/boardMedia.js`. Supported `kind` values:

| Kind | What it renders | Example usage |
|---|---|---|
| `atom` | Electron shells around a nucleus | `{ kind:'atom', symbol:'Na', shells:[2,8,1] }` |
| `molecule` | Rotatable 3D molecule | `{ kind:'molecule', formula:'CH₄', shape:'tetrahedral', center:'C', ligand:'H', count:4 }` |
| `nucleus` | Proton/neutron cluster | `{ kind:'nucleus', protons:6, neutrons:6, label:'C-12' }` |
| `isotopes` | Side-by-side isotope comparison | `{ kind:'isotopes', isotopes:[{label,protons,neutrons},...] }` |
| `lattice` | Ionic crystal lattice (NaCl etc.) | `{ kind:'lattice', a:'Na', b:'Cl', size:3 }` |
| `ionic-transfer` | Electron transfer animation | `{ kind:'ionic-transfer', from:'Na', to:'Cl', product:'Na+ + Cl-' }` |
| `covalent-share` | Shared electron pair visualization | `{ kind:'covalent-share', atom:'O', pairs:2 }` |
| `metallic-sea` | Delocalised electron sea | `{ kind:'metallic-sea', title:'...' }` |
| `polarity` | Dipole moment visualization | `{ kind:'polarity', title:'...' }` |
| `hydrogen-bonds` | Intermolecular H-bond network | `{ kind:'hydrogen-bonds', title:'...' }` |
| `dna-helix` | Double helix | `{ kind:'dna-helix', title:'...' }` |
| `protein-alpha-helix` | Protein secondary structure | `{ kind:'protein-alpha-helix', title:'...' }` |
| `molecule-gallery` | Rotating gallery of geometries | `{ kind:'molecule-gallery', title:'...' }` |
| `lone-pair-geometry` | VSEPR with lone pairs | `{ kind:'lone-pair-geometry', title:'...' }` |
| `water-lone-pairs` | H₂O with two lone pairs | `{ kind:'water-lone-pairs', title:'...' }` |
| `atom-scale` | Nucleus-vs-atom scale comparison | `{ kind:'atom-scale', title:'...' }` |
| `atomic-structure` | Generic atomic model | `{ kind:'atomic-structure', title:'...' }` |
| `electric-attraction` | +/- charge attraction | `{ kind:'electric-attraction', title:'...' }` |
| `ion-charge-builder` | Proton/electron charge counter | `{ kind:'ion-charge-builder', protons:11, electrons:10 }` |
| `mole-scale` | Avogadro's number visualization | `{ kind:'mole-scale', title:'...' }` |
| `mass-moles` | n = m/M bridge | `{ kind:'mass-moles', equation:'n = m / M' }` |
| `isotope-average` | Weighted average display | `{ kind:'isotope-average', result:'Cl average = 35.5' }` |
| `carbon-architecture` | Carbon bonding diversity | `{ kind:'carbon-architecture', title:'...' }` |
| `nucleus-forces` | Strong force vs EM repulsion | `{ kind:'nucleus-forces', title:'...' }` |
| `proton-transfer` | Acid-base proton exchange | `{ kind:'proton-transfer', title:'...' }` |
| `covalent-network` | Diamond/graphite networks | `{ kind:'covalent-network', title:'...' }` |
| `structure-comparison` | Side-by-side structure types | `{ kind:'structure-comparison', title:'...' }` |
| `field` | Electric/magnetic field lines | `{ kind:'field', charges:[{x,y,z,q},...] }` |
| `vectors` | Vector addition/cross/components | `{ kind:'vectors', mode:'add' }` |
| `waves` | Traveling/standing/interference | `{ kind:'waves', mode:'traveling' }` |
| `solid-revolution` | Volumes of revolution | `{ kind:'solid-revolution', shape:'paraboloid' }` |

### 2. Interactive concept explorers (`src/lib/components/media/ConceptExplorer.svelte`)

Currently used only on board 1285 (bottlenecks). Supported kinds: `pipeline`.
Add more kinds by extending the component — it accepts `{ type:'concept-explorer',
spec:{ kind, primary, secondary, prompt } }`.

### 3. Pixel-art scenes (`src/lib/components/media/PixelMathScene.svelte`)

Used on boards 1094 (atom foil experiment), 1023 (inertia seatbelt), 1285 (road
bottleneck). Wired via `boardMedia.js` as `{ type:'img', src:'/images/pixel/...' }`.
The pixel art is pre-rendered, not generated live — create new scenes as PNG/WebP
and place them under `public/images/pixel/`.

### 4. Workshop components (`src/lib/components/assessments/`)

~60 interactive workshop and Solve First components. Each is a self-contained
Svelte component with its own game loop, scoring, and feedback. New workshops
are created by:
1. Writing a new `src/lib/components/assessments/YourLab.svelte`
2. Registering it in `src/views/WorkshopLab.svelte` (TRACKS → modules)
3. Adding practice items to `src/lib/content/workshops2.js` or a new file

### 5. Solve First discovery workshops (`src/lib/components/assessments/SolveFirst*.svelte`)

16 discovery workshops exist:
- SolveFirstCoordinates, SolveFirstDifferentiation, SolveFirstMatrices,
  SolveFirstTrigonometry, SolveFirstVectorRace, SolveFirstForces,
  SolveFirstOhm, SolveFirstProjectile, SolveFirstNetworks,
  SolveFirstMemory, SolveFirstBayes, SolveFirstOrbitArchitect,
  SolveFirstPolarAegis, SolveFirstSignalHacker

Each pairs with a Learn First workshop module. To add a new one:
1. Create `SolveFirstYourTopic.svelte` following the pattern in existing ones
2. Register in `src/lib/content/workshops2.js` SOLVE_FIRST registry
3. Add the pairing entry in the `pairedJourneys` computation in WorkshopLab.svelte

---

## Phase 1: Author text floors for placeholder boards (HIGHEST IMPACT)

**Status:** 304 of 429 boards have no text content. This is the single biggest gap.

### Priority A: Mathematics (109 boards, ALL placeholder)

Maths has ZERO authored content — every board is a title with no text. This is
the most critical gap because the starting topic "The Line" is the first thing
new users see.

**Files to edit:**
- `content-drafts/` — authoring material. Create per-topic JSON batches.
- Supabase `cards` table — final destination. Ingest via the review pipeline.
- `src/lib/content/functionBoards.js` / `matrixBoards.js` / etc. — bundle
  fallback (can be used as a temporary home while Supabase rows are created).

**Workflow for each topic:**
1. Read the board titles from `.audit-cache/full-catalogue.md` or `live-production-bbs.json`
2. For each board, write 3–5 floors (paragraphs) of instructional text
3. Format as a JSON batch following the pattern in `content-drafts/atom-intro-batch-01.json`
4. Ingest into staging Supabase via the review pipeline
5. Verify in the Reader at `http://localhost:8000/`

**Maths topic priority order (what users see first):**

| Order | Topic | Boards | Current state |
|---|---:|---|---|
| 1 | The Line (LINE_001) | 21 | 3 boards have floors, 18 are placeholder |
| 2 | Coordinate maps (MATH_COORD_MAPS) | 13 | All placeholder |
| 3 | Coordinate geometry (MATH_COORD) | 15 | All placeholder |
| 4 | Functions (MATH_FUNCTIONS) | 10 | All placeholder |
| 5 | Lines & gradients (MATH_LINEAR_GRAPHS) | 10 | All placeholder |
| 6 | Exponents & logarithms (MATH_EXP_LOGS) | 10 | All placeholder |
| 7 | Matrices (MATH_MATRICES) | 8 | All placeholder |
| 8 | Trigonometry (MATH_TRIG_ADV) | 6 | All placeholder |
| 9 | Limits (MATH_LIMITS) | 8 | All placeholder |
| 10 | Differentiation (MATH_DIFF) | 8 | All placeholder |

### Priority B: Physics (77 placeholder boards)

Physics has 44 boards with content and 77 without. The fully-authored topics are:
- Units & dimensions (1000–1012): all 13 have text
- The starting topic PHYS_001 (1139–1148): all placeholder
- Forces & Newton's laws: all placeholder
- Motion foundations: all placeholder

**Start with the starting topic PHYS_001 (10 boards)** since it's the first
thing Physics learners see.

### Priority C: Chemistry and Computing (118 placeholder boards)

Chemistry already has the strongest interactive coverage (56 Three.js boards).
Computing has partial coverage — some boards have text, others don't. Focus on
the starting topics: ATOM_001 has 17 boards (some with content), BIT_001 has 16.

---

## Phase 2: Wire Three.js 3D media to existing boards

**Status:** 56 chemistry boards have 3D media. Physics, maths, and computing
have ZERO. Many 3D kinds are built but not wired to any board.

### Immediate wins (no new components needed):

**Physics — wire existing `field`, `vectors`, and `waves` kinds:**
- `field`: Electric fields for the Electricity topic (boards 1323–1332).
  `{ kind:'field', charges:[{x:0,y:0,z:0,q:1},{x:2,y:0,z:0,q:-1}], title:'Electric field around a dipole' }`
- `vectors`: Vector addition for Motion foundations.
  `{ kind:'vectors', mode:'add', title:'Adding displacement vectors' }`
- `waves`: For Optics (boards 1391–1396).
  `{ kind:'waves', mode:'interference', title:'Two-slit interference pattern' }`

**Maths — wire `vectors`, `solid-revolution`, and `waves`:**
- `vectors`: Cross product for Matrices topic.
  `{ kind:'vectors', mode:'cross', title:'Cross product of two vectors' }`
- `solid-revolution`: Volumes for Differentiation/Limits.
  `{ kind:'solid-revolution', shape:'paraboloid', title:'Solid formed by revolving y=x²' }`
- `waves`: Sine/cosine for Trigonometry.
  `{ kind:'waves', mode:'traveling', title:'Traveling sine wave' }`

**Computing — no existing 3D kinds directly apply.** Consider adding new kinds:
- `circuit`: Simple circuit visualization (AND/OR gates from The Bit)
- `network-topology`: Node graph for networks topic

**File to edit:** `src/lib/content/boardMedia.js` — add entries keyed by board
number → floor index → `{ type:'three', spec:{ kind, ... } }`.

---

## Phase 3: Create new workshop modules for uncovered topics

**Status:** Workshops exist for most major topics, but these topics lack workshop coverage:

| Topic | Has Learn First? | Has Solve First? |
|---|---|---|
| Physics: Energy & momentum | ❌ | ❌ |
| Physics: SI units & scale | Partial (UnitDimensionCheck) | ❌ |
| Physics: Measurement limits | ❌ | ❌ |
| Physics: Foundations & frontiers | ❌ | ❌ |
| Computing: Code & command line | ❌ | ❌ |
| Computing: Hardware & memory | Partial (BitMachineLab) | Partial (SolveFirstMemory) |
| Computing: System design basics | ❌ | ❌ |

### To add a new Learn First workshop:
1. Create `src/lib/components/assessments/YourNewLab.svelte` (follow the pattern
   of `FunctionMachineLab.svelte` — it uses `LabShell.svelte` as its wrapper)
2. Add practice items: 6+ multiple-choice or interactive scenarios
3. Register in `src/views/WorkshopLab.svelte` `TRACKS` object under the right subject
4. Optionally add Series II items in `src/lib/content/workshops2.js`

### To add a new Solve First discovery:
1. Create `src/lib/components/assessments/SolveFirstYourTopic.svelte`
   (follow `SolveFirstCoordinates.svelte` — mission briefing → levels → reveal)
2. Register in the SOLVE_FIRST array in `src/lib/content/workshops2.js`
3. Add the pairing in `WorkshopLab.svelte`'s `pairedJourneys`

---

## Phase 4: Fill the bundle-only topics (68 boards)

These 7 topics exist only as code-bundle fallbacks with generic 4-floor text.
They need Supabase rows AND interactive media.

| Topic | Boards | What it needs |
|---|---|---|
| PHY_ELECTRICITY | 10 | Supabase text + `field` 3D + Ohm's Law workshop exists |
| PHY_THERMO | 15 | Supabase text + `waves` (heat) or new 3D kind |
| PHY_OPTICS | 6 | Supabase text + `waves` (interference/diffraction) |
| CHEM_STRUCTURE_REACTIONS | 10 | Supabase text (workshops: BondLab, EquationBalancer) |
| CHEM_QUANT | 6 | Supabase text + `mass-moles` 3D + workshop exists |
| COMP_AI_ERA | 20 | Supabase text (no 3D applicable yet) |
| COMP_AI_BEHIND | 1 | Supabase text (single board) |

---

## Phase 5: Extend boardMedia.js with new interactive kinds

New Three.js kinds that would fill specific curriculum gaps:

| New kind | For which topic | Visual purpose |
|---|---|---|
| `circuit` | The Bit / Electricity | Draggable AND/OR gates with water-pipe analogy |
| `number-line` | The Line / Coordinate geometry | Interactive number line with draggable points |
| `function-plot` | Functions / Differentiation | Live f(x) plot with draggable tangent line |
| `matrix-transform` | Matrices | 2D grid that warps under matrix multiplication |
| `probability-spinner` | Probability (roadmap) | Spinning wheel with settling frequency counter |
| `newton-cradle` | Forces / Energy-momentum | Collision visualization |
| `ray-optics` | Optics | Light ray reflection/refraction with draggable mirror/lens |

Each new kind requires:
1. A new branch in `src/lib/components/media/ThreeScene.svelte` (add a
   `{#if spec.kind === 'your-kind'}` block)
2. The corresponding Three.js geometry/animation logic
3. An entry in `boardMedia.js` wiring it to a specific board+floor

---

## Quick-start: what to do in the next session

### If you have 1 hour:
```
1. Author text for "The Line" boards 1080–1093 (14 boards, ~3 floors each)
   → Use content-drafts/ JSON batch format
   → Ingest into staging Supabase
   → Verify in Reader

2. Wire `vectors` 3D kind to Motion foundations board 1159 (Scalars and Vectors)
   → Add to boardMedia.js: 1159: { 0: { type:'three', spec:{ kind:'vectors', mode:'add', title:'Adding vectors' } } }
```

### If you have 3 hours:
```
1. All of the above, plus:
2. Author text for PHYS_001 (10 boards — the Physics starting topic)
3. Wire `field` 3D to Electricity boards 1323, 1325
4. Wire `waves` 3D to Optics boards 1391, 1394
5. Create a "Code & command line" workshop using LabShell pattern
```

### If you have a full day:
```
1. Complete text authoring for ALL maths boards (109 boards)
2. Wire 3D media for all applicable physics boards
3. Create 2 new Solve First workshops for Energy & momentum
4. Ingest the 68 bundle-only boards into Supabase with proper text
```

---

## Key files reference

| File | Purpose |
|---|---|
| `src/lib/content/paths.js` | Defines which board numbers belong to which topic |
| `src/lib/content/boardMedia.js` | Maps board+floor → interactive media (Three.js, pixel, concept explorer) |
| `src/lib/content/functionBoards.js` | Bundle fallback boards (text content) |
| `src/lib/content/workshops2.js` | Workshop practice items and Solve First registry |
| `src/views/WorkshopLab.svelte` | TRACKS registry, pairing logic, workshop orchestration |
| `src/lib/components/media/ThreeScene.svelte` | Three.js 3D renderer (add new kinds here) |
| `src/lib/components/media/ConceptExplorer.svelte` | Interactive concept explorer (add new kinds here) |
| `src/lib/components/assessments/LabShell.svelte` | Wrapper shell for Learn First workshops |
| `src/lib/components/assessments/ArcadeShell.svelte` | Wrapper shell for Solve First workshops |
| `scripts/ingest-final-review.mjs` | Ingests JSON batches into Supabase |
| `.audit-cache/live-production-bbs.json` | Current production state (run `npm run audit:live-media`) |
| `.audit-cache/full-catalogue.md` | Human-readable board catalogue (run `node scripts/summarize-catalogue.mjs`) |
| `content-drafts/` | Authoring material and JSON batches |
| `supabase/` | Database schema, migrations, RLS policies |

---

## Rules (from AGENTS.md, non-negotiable)

1. **Raster images/GIFs:** visible real-world scenes and narrative analogies ONLY.
   NEVER generate raster formulae, graphs, particle diagrams, bonds, circuits,
   labels, quantities, or exact technical geometry.
2. **Technical visuals:** must use deterministic Manim, SVG, canvas, or Three.js.
3. **Run `pnpm run audit:live-media`** before reporting catalogue/coverage numbers.
4. **Supabase BB edits are independent of Git.** Don't assume a Git push updates
   content.
5. **Production deploy is manual.** Pushing Git does not update the public app.
6. **Staging and production use separate Supabase projects.** Test on staging first.
