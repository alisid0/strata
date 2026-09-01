# Qubix University — redesigned learning flow

**Status:** Canonical curriculum blueprint  
**Version:** 1.1 — live-material revision  
**Date:** 1 September 2026

## The fixed flow

Qubix should begin with the material that exists: one shared data foundation, three valid entry doors, one common Analyst standard, and role-based branches. Stage 0 digital literacy is deferred until Qubix has complete reading and play material for it.

```text
                         ┌────────────▼────────────┐
                         │ Shared Data Truths      │
                         │ grain · units · blanks  │
                         │ keys · provenance       │
                         └────────────┬────────────┘
                                      │
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
        ┌────────▼────────┐  ┌────────▼────────┐  ┌────────▼────────┐
        │ Concepts door   │  │ Python door     │  │ SQL door        │
        │ meaning first   │  │ code first      │  │ tables first    │
        └────────┬────────┘  └────────┬────────┘  └────────┬────────┘
                 │                    │                    │
                 └────────────────────┼────────────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ Analyst floor           │
                         │ evidence → decision     │
                         └────────────┬────────────┘
                                      │
             ┌────────────────────────┼────────────────────────┐
             │                        │                        │
     ┌───────▼───────┐       ┌────────▼────────┐      ┌────────▼────────┐
     │ Analyst / BI  │       │ Data Engineer   │      │ Data Scientist  │
     │ Phase 9       │       │ Phases 10–11    │      │ Phases 12–14    │
     └───────────────┘       └────────┬────────┘      └────────┬────────┘
                                      │                        │
                                      └───────────┬────────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │ ML Engineer     │
                                         │ selected 10–15  │
                                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │ Leadership      │
                                         │ Phase 16        │
                                         └─────────────────┘
```

This replaces the misleading idea that every learner must progress through every phase in one long line. The phase numbers remain useful as a knowledge map, but the learner journey branches after the Analyst floor.

## 1. Content-status system

Every curriculum item must display one of four states.

| Status | Meaning | Current examples |
|---|---|---|
| **LIVE** | Complete learning material that can be studied now | Reading Chapters 1–8, 21 Superstore missions, current library works, mathematics pilot |
| **REFERENCE** | Supporting explanation or definition, not a full course | Wiki glossary, graph atlas, book/reference list |
| **ROADMAP** | A named topic in the 379-topic curriculum map without a complete Qubix lesson | Most Phase 7–16 topic entries |
| **PLANNED** | A future volume, chapter or role game | Volumes I–IV where unwritten; incomplete role games |

Roadmap topics must never be presented as completed lessons. Planned material must never contribute to completion percentages for a currently available course.

## 2. Deferred — Stage 0 digital foundation

### Purpose

Stage 0 is **not part of the current live learner journey**. Qubix does not yet have the paired reading and play material needed to teach or assess it consistently. Its proposed topics remain in the roadmap, but the visible course begins with Shared Data Truths.

Stage 0 should be reconsidered only when Qubix has complete lessons, practical exercises and a reliable diagnostic. Until then, do not show it as a prerequisite, progress requirement or locked stage.

### Diagnostic

A learner passes Stage 0 by completing these tasks without step-by-step help:

1. Open, locate, rename and save a file.
2. Follow a link and recognise an unsafe or irrelevant download.
3. Open a spreadsheet and identify a row, column, cell, label, number and date.
4. Use a calculator and retain the expression used.
5. Follow a short multi-step instruction and check the result.
6. Explain a simple answer in one clear sentence.
7. Identify personal information that should not be shared.
8. Attribute the source of a claim.

### Assigned modules when needed

**Block 0A — Computer confidence**

- What a computer program does
- Keyboard, mouse, touch and accessibility
- Files, folders and extensions
- Opening, saving, copying and finding files
- Browsers, links and safe downloads
- Accounts, passwords and multifactor authentication
- Plain text, documents and spreadsheets

**Block 0B — Learning and safety**

- Following multi-step instructions
- Checking work instead of guessing
- Breaking problems into smaller questions
- Recognising patterns
- Asking useful questions
- Explaining answers in plain language
- Learning from feedback
- Study habits and spaced practice
- Digital privacy
- Academic honesty and source attribution

### Future exit standard

The learner can operate the learning environment safely and independently. Stage 0 does **not** yet certify data literacy.

**Current status:** Deferred; excluded from live progress.

## 3. Shared Data Truths — the live starting point

Every learner starts here. No learner enters Concepts, Python or SQL without this common foundation.

### Fixed experience rhythm

Every topic is displayed as a pair: **Read → Play**.

- If both halves exist, both are active and the learner completes them in order.
- If reading exists but play does not, reading remains available and the play card is greyed out as “not built”.
- If play exists but reading does not, play remains visible but its reading card is greyed out as “not written”.
- A missing half never blocks unrelated live material.
- Disabled cards never count toward progress.

### Core questions

1. What happened in the world?
2. What did the system record?
3. What does one row represent?
4. What does each value measure?
5. Is an empty value zero, unknown, pending or not applicable?
6. Which fields identify a record?
7. Where did the value come from?
8. What can the evidence honestly support?

### Required live material

| Sequence | Reading | Mission | Required idea |
|---|---|---|---|
| 1 | Ch.1.1 — A sale is not its record | Process a Sale | Event versus record; observed, stored and derived values |
| 2 | Ch.1.2 — Rows and columns | Read the Table | Row and column meaning |
| 3 | Ch.1.3 — What one row represents | What Does One Row Represent? | Grain |
| 4 | Ch.1.4 — Zero, blank or missing? | Missing Values Are Not Zero | Missingness semantics |
| 5 | Ch.2.1 — Every number needs a unit | Units and Measurement | Units and measurement |
| 6 | Ch.2.2 — Ratios, rates and percentages | The Rate Desk | Denominators and comparison |
| 7 | Ch.3.2 — A postcode and a price | Classify Store Data | Categorical and quantitative values |
| 8 | Ch.3.3 — Does one row mean one sale or one product? | Keys and Duplicate Records | Keys, uniqueness and duplicates |
| 9 | Ch.3.4 — Where did this number come from? | Trace the Number | Provenance and transformation |

### Exit test

Given a new Superstore table, the learner must:

- State its grain in one sentence.
- Identify its units and denominators.
- Classify important fields.
- Explain how NULL/blank values should be interpreted.
- Propose a candidate key.
- Identify a possible duplicate without deleting it blindly.
- Trace one reported value to its source.
- State one claim the table supports and one it does not.

**Estimated time:** 3–5 weeks.

## 4. Choose an entry door

All three doors are legitimate. A door changes the order of learning, not the final Analyst standard.

| Door | Best for | First practical outcome |
|---|---|---|
| **Concepts** | Learners who want judgement and understanding before syntax | Frame and answer a defensible data question |
| **Python** | Learners motivated by programming and notebooks | Load, inspect, clean and explain a table reproducibly |
| **SQL** | Learners comfortable with spreadsheets, tables or databases | Query relational data without corrupting its grain |

## 5. Door A — Concepts first

### A1. Numbers that carry meaning

**Topics**

- Signed numbers, fractions, decimals and percentages
- Ratios, rates and proportions
- Units and dimensional reasoning
- Variables and algebraic expressions
- Absolute, relative and rate-of-change comparisons
- Tables, rules, functions and graphs

**Live sequence**

1. Reading Chapter 2
2. Missions: Units and Measurement; SUM(quantity); The Rate Desk
3. Mathematics pilot through “One Change Against Another”
4. “Two Points, Almost Touching” is a later bridge to calculus, not a beginner exit requirement.

### A2. Data quality and evidence

**Topics**

- Cases, observations, variables and values
- Measurement scales
- Discrete and continuous values
- Dates, times and durations
- Validity, consistency, accuracy and precision
- Measurement error and collection bias
- Metadata, lineage and quality dimensions
- Privacy, consent and minimisation

**Live sequence**

1. Reading Chapter 3
2. Missions: Classify Store Data; Keys and Duplicate Records; Trace the Number

### A3. Describe before modelling

**Topics**

- Frequency, relative frequency and cumulative frequency
- Distribution shape
- Mean, median and mode
- Range, IQR, variance and standard deviation
- Quantiles, skewness and outliers
- Grouped summaries and comparisons
- Correlation as description, not causation
- Chart choice, scale, labels and misleading presentation

**Live sequence**

1. Reading Chapter 4, Sessions 1–4
2. Missions: The Distribution Desk; What Does It Cost?; The Chart Clinic

### A4. Chance, samples and claims

**Live core**

- Reading Ch.4.5 — population, sample and frame
- Reading Ch.4.6 — probability language
- Reading Chapter 8 — conditioning, estimation, confidence intervals, hypothesis tests, p-values and practical significance
- Missions: The Sampling Desk; Analyst Decision Desk

**Roadmap enrichment**

- Bayes’ theorem
- Common probability distributions
- Law of large numbers
- Central limit theorem
- Bootstrap methods
- Statistical power and sample-size planning
- Multiple comparisons
- A/B testing and sequential testing

These roadmap topics must be labelled as enrichment until complete Qubix lessons exist.

### A5. Tool bridge

Concepts-first learners now complete:

1. SQL Door B1–B3.
2. Python Door C1–C2.

They may move faster because the conceptual foundation is already established, but they must pass the same tool exit tests.

## 6. Door B — SQL first

### B1. Ask a table a question

**Topics**

- Relational tables and schemas
- Primary and foreign keys
- Cardinality and relationship types
- SELECT, WHERE and ORDER BY
- Calculated columns and CASE
- NULL semantics
- Aggregation, GROUP BY and HAVING

**Live sequence**

1. Reading Ch.5.1–5.2
2. Missions: The SQL Console; The Region That Wasn’t

**Fixed rule:** after every GROUP BY, the learner must write: “One row now represents …”

### B2. Join without multiplying reality

**Topics**

- Inner, outer and cross joins
- Join grain and fanout
- Subqueries and common table expressions
- Set operations
- Window functions
- Date and string functions
- Views

**Live sequence**

1. Reading Ch.5.3
2. Mission: Join Without Changing the Grain

**Superstore practice order**

1. `sale` + `sale_line`
2. `product` + `price_history`
3. `inventory_snapshot` + `stock_movement`
4. `promotion` + `promotion_product` + `branch`

Before executing a join, the learner predicts the expected row count and possible fanout. Afterward, the learner checks both.

### B3. Trust and release the result

**Topics**

- Result grain and boundaries
- NULL behaviour
- Control totals and reconciliation
- Transactions and consistency
- Indexes and query plans at introductory depth
- Query preservation and reproducible release

**Live sequence**

1. Reading Ch.5.4
2. Mission: The Result Checkpoint

### SQL exit test

The learner can produce a query result and document:

- The business question.
- Source tables and join rules.
- Input and output grain.
- Filter boundaries.
- NULL behaviour.
- Expected versus actual row counts.
- Control totals.
- A concise interpretation and limitation.

### B4. Required completion after the SQL door

1. Python Door C1–C2.
2. Concepts A1, A3 and A4, using SQL results as evidence.

## 7. Door C — Python first

### C1. Python as a careful machine

**Topics**

- Values, names and types
- Variables and expressions
- Collections
- Conditions and loops
- Functions and modules
- Errors and exceptions
- Files and paths
- Testing and assertions
- Git and environments at introductory depth

**Live sequence**

1. Library: What a Computer Program Does
2. Reading Chapter 6
3. Mission: Read the Program

**Fixed rule:** learners trace state before running code. Prediction comes before execution.

### C2. Tables in code

**Roadmap topics with applied Superstore practice**

- NumPy arrays and vectorisation
- pandas Series and DataFrames
- Reading CSV, JSON and database data
- Selecting, filtering and sorting
- Grouping and aggregation
- Merging and reshaping
- Missing-data operations
- Dates and time series
- Data cleaning
- Exploratory analysis
- Statistical graphics
- Notebooks and reproducible reports
- Performance and memory basics

Every operation must carry a question:

| Operation | Required question |
|---|---|
| Filter | Which population and time boundary remain? |
| Group | What does one output row represent now? |
| Merge | Did the relationship multiply rows? |
| Fill missing values | What process produced the absence? |
| Convert type | What evidence says this is the correct type? |
| Calculate | What are the units and denominator? |
| Plot | What comparison is the chart intended to support? |

### Python exit test

The learner can create a reproducible notebook or script that:

- Loads a Superstore table without silently changing it.
- Inspects types, dimensions, keys and missingness.
- Cleans data while preserving raw inputs.
- Performs a grain-safe merge.
- Produces a checked summary and chart.
- Records assumptions and limitations.
- Runs from the beginning without manual cell corrections.

### C3. Required completion after the Python door

1. SQL Door B1–B3.
2. Concepts A1, A3 and A4, using notebooks for calculations and visualisation.

## 8. The Analyst floor — common merge point

No learner reaches a role branch until they meet this shared standard.

### D1. From request to defensible analysis

**Live material**

- Ch.1.5 — From a request to an analysis
- Ch.7.1 — A table someone can actually read
- Ch.7.2 — A chart that does not flatter
- Ch.7.3 — Separating what you found from what you think
- Ch.7.4 — Work somebody else can run
- Missions: The Chart Clinic; Analyst Decision Desk; The Handover Pack

### D2. Business decision foundation

**Roadmap topics**

- Business metric definitions
- Dimensions, facts and grain
- Filters, comparisons, targets and benchmarks
- Cohorts and funnels
- Retention and repeat behaviour
- Segmentation
- Same-store comparisons
- Promotion performance
- Inventory and stockout metrics
- Supplier service levels
- Labour and productivity metrics
- Finance and margin metrics
- Metric ownership
- Data storytelling
- Decision memos and recommendations

### D3. Analyst capstone

The learner receives an unclear Superstore decision request and must deliver:

1. A clarified question and decision owner.
2. Scope, population, period, grain, units and denominators.
3. A source and provenance map.
4. A checked SQL extraction.
5. A reproducible Python transformation or analysis.
6. A readable table.
7. A defensible chart.
8. Findings separated from interpretation and recommendation.
9. Uncertainty, limitations and alternative explanations.
10. A handover pack another learner can run.

### Analyst certification standard

A learner is ready to leave the Analyst floor only when they can:

- State grain without prompting.
- Preserve units and refuse an invalid denominator.
- Distinguish zero, missing, pending and not applicable.
- Explain keys and detect join fanout.
- Read and write foundation-level SQL.
- Reproduce tabular work in Python.
- Inspect distributions before summarising them.
- Separate association from causation.
- Communicate uncertainty and evidential limits.
- Hand work to another person successfully.

**Estimated total time from Shared Data Truths to Analyst certification:** 18–30 weeks at 6–8 focused hours per week.

## 9. Career branches after the Analyst floor

### Branch 1 — Analyst and business intelligence

**Primary phase:** Phase 9  
**Destination:** Analyst → Senior Analyst → Decision Scientist / BI specialist

**Emphasis**

- Metric systems and semantic consistency
- Dashboard design and information hierarchy
- Cohorts, funnels, retention and segmentation
- Commercial, inventory, supplier, labour and margin analysis
- Experiment interpretation
- Decision memos and stakeholder communication

**Exit product:** a governed business-performance system with owned metrics, reproducible queries and a decision narrative.

### Branch 2 — Analytics engineering

**Primary phase:** Phase 10  
**Destination:** Analytics Engineer

**Sequence**

1. Source, staging, intermediate and mart layers
2. Dimensional modelling and fact types
3. Conformed dimensions and surrogate keys
4. Snapshots and event tables
5. Incremental models and late-arriving data
6. Historical corrections and schema contracts
7. Transformation, freshness and completeness tests
8. Documentation and metric layers
9. Dependency graphs and review
10. Environments, reproducible builds and cost-aware transformations

**Exit product:** a tested analytical model that converts raw Superstore sources into documented, trusted marts.

### Branch 3 — Data engineering

**Prerequisite:** Analytics-engineering core  
**Primary phase:** Phase 11  
**Destination:** Data Engineer → Data Architect

**Sequence**

- Architecture; OLTP and OLAP
- Warehouses, lakes and lakehouses
- Formats and partitioning
- ETL/ELT and batch/stream processing
- Queues, event logs, APIs and ingestion
- Change data capture and orchestration
- Idempotency, retries and backfills
- Schema evolution and data contracts
- Quality gates, observability and lineage
- Access, secrets, encryption and retention
- Performance, cost and SLOs
- Incident response and postmortems

**Exit product:** a reliable, observable Superstore data pipeline with recovery, security and service objectives.

### Branch 4 — Data science

**Primary phases:** 12–14  
**Destination:** Data Scientist → Principal Data Scientist

**Mathematical bridge — Phase 12**

- Functions, graphs, slope, limits, derivatives and integrals
- Vectors, matrices, linear transformations and systems
- Rank, dot products, norms, distance and projections
- Eigenvalues, eigenvectors and SVD
- Partial derivatives, gradients and chain rule
- Loss functions, gradient descent, convexity and regularisation
- Numerical stability

**Model development — Phase 13**

- Problem framing and targets
- Training, validation and test design
- Baselines and feature engineering
- Regression and classification models
- Neighbours, trees, forests, boosting and SVMs
- Clustering and PCA
- Cross-validation and hyperparameter search
- Bias–variance, overfitting and regularisation
- Metrics, thresholds, calibration and imbalance
- Leakage, explanation, error analysis and model documentation

**Advanced decision science — Phase 14**

- Forecasting and backtesting
- Prediction intervals and intermittent demand
- Hierarchical forecasts and external regressors
- Causal impact and uplift
- Survival analysis
- Linear and integer optimisation
- Simulation and decisions under uncertainty

**Exit product:** a documented investigation whose model is validated against a baseline and whose uncertainty and decision consequences are explicit.

### Branch 5 — Machine learning engineering

**Prerequisites:** selected Analytics Engineering, Data Engineering, ML Mathematics and Model Development  
**Primary phase:** Phase 15  
**Destination:** ML Engineer → AI Engineer

**Sequence**

- Neural networks, activations, backpropagation and optimisation
- Convolutional, sequence and transformer systems
- Embeddings and representation learning
- Language models, prompting and structured outputs
- Retrieval, vector search, RAG and agents
- Multimodal systems and evaluation
- Training pipelines, feature stores, experiment tracking and registries
- Batch and online inference
- Containers, APIs, latency and throughput
- Monitoring, drift, shadow/canary release and rollback
- Privacy, fairness, robustness and explainability
- Model/system cards, governance and human oversight

**Exit product:** a monitored model service with evaluation, versioning, rollback and responsible-use controls.

## 10. Leadership is not the next beginner course

Phase 16 becomes available only after evidence of substantial work in at least one role branch.

**Readiness evidence**

- Multiple completed projects
- Experience reviewing other people’s work
- At least one operational incident or failed analysis examined honestly
- Experience explaining uncertainty to decision-makers
- Evidence of mentoring or technical leadership

**Leadership curriculum**

- Organisation-level problem framing and method choice
- Experiment, causal, forecasting and optimisation strategy
- Model portfolios and architecture review
- Data, feature and evaluation strategy
- Responsible AI, privacy and model-risk decisions
- Scientific standards and reproducibility
- Technical writing and executive communication
- Stakeholder negotiation and prioritisation
- Mentoring, hiring and competency frameworks
- Team design and incident leadership
- Build-versus-buy and return on investment
- Long-term data/AI strategy, governance and accountability
- Capstone from question to monitored production outcome

## 11. Fixed recurring bundles

These ideas must reappear together across every path.

| Bundle | Foundation | SQL/Python application | Analyst/advanced application |
|---|---|---|---|
| **Grain** | What one row represents | GROUP BY, joins, merges | Facts, dimensions, model targets |
| **Missingness** | Zero, unknown, pending, N/A | NULL and pandas missing operations | Imputation, bias and operational causes |
| **Units and denominators** | Measurement and rates | Calculated columns and metrics | Effect sizes, KPIs and model outputs |
| **Provenance** | Source and derivation | Queries, notebooks and lineage | Feature history, model versions and audit trails |
| **Distribution before summary** | Shape, centre and spread | EDA and grouped summaries | Model assumptions, drift and error analysis |
| **Join/merge safety** | Keys and relationships | Fanout and reconciliation | Feature joins and training/serving consistency |
| **Claim discipline** | Evidence limits | Checked outputs | Causality, uncertainty and responsible decisions |
| **Reproducibility** | Record the method | Saved SQL, code, versions and tests | Pipelines, deployment, monitoring and governance |

## 12. Superstore practice progression

The fictional company is the laboratory, not decoration.

1. **Tills / Checkout** — events, observations, lookup and derivation
2. **Aisles** — rows, columns, products and data types
3. **Stock Room** — grain, counts, snapshots and missingness
4. **Goods In** — units, conversions, suppliers and deliveries
5. **Customer/Rate work** — denominators, classification and identity
6. **Data Office** — SQL, joins, checks and Python execution
7. **Reporting** — distributions, weighted summaries, samples and charts
8. **Boardroom** — ambiguous questions, claims, decisions and handover
9. **Role Floors** — engineering, science and ML only after Analyst certification

Data-domain progression:

```text
sale → sale_line → product → price_history → inventory_snapshot
→ stock_movement → supplier/purchase_order/shipment
→ promotion exposure → governed analytical marts
→ feature_snapshot/model_version/prediction
```

The ML platform domain is unavailable to beginner learners except as a preview.

## 13. Recommended schedule

This schedule is indicative. Advancement is controlled by exit tests, not calendar completion.

| Period | Shared work | Concepts entry | Python entry | SQL entry |
|---|---|---|---|---|
| Weeks 1–5 | Shared Data Truths | Same | Same | Same |
| Weeks 6–10 | Entry door | A1–A3 | C1–C2 | B1–B3 |
| Weeks 11–15 | Close conceptual/tool gaps | A4 + SQL | A1/A3/A4 + SQL | A1/A3/A4 + Python |
| Weeks 16–20 | Complete second tool | Python | Finish SQL | Finish Python |
| Weeks 21–26 | Analyst floor and capstone | Same shared standard | Same shared standard | Same shared standard |
| Week 27+ | Choose a role branch | Analyst/BI, engineering, science or ML engineering | Same | Same |

Fast learners may finish the Analyst floor in approximately 18–22 weeks. Learners who need more repetition should expect approximately 24–30 weeks.

## 14. Website information architecture

### Primary navigation

1. **Start** — Shared Data Truths and the first Read → Play pair
2. **Learn** — readings organised by the redesigned flow
3. **Practise** — Superstore rooms and missions
4. **Paths** — Concepts, Python, SQL and role branches
5. **Reference** — wiki, glossary, graph atlas and library
6. **Progress** — completed outcomes, exit tests and next requirement

### Path page requirements

Every stage card must show:

- Purpose
- Prerequisites
- Content status
- Required readings
- Required missions
- Reference topics
- Exit test
- Estimated time range
- What it unlocks

### Progress rules

- Reading a page is not competence.
- A stage completes only when required missions and its exit test are complete.
- Planned and roadmap items never count toward live-course completion.
- Progress is recorded by demonstrated outcomes, not page visits.
- Changing doors preserves completed shared work.
- All three doors converge on the same Analyst certification requirements.

## 15. Naming corrections

Use these stable stage names throughout the site:

1. Stage 1 — Shared Data Truths
2. Door A — Concepts First
3. Door B — SQL First
4. Door C — Python First
5. Stage 2 — Analyst Floor
6. Branch I — Analyst and BI
7. Branch II — Analytics Engineering
8. Branch III — Data Engineering
9. Branch IV — Data Science
10. Branch V — Machine Learning Engineering
11. Professional Stage — Data and AI Leadership

Stage 0 — Digital Foundation remains a deferred roadmap item and is not shown in the live sequence.

Chapter 8, **Chance and Inference**, must be added to the homepage, course navigation and chapter totals. The public chapter count must be changed from seven to eight while retaining the correct total of 35 reading sessions.

## 16. The learner promise

> Start from where you are. Learn what a record can and cannot say. Use SQL and Python without losing the meaning of the data. Reach one shared Analyst standard, then choose the kind of data work you want to do.

## 17. Definition of done for the redesign

The flow is fixed when:

- Shared Data Truths is mandatory before all three doors.
- Every live topic follows a visible Read → Play rhythm.
- Missing read or play components remain greyed out and do not block available work.
- Concepts, SQL and Python have explicit prerequisites and exit tests.
- All doors converge on one Analyst floor.
- Career specialisations branch after Analyst certification.
- Leadership is experience-gated.
- Every curriculum item carries LIVE, REFERENCE, ROADMAP or PLANNED status.
- The homepage and navigation recognise all eight reading chapters.
- Roadmap topics are not mistaken for completed lessons.
- Progress measures demonstrated outcomes rather than page visits.
- Superstore rooms follow the learner’s increasing permission and competence.
- Grain, missingness, units, denominators, provenance, uncertainty, reproducibility and claim limits remain visible from the first sale to production AI.

This blueprint is the source of truth for the subsequent navigation, curriculum-data, learner-dashboard and progress-system redesign.
