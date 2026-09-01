# Claude handoff — Qubix University whole-site redesign

## Read this first

The user wants to consider the new **Qubix Learning Floor** prototype as the default visual and interaction language for the entire Qubix University site.

Do not immediately replace the production site. First inspect the existing Qubix source repository, identify its framework and content architecture, and prepare a safe migration plan that preserves every working lesson, mission, library page, wiki page and progress mechanism.

The prototype is a direction-setting implementation, not yet a complete replacement for the existing site.

## Primary objective

Redesign Qubix University around a consistent learner experience:

> **Read the idea. Play the consequence.**

Every subject should be presented as an alternating pair:

```text
Read → Play → Read → Play
```

When one half does not exist, keep its place visible but disabled:

- Reading exists, game absent → enable Read; grey out Play as **Not built**.
- Game exists, reading absent → grey out Read as **Not written**; keep Play visible according to the selected access rule.
- Both exist → enable both in sequence.
- Neither exists → show the topic only as roadmap/planned material.
- Missing material must not be counted toward live completion.

## Current prototype

Private deployed prototype:

- https://qubix-learning-floor.info-a4d6.chatgpt.site

Local prototype source:

- `C:\Users\ali10\Documents\Codex\2026-09-01\q\work\qubix-learning-flow`

Canonical curriculum blueprint:

- `C:\Users\ali10\Documents\Codex\2026-09-01\q\outputs\qubix-university-redesigned-learning-flow.md`

Complete topic audit:

- `C:\Users\ali10\Documents\Codex\2026-09-01\q\outputs\qubix-university-comprehensive-topic-index.md`

The prototype source is a single-page Vinext/React/Tailwind implementation generated through OpenAI Sites. It is useful as a visual and behavioural reference. The production Qubix site may use a different framework; preserve the production framework unless there is a strong, documented reason to migrate.

## Decisions already made with the user

These are current product decisions, not open design questions.

### 1. Stage 0 is deferred

Do not put the proposed digital-foundation diagnostic in the live path.

Reason: Qubix does not yet have complete paired reading and play material for it.

The live journey starts with **Shared Data Truths**. Stage 0 may remain in internal roadmap documents, but it must not appear as a prerequisite, locked stage or completion requirement.

### 2. Shared Data Truths is the universal starting point

Every learner completes this common foundation before choosing Concepts, Python or SQL.

### 3. Three doors alter order, not the final standard

The learner chooses an initial door:

- Concepts first
- Python first
- SQL first

The initial door affects motivation and sequence. Before reaching the Analyst floor, learners must complete the required foundation in all three areas.

### 4. All doors meet at the Analyst floor

The common Analyst standard requires the learner to:

- State grain and units.
- Reject an invalid denominator.
- Distinguish zero, unknown, pending and not applicable.
- Understand keys and join/merge fanout.
- Retrieve evidence with foundation-level SQL.
- Transform and check data reproducibly with Python.
- Inspect distributions before summarising them.
- Separate observation, interpretation and recommendation.
- Communicate uncertainty and evidential limits.
- Hand reproducible work to another person.

### 5. Career material branches after Analyst competence

Do not force all learners through one long sequence of engineering, mathematics, modelling and production.

Branches:

- Analyst and business intelligence
- Analytics engineering
- Data engineering
- Data science
- Machine learning engineering
- Leadership later, after meaningful professional experience

### 6. Incomplete material is shown honestly

Use visible grey/disabled states for unbuilt material. Do not hide the curriculum’s intended shape, but do not present roadmap entries as lessons.

## Curriculum structure

```text
Shared Data Truths
        │
        ├── Concepts first ──┐
        ├── Python first ────┼── Complete all three foundations
        └── SQL first ───────┘
                                  │
                                  ▼
                            Analyst floor
                                  │
            ┌─────────────┬───────┼────────┬──────────────┐
            ▼             ▼       ▼        ▼              ▼
       Analyst/BI   Analytics   Data      Data          ML
                    Engineer    Engineer  Scientist     Engineer
                                  │        │              │
                                  └────────┴──────────────┘
                                              │
                                         Leadership
```

## Shared Data Truths — exact live sequence

Each row is a Read → Play pair.

| Step | Idea | Read | Play |
|---|---|---|---|
| 01 | Event versus record | A sale is not its record | Process a Sale |
| 02 | Rows and columns | Rows and columns | Read the Table |
| 03 | Grain | What one row represents | What Does One Row Represent? |
| 04 | Missingness | Zero, blank or missing? | Missing Values Are Not Zero |
| 05 | Units | Every number needs a unit | Units and Measurement |
| 06 | Rates and denominators | Ratios, rates and percentages | The Rate Desk |
| 07 | Data types | A postcode and a price | Classify Store Data |
| 08 | Keys and duplicates | Does one row mean one sale or one product? | Keys and Duplicate Records |
| 09 | Provenance | Where did this number come from? | Trace the Number |

Exit outcome:

> Given an unfamiliar Superstore table, state its grain, units, denominator, missing-value meaning, candidate key and source; then say what it can and cannot support.

## Concepts-first door

| Step | Idea | Read | Play | Status note |
|---|---|---|---|---|
| C1 | Numbers and change | Numbers, Ratios and Change | SUM(quantity) | Live |
| C2 | Distributions | From values to a distribution | The Distribution Desk | Live |
| C3 | Centre and cost | Centre is a choice | What Does It Cost? | Live |
| C4 | Samples and boundaries | Who is in the data? | The Sampling Desk | Live |
| C5 | Chance and inference | Chance and Inference | Inference Investigation | Read live; play not built |

Additional wiki topics such as Bayes’ theorem, common probability distributions, LLN, CLT, bootstrap methods and statistical power are roadmap enrichment until full lessons exist.

## Python-first door

| Step | Idea | Read | Play | Status note |
|---|---|---|---|---|
| P1 | Values and types | Values, names and types | Classify Store Data | Live |
| P2 | Decisions and loops | Decisions and repetition | Read the Program | Live |
| P3 | Functions | Giving a piece of work a name | Function Workshop | Read live; play not built |
| P4 | Tables in code | Collections, and a table in code | Pandas Superstore Lab | Read live; play not built |
| P5 | Reproducible notebooks | Notebook practice | Reproducibility Lab | Neither built as a complete pair |

Future Python play should use real Superstore tables. Avoid disconnected toy exercises.

Every operation should prompt a meaning check:

- Filter → which population and boundary remain?
- Group → what does one output row represent now?
- Merge → did the relationship multiply rows?
- Missing operation → what process produced the absence?
- Type conversion → what evidence supports the type?
- Calculation → what are the units and denominator?
- Plot → what comparison should the chart support?

## SQL-first door

| Step | Idea | Read | Play | Status note |
|---|---|---|---|---|
| S1 | Select and filter | Asking a table a question | The SQL Console | Live |
| S2 | Group and count | Grouping changes the grain on purpose | The Region That Wasn’t | Live |
| S3 | Join safely | Joining without changing what a row is | Join Without Changing the Grain | Live |
| S4 | Verify and release | Checking a result before believing it | The Result Checkpoint | Live |

Required SQL rule:

> After every GROUP BY, the learner writes: “One row now represents …”

Required join practice order:

1. `sale` + `sale_line`
2. `product` + `price_history`
3. `inventory_snapshot` + `stock_movement`
4. `promotion` + `promotion_product` + `branch`

## Analyst floor

| Step | Idea | Read | Play | Status note |
|---|---|---|---|---|
| A1 | Readable evidence | A table someone can actually read | Readable Table Lab | Read live; play not built |
| A2 | Honest charts | A chart that does not flatter | The Chart Clinic | Live |
| A3 | Finding versus advice | Separating what you found from what you think | Analyst Decision Desk | Live |
| A4 | Reproducible handover | Work somebody else can run | The Handover Pack | Live |

The final Analyst capstone should require:

1. Clarified question and decision owner.
2. Scope, population, period, grain, units and denominators.
3. Source/provenance map.
4. Checked SQL extraction.
5. Reproducible Python transformation or analysis.
6. Readable result table.
7. Defensible chart.
8. Findings separated from interpretation and recommendation.
9. Uncertainty, limitations and alternative explanations.
10. Handover package another learner can run.

## Content-status model

The entire site should adopt four content states.

```ts
type ContentStatus = 'live' | 'reference' | 'roadmap' | 'planned';
```

Definitions:

- `live`: complete instructional content usable now.
- `reference`: supporting explanation or definition, not a full lesson.
- `roadmap`: named curriculum topic without a complete Qubix learning unit.
- `planned`: future volume, lesson or game.

Pair availability should be modelled separately from curriculum status:

```ts
type LearningAsset = {
  id: string;
  label: string;
  kind: 'read' | 'play';
  href?: string;
  status: ContentStatus;
};

type LearningPair = {
  id: string;
  sequence: number;
  idea: string;
  read: LearningAsset;
  play: LearningAsset;
  prerequisites?: string[];
  exitOutcome?: string;
};
```

Important: availability is determined by the asset having a real destination and `status === 'live'`. Never infer completion merely because the topic appears in the wiki.

## Progress rules

- Reading a page is not the same as demonstrating competence.
- A pair may record Read and Play separately.
- Disabled assets do not count in the denominator.
- Roadmap and planned material never lowers a learner’s live completion percentage.
- Changing the selected first door preserves all shared progress.
- A door may be marked “first” without permanently locking the other doors.
- Analyst-floor access requires defined foundation outcomes, not only page visits.
- Preserve the existing device-local progress system unless the user later requests accounts or cloud persistence.
- Any progress-data migration must be backward compatible or explicitly versioned.

Suggested progress shape:

```ts
type LearnerProgress = {
  schemaVersion: number;
  selectedDoor?: 'concepts' | 'python' | 'sql';
  completedAssetIds: string[];
  completedOutcomeIds: string[];
  lastVisitedAssetId?: string;
};
```

## Whole-site information architecture

Recommended primary navigation:

1. **Start** — current next Read or Play step
2. **Learn** — readings in the redesigned curriculum order
3. **Play** — Superstore floor and missions
4. **Paths** — Concepts, Python, SQL and role branches
5. **Reference** — Wiki, glossary, library and graph atlas
6. **Progress** — completed work, current pair and next requirement

Existing areas to preserve and restyle:

- Homepage
- Reading sessions
- Academy and missions
- Superstore rooms
- Wiki overview and 17 phases
- Glossary term pages
- Library index and library works
- Mathematics pilot
- Showcase
- Data console
- Campaign/story mode
- Role pages and planned role games

Do not merge reference content into the learning path indiscriminately. The wiki is broader than the current taught course.

## Suggested route architecture

Adapt these names to the existing framework rather than forcing a framework change.

```text
/
/start
/learn
/learn/[course]/chapter/[chapter]/session/[session]
/play
/play/missions/[mission]
/superstore
/superstore/rooms/[room]
/paths
/paths/concepts
/paths/python
/paths/sql
/paths/analyst
/paths/analytics-engineering
/paths/data-engineering
/paths/data-science
/paths/ml-engineering
/reference
/wiki
/wiki/phase/[phase]
/wiki/terms/[term]
/library
/library/[work]
/progress
```

Aliases or redirects may be needed to preserve current public URLs. Do not break existing links.

## Suggested component architecture

### Global components

- `QubixHeader`
- `PrimaryNavigation`
- `LearnerProgressSummary`
- `ContentStatusBadge`
- `DisabledAssetState`
- `QubixFooter`

### Learning-flow components

- `LearningRouteOverview`
- `LearningPairRow`
- `ReadCard`
- `PlayCard`
- `DoorSelector`
- `DoorOverviewCard`
- `ExitOutcomeCard`
- `AnalystStandardChecklist`
- `RoleBranchCard`

### Reading components

- `ReadingShell`
- `SessionRoute`
- `ConceptExplanation`
- `WorkedExample`
- `WorkbookPrompt`
- `FocusedCheck`
- `NextPlayPrompt`

### Play components

- `MissionShell`
- `MissionBrief`
- `EvidencePanel`
- `DecisionControls`
- `ConsequencePanel`
- `MissionDebrief`
- `ReturnToReadingPrompt`

Keep the alternating rhythm visible at the page level. A reading should end by pointing to its Play pair; a completed mission should return the learner to the next Read item.

## Visual system from the prototype

### Brand character

- Editorial rather than corporate-dashboard generic.
- Serious about evidence without feeling academic or intimidating.
- Retail-floor route cues: stations, paths, room progression and handoffs.
- High contrast and direct language.
- Disabled future material remains visible but quiet.

### Core palette

```css
--qubix-navy: #16243a;
--qubix-paper: #f6f3ec;
--qubix-paper-deep: #ebe7dd;
--qubix-orange: #ff6b35;
--qubix-teal: #58c7c5;
--qubix-lime: #b7e04a;
--qubix-border: #d6d0c4;
--qubix-muted: #78716c;
--qubix-disabled: #e7e5e4;
```

Colour roles:

- Navy: structure, primary reading identity, major surfaces.
- Orange: consequence/action/play and primary calls to action.
- Teal: merge points, successful outcomes and Analyst competence.
- Lime: orientation labels and selected-path highlights.
- Paper: main learning surface.
- Grey/dashed borders: unavailable or future material.

### Typography

- Current prototype uses Geist and Geist Mono.
- Headlines are heavy, tightly tracked and direct.
- Labels use small uppercase text with wide tracking.
- Sequence numbers use monospace.
- Body text should remain comfortable at 16–18 px with generous line height.

### Shape and spacing

- Rounded cards: 16–30 px depending on hierarchy.
- Pills for compact status labels, not for every piece of metadata.
- Strong whitespace between learning stages.
- Thin warm-grey borders.
- Avoid excessive shadows; use subtle depth for active cards only.
- Use dashed borders for incomplete assets.

### Motion

- Small lift on active lesson/mission cards.
- Fast, restrained door-selection transition.
- Respect `prefers-reduced-motion`.
- Do not animate unavailable cards.

## Responsive behaviour

Desktop pair layout:

```text
[sequence + idea] [Read card] → [Play card]
```

Mobile pair layout:

```text
[sequence + idea]
[Read card]
[Play card]
```

Requirements:

- The Read → Play order must remain obvious on mobile without relying only on colour.
- Door selection must be keyboard and touch accessible.
- Sticky navigation must not cover anchor targets.
- Disabled items must use `aria-disabled="true"` and must not be focusable as working links.
- Live cards require visible focus styles.
- All status meaning must have a textual label.
- Maintain at least WCAG AA contrast.

## Superstore progression

Use the fictional retailer as the learning laboratory:

1. Tills / Checkout — events, observation, lookup and derivation
2. Aisles — rows, columns, products and data types
3. Stock Room — grain, snapshots, counts and missingness
4. Goods In — units, conversions, suppliers and deliveries
5. Customer/rate work — denominators, classification and identity
6. Data Office — SQL, joins, result checks and Python execution
7. Reporting — distributions, weighted summaries, samples and charts
8. Boardroom — unclear questions, claims, recommendations and handover
9. Role Floors — engineering, science and ML after Analyst competence

Suggested data-domain order:

```text
sale
→ sale_line
→ product
→ price_history
→ inventory_snapshot
→ stock_movement
→ supplier / purchase_order / shipment
→ promotion exposure
→ governed analytical marts
→ feature_snapshot / model_version / prediction
```

The ML-platform domain should be preview-only for beginners.

## Known source/content discrepancy

The homepage currently describes seven chapters, but the sitemap contains eight chapters and 35 sessions. Chapter 8 is **Chance and Inference**, with four sessions.

Correct the homepage, course navigation and chapter count to eight while retaining the 35-session total.

Do not delete Chapter 8 because it is absent from the current homepage navigation.

## Migration approach

### Phase 1 — inventory the production code

1. Locate the actual Qubix source repository.
2. Read its project instructions and package scripts.
3. Identify framework, routing, curriculum-data files and progress storage.
4. Map existing routes against the 134-URL sitemap.
5. Identify shared layout and theme files.
6. Record dirty/uncommitted user changes and preserve them.

### Phase 2 — add the curriculum model

1. Introduce explicit `read`, `play`, `status` and prerequisite fields.
2. Build a migration layer from existing chapter/mission records.
3. Verify every live Read/Play destination.
4. Mark unavailable halves without inventing URLs.
5. Add tests for completion denominators and disabled states.

### Phase 3 — establish the new shell

1. Add the prototype colour and typography tokens.
2. Build the global header/navigation/footer.
3. Build the reusable pair, status and door components.
4. Redesign only the homepage/start route first.
5. Preserve all existing content routes behind the new shell.

### Phase 4 — reading and play loop

1. End every reading with its paired mission or disabled placeholder.
2. End every mission with the next reading.
3. Add clear current/previous/next route state.
4. Ensure progression works without an account.
5. Test Shared Data Truths end to end.

### Phase 5 — migrate secondary surfaces

Order:

1. Academy and mission catalogue
2. Superstore rooms
3. Reading chapter navigation
4. Path pages
5. Progress page
6. Wiki and glossary
7. Library
8. Showcase, pilot and tools

### Phase 6 — role branches

Show branch destinations after the Analyst floor, but preserve roadmap/planned status. Do not imply that incomplete role volumes are playable.

## Validation checklist

### Content

- All existing live reading sessions remain reachable.
- All 21 live missions remain reachable.
- All 24 glossary pages remain reachable.
- Wiki still exposes all 379 named topics.
- Library works remain available.
- Chapter 8 is included.
- No invented lesson or mission URL is enabled.

### Flow

- The first live stage is Shared Data Truths.
- Stage 0 is absent from live progress.
- Every topic is displayed as Read → Play.
- Missing halves are visibly disabled.
- Concepts, Python and SQL selection works.
- Completed shared material is not duplicated.
- All paths meet at the same Analyst standard.
- Role branches occur after the Analyst floor.

### Progress

- Disabled assets are excluded from percentages.
- Existing local progress is preserved or migrated.
- Selecting another door does not erase work.
- Direct links into readings and missions still work.

### Accessibility

- Full keyboard navigation.
- Correct landmark and heading structure.
- Visible focus.
- Textual state labels.
- Disabled elements are not interactive.
- Reduced-motion support.
- Mobile Read → Play order remains unambiguous.

### Technical

- Production build passes.
- Existing routes remain stable or have redirects.
- No console errors on primary routes.
- No broken internal links.
- Metadata and social-preview assets are correct.
- Sitemap reflects the redesigned information architecture.

## Definition of done

The whole-site redesign is complete when:

1. The new visual shell is applied consistently across the public site.
2. Shared Data Truths is the first learner experience.
3. All available curriculum is represented as alternating Read → Play pairs.
4. Missing assets are greyed out and excluded from completion.
5. Three entry doors work without fragmenting shared progress.
6. The Analyst floor has one explicit competency standard.
7. Role branches are clearly separated from the beginner path.
8. Wiki/reference breadth is preserved without pretending it is taught material.
9. Existing URLs, content and device-local progress remain safe.
10. Chapter 8 and the eight-chapter count are corrected.
11. Responsive and accessibility checks pass.
12. The production site can be completed end to end using the new reading/play rhythm.

## Instructions for Claude’s first turn

1. Read this file completely.
2. Read the two supporting Markdown files listed near the top.
3. Inspect the deployed prototype and its local source.
4. Locate the actual Qubix production repository; do not assume the prototype directory is production.
5. Read any repository-specific instructions.
6. Report the production framework, content-data locations, routing structure and progress-storage mechanism.
7. Propose the smallest safe first implementation slice: new theme tokens, shared pair components and the redesigned start/home route.
8. Preserve existing user changes and avoid destructive Git operations.
9. Do not rewrite all routes in the first pass.
10. Implement, verify and show the first coherent production slice before expanding the migration.

## Product sentence

If there is ever uncertainty about the redesign, return to this sentence:

> Qubix teaches what a record can and cannot say, lets the learner experience the consequence, and repeats that discipline from the first sale to production AI.
