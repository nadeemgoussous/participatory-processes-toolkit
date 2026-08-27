# Decision log

One short entry per architectural decision — what changed, why, and what it costs. Add an
entry when you change something structural (schema, response pipeline, AI tiers, storage,
deployment, or one of the product invariants in `CLAUDE.md` §1). Keep entries append-only:
supersede rather than rewrite.

Format:

```
## YYYY-MM-DD — Title
**Status:** accepted | superseded by <entry> | reverted
**Context:** the problem
**Decision:** what was chosen
**Consequences:** what this costs or forecloses
```

---

## 2025-01 — Milestone-based, unit-tagged scenario schema
**Status:** superseded by 2026-08-27 — Pivot to a digital toolkit (scenario model removed)
**Context:** The original flat schema (`milestoneYears: number[]` plus
`supply.capacity.<technology>: Record<year, number>`) assumed a fixed technology list and
fixed units. Real model exports — SPLAT in particular — did not fit, and hand entry took far
longer than the five-minute target.
**Decision:** `ScenarioInput` became `metadata` + `milestones: MilestoneData[]`, each
milestone holding unit-tagged values over an aggregated `TechnologyMix`
(renewables / fossil / storage / other), with optional per-technology detail in
`detailedTech`.
**Consequences:** Import is tolerant of any model and any units, and quick entry is 7-10
fields per milestone. Jobs and land use for aggregate-only scenarios rely on fixed default
technology shares (see `docs/DATA-SCHEMAS.md`). Several Playwright specs still carry
fixtures in the old shape and fail — see `docs/KNOWN-GAPS.md` §5.

## 2025-12 — Rule-based responses stay primary; AI is only ever an enhancement
**Status:** superseded by 2026-08-27 — Pivot to a digital toolkit
**Context:** Workshop venues cannot be relied on for connectivity, and small local models
produce weak output often enough that they cannot be load-bearing.
**Decision:** `generateEnhancedResponse` always produces a complete response first. AI tiers
(WebLLM → Ollama → cloud) may replace it, but each returns `null` on any failure and control
falls through silently. Echo detection rejects responses that parrot the prompt.
**Consequences:** The tool is never blocked and never shows an AI error. The cost is that a
lot of code exists for a tier most users never see, and the AI path is hard to test.

## 2025-12 — SmolLM2-1.7B over WebGPU as the browser model
**Status:** superseded by 2026-08-27 — Pivot to a digital toolkit
**Context:** Participants cannot install software, and the tool must work offline after
first load.
**Decision:** WebLLM with `SmolLM2-1.7B-Instruct-q4f16_1-MLC` (~1.8 GB, cached in the
browser), few-shot prompted per stakeholder; Ollama with the same model for facilitators.
**Consequences:** Zero installation and true offline inference after one download, at the
cost of Chrome/Edge 113+ (WebGPU), a large first download, and 5-15 s per response. The
static import also puts the WebLLM runtime in the main bundle — see `docs/KNOWN-GAPS.md` §3.

## 2026-02 — Generated response library plus a hand-written selector
**Status:** superseded by 2026-08-27 — Pivot to a digital toolkit
**Context:** Template responses repeated noticeably within a single session and read
mechanically.
**Decision:** Split the library into generated data (`src/data/response-library.ts`, built by
`scripts/build-response-library.cjs`, 182 deduplicated templates) and hand-written selection
logic (`src/data/template-selector.ts`): Gaussian proximity scoring with per-stakeholder
sigma, recency decay, Fisher-Yates shuffle bags, `{?key:text}` conditional blocks and
`{~a|b|c}` inline variation.
**Consequences:** Much more varied output, verified by `npm run test:quality`. The library
file must never be hand-edited, and grammar-safety now depends on the interpolation cleanup
rules.

## 2026-08-26 — Documentation reset
**Status:** accepted
**Context:** `CLAUDE.md` and several docs described a schema, a Tailwind version, an AI
cloud tier and a test suite that no longer matched the code, so following them produced
broken work.
**Decision:** Rewrote `CLAUDE.md` as a short operating manual describing what is actually in
the repo; re-verified `DATA-SCHEMAS.md`, `UI-DESIGN.md`, `TECHNICAL-IMPLEMENTATION.md` and
`WEBLLM-STATUS.md` against the code; added `docs/README.md` (index with a Current /
Reference / Archived status per file), `docs/KNOWN-GAPS.md` (reproduced defects) and this
log; moved superseded plans to `docs/archive/`.
**Consequences:** Docs now carry a "last verified" date and are expected to be updated in the
same change as the code they describe. Anything that cannot be verified quickly gets demoted
to Reference or archived rather than left to rot.

## 2026-08-27 — Pivot to a digital toolkit: remove the AI tiers, the prediction loop and the scenario model
**Status:** accepted
**Context:** The tool had grown into a scenario simulator wrapped around the IRENA
*Participatory Processes* toolkit. That carried a 6.6 MB first-load bundle, three runtime
dependencies, a WebLLM tier that only ever ran for a minority of participants, an Ollama
tier that only works under `npm run dev`, and a cloud tier that was never implemented
(`docs/KNOWN-GAPS.md` §1-3). It also gated the toolkit content — the part with lasting
value — behind importing a scenario, which very few people reaching the tool will do.
The goal is now a light, shareable digital edition of the toolkit itself: something a
planner opens, uses to plan a participatory process, and passes on.
**Decision:** Remove the simulation layer entirely — the AI tiers and WebLLM
(`stakeholder-ai.ts`, `useWebLLM.ts`, `stakeholder-fewshot.ts`, `ModelLoadingProgress`),
the response engine (`response-library.ts`, `template-selector.ts`, `stakeholder-rules.ts`,
`stakeholder-enhancements.ts`), the predict-before-reveal flow and `StakeholderTab`, the
scenario model (`types/scenario.ts`, `calculations.ts`, `csv-parser.ts`, `unit-conversions.ts`,
`ScenarioContext`, Dexie/`db.ts`, the input tab), the Explore tab and
`sentiment-calculator.ts`, and the scenario-derived Communicate views
(`CommunityImpactCalculator`, `ScenarioComparison`, `ExportGuidance`). Drop
`@mlc-ai/web-llm`, `dexie` and `recharts`; React is the only remaining runtime dependency.

Keep and build on the digitised toolkit content: `stakeholder-profiles.ts` (ch 3),
`case-studies.ts` (ch 5), the three `dissemination-*.ts` files (ch 4.3), `glossary.ts`, and
the components already independent of scenario state (`CaseStudyBrowser`,
`RelatedCaseStudies`, `DisseminationTips`).

Digitise what is missing and is needed for a toolkit edition: ch 4.1 (workshops, surveys,
interviews), ch 4.2 (steering committees, working groups, networks/hubs), and the ch 4 tool
selection decision framework.

Adopt the toolkit's own four-phase process — framing, development, validation,
communication — as the app's spine, and add a **participatory process checklist** as the
primary working surface. Items are derived verbatim from the toolkit (ch 4 prerequisites and
resource requirements, ch 3 good practices, ch 5 lessons learnt, the ch 4 decision framework,
ch 6 challenges), each carrying its source reference. Three ways to navigate: by phase (the
checklist), by objective (ch 4 Step 4's objective → tool mapping), and by stakeholder.

**Consequences:**
- Invariant 3 (predict-before-reveal) in `CLAUDE.md` §1 is withdrawn — there is no simulated
  stakeholder response left to predict. Invariant 2 (no shadow model) is satisfied trivially:
  nothing is calculated at all. Invariant 1 (offline-first) becomes easy rather than hard.
- ~13 700 of 20 222 lines of `src/` are deleted, and the first-load bundle is expected to
  fall from 6.6 MB to roughly 200 KB.
- The rule-based response engine — 182 templates with Gaussian scoring and a passing quality
  gate, the best-tested asset in the repo — is discarded. Salvaged from it: each profile's
  `typicalQuestions` and concern text survive as static "what this group will likely ask you"
  content, needing no scenario and no generation. `npm run test:quality` and
  `scripts/build-response-library.cjs` go with the engine.
- Checklist state needs persistence. Dexie is replaced by `localStorage` plus JSON
  export/import, which also closes F034 (session export). A print stylesheet gives PDF output
  with no dependency.
- ~35 of the 47 Playwright specs test removed features and are deleted rather than repaired,
  which resolves most of `docs/KNOWN-GAPS.md` §5 by subtraction.
- A checklist UI has to answer the toolkit's own warning about "box-ticking" exercises
  (ch 6): every item carries a free-text note beside the tick, and a phase is not marked
  complete on ticks alone.
- Superseded: the 2025-12 AI-enhancement and SmolLM2 decisions, and the 2026-02 response
  library decision.
