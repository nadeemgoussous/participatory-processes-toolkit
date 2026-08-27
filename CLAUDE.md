# Scenario Dialogue Tool — Working Instructions

Interactive web app for IRENA capacity-building workshops. Energy planners import their
model results, then rehearse how nine stakeholder groups would react to them, and how to
communicate the scenario to each audience.

This file is the operating manual for anyone (human or agent) changing the code.
It describes **what is actually in the repo today**. When code and this file disagree,
fix one of them in the same change — do not leave them in conflict.

---

## 1. Non-negotiable product invariants

These three constraints drive nearly every design decision. Do not relax them without
recording the decision in `docs/DECISIONS.md`.

**1. Offline-first.** Workshop venues have unreliable internet. Rule-based responses,
data import, calculations and all four tabs must work with the network off. AI is a
bonus tier that fails silently — never a spinner, an error toast, or a blocked UI.

**2. No shadow model.** The tool must never contradict an energy system optimisation
model (MESSAGE, OSeMOSYS, LEAP, SPLAT). It calculates *soft metrics only*:

- Calculated: jobs (construction job-years, operations positions), land use (ha), CO2 from
  combustion, directional stakeholder sentiment
- Never calculated: LCOE, tariffs, reserve margin, VRE integration limits, reliability,
  dispatch, transmission constraints — these require the real model

Every view that shows a calculated number carries the disclaimer:

> ILLUSTRATIVE ESTIMATES ONLY — These figures show directional impacts for discussion
> purposes. They do NOT replace energy system optimization model analysis. Always verify
> feasibility in the full model.

**3. Predict-before-reveal.** The user must write a prediction (min. 20 characters)
before the simulated stakeholder response is revealed. The learning happens in the
comparison, so never add a path that skips straight to the answer.

---

## 2. Commands

Verified on Node 22 (Node 20+ required; CI pins 22).

```bash
npm install                 # first run
npm run dev                 # http://localhost:5173/stakeholder-dialogue/  <- note the base path
npm run typecheck           # tsc --noEmit  (fast; run before every commit)
npm run build               # tsc && vite build -> dist/ (~75 s, emits sw.js + workbox-*.js)
npm run preview             # serve dist/ locally

npm test                    # Playwright, all 4 browser projects (slow, verbose)
npm run test:chromium       # Chromium only — use this while iterating
npm test -- tests/e2e/17-stakeholder-tab.spec.ts --project=chromium   # single file

npm run test:quality        # scripts/test-response-quality.cjs — template QA, no browser, seconds
npm run responses:build     # regenerate src/data/response-library.ts from training data
```

**Testing policy:** Chromium-only while iterating; full multi-browser run before a commit
that touches CSS, layout, PWA or offline behaviour. `npm run test:quality` is cheap and
catches most rule-based response regressions — prefer it over Playwright for template work.

---

## 3. Architecture

React 19 + TypeScript (strict) + Vite 7, Tailwind **v4** (CSS-first, no `tailwind.config.js`),
Recharts, Dexie/IndexedDB, vite-plugin-pwa/Workbox, Playwright.

```
src/
├─ App.tsx                      four tabs: input | dialogue | explore | communicate
├─ context/ScenarioContext.tsx  single source of scenario state; auto-saves to IndexedDB (500 ms debounce)
├─ types/                       <- SOURCE OF TRUTH for data shapes
│   ├─ scenario.ts              ScenarioInput { metadata, milestones[], detailedTech? }
│   ├─ derived-metrics.ts       output of calculations.ts
│   └─ response.ts stakeholder.ts adjustments.ts case-study.ts
├─ data/                        content, not logic
│   ├─ stakeholder-profiles.ts       the 9 profiles + concern triggers
│   ├─ stakeholder-enhancements.ts   multi-metric triggers, dev-context, variants
│   ├─ response-library.ts           GENERATED — 182 templates. Never hand-edit; run responses:build
│   ├─ template-selector.ts          hand-written selection + interpolation (Gaussian scoring, shuffle bags)
│   ├─ stakeholder-fewshot.ts        few-shot examples for the LLM tiers
│   └─ dissemination-*.ts, case-studies.ts, glossary.ts, technology-factors.ts
├─ utils/
│   ├─ calculations.ts          soft metrics only (jobs, land, emissions, capacity, investment)
│   ├─ stakeholder-rules.ts     PRIMARY response generator — always available, offline
│   ├─ stakeholder-ai.ts        optional AI tiers + silent failover
│   ├─ sentiment-calculator.ts  directional sentiment for the Explore tab
│   ├─ csv-parser.ts            SPLAT / long-format CSV -> ScenarioInput
│   ├─ unit-conversions.ts      MW/GW, GWh/TWh, m$/B$, Mt/kt
│   └─ db.ts                    Dexie schema (scenarios, predictions, settings)
├─ hooks/       useWebLLM.ts, useOnlineStatus.ts
└─ components/  layout | input | stakeholder | prediction | calculator | output | common
```

`scripts/` holds Node maintenance tools (response-library build, quality tests, icon
generation, Ollama prompt testing). They are not part of the app bundle.

### Data model, in one paragraph

`ScenarioInput` is **milestone-based**: `metadata` plus `milestones: MilestoneData[]`,
where each milestone has a `year` and unit-tagged values (`capacity`, `generation`,
`reShare`, `investment`, `emissions`, `peakDemand`, plus optional `capacityAdditions`,
`annualOMCosts`, `curtailment`, `imports`). Technologies are aggregated into
`TechnologyMix { renewables, fossil, storage?, other? }`; granular per-technology data is
optional in `detailedTech`. An older flat schema (`milestoneYears` + `supply.capacity.<tech>`)
was replaced — if you meet it in a doc or test, that code is stale.
**Read `src/types/scenario.ts` before writing anything that touches scenario data.**

### Response pipeline

```
generateEnhancedResponse()              <- stakeholder-rules.ts, always runs, offline, <200 ms
  ├ template-selector.selectTemplate()     Gaussian proximity + recency decay, per-stakeholder sigma
  └ interpolateTemplate()                  {?key:text} conditional blocks, {~a|b|c} variation
        v optionally passed through
maybeEnhanceWithAI()                    <- stakeholder-ai.ts
  1. WebLLM   SmolLM2-1.7B-Instruct-q4f16_1-MLC, WebGPU, ~1.8 GB cached in browser
  2. Ollama   smollm2:1.7b via the Vite dev proxy /api/ollama  <- DEV SERVER ONLY (see KNOWN-GAPS)
  3. Cloud    STUB — enhanceWithCloudAPI() returns null; nothing is implemented
  4. Rule-based response returned unchanged
```

Every tier catches its own errors and returns `null` to fall through. The user only ever
sees a response.

---

## 4. Conventions

- **TypeScript strict**, `noUnusedLocals` / `noUnusedParameters` on. `npm run typecheck` must be clean.
- **Tailwind v4**: brand tokens live in `@theme` in `src/index.css` (`--color-irena-blue`,
  `--color-stakeholder-*`). There is no `tailwind.config.js` — do not create one.
- **No new runtime dependencies** without a clear reason; the bundle already ships WebLLM.
  Prefer zero-dependency solutions (see the SVG-to-canvas JPG export in `ScenarioPreview.tsx`).
- **Generated files** (`src/data/response-library.ts`) are regenerated, never edited.
- **Base path is `/stakeholder-dialogue/`** (GitHub Pages). Any absolute asset URL must
  include it, or use Vite's `import.meta.env.BASE_URL`.
- **Never ship an API key in the client bundle.** A cloud AI tier, if built, goes through a
  proxy the user controls — `VITE_*` variables are public.
- **Commits**: conventional prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `test:`).
  Leave the tree committable; typecheck before committing.
- **Comments** explain *why*, matching the density already in the file.

---

## 5. How to work in this repo

Read `claude-progress.txt` (current state, one page) and `git log --oneline -20` first.

**Small change / one feature:** pick the next failing item in `feature_list.json`, implement
it, test it (Chromium first), set only its `passes` field to `true`, commit, append a short
entry to `claude-progress.txt`. Never rewrite feature descriptions.

**Large change / refactor:** do not drive it through `feature_list.json`. Record the intent
in `docs/DECISIONS.md` (what changes, why, what breaks), work on a branch, keep
`npm run typecheck` green at each step, and update the docs listed in §6 in the same change.

**Always:**
- Verify a claim in the code before repeating it in a doc.
- Changing `src/utils/stakeholder-ai.ts`, `src/data/stakeholder-fewshot.ts`,
  `src/hooks/useWebLLM.ts` or `scripts/test-prompts-ollama.ts` -> update `docs/WEBLLM-STATUS.md`.
- Changing `src/types/*` -> update `docs/DATA-SCHEMAS.md`.
- Changing design tokens or layout -> update `docs/UI-DESIGN.md`.
- Test offline behaviour explicitly when touching PWA, caching, storage or the AI tiers.

---

## 6. Documentation map

`docs/README.md` is the index and marks every file **Current** or **Historical**.
The ones that matter for implementation work:

| Doc | Use it for |
|---|---|
| [docs/KNOWN-GAPS.md](docs/KNOWN-GAPS.md) | Verified defects and debt — read before planning big changes |
| [docs/DATA-SCHEMAS.md](docs/DATA-SCHEMAS.md) | Scenario / derived-metrics shapes, job, land and emission factors |
| [docs/STAKEHOLDER-PROFILES.md](docs/STAKEHOLDER-PROFILES.md) | The 9 profiles, triggers, response templates |
| [docs/TECHNICAL-IMPLEMENTATION.md](docs/TECHNICAL-IMPLEMENTATION.md) | Response generation and calculation algorithms |
| [docs/UI-DESIGN.md](docs/UI-DESIGN.md) | Design tokens, layout, component patterns |
| [docs/WEBLLM-STATUS.md](docs/WEBLLM-STATUS.md) | WebLLM / Ollama config, prompts, echo detection |
| [docs/WORKSHOP-DEPLOYMENT.md](docs/WORKSHOP-DEPLOYMENT.md) | USB, local-server and Pages deployment |
| [docs/toolkit/](docs/toolkit/) | IRENA *Participatory Processes* toolkit — the content source of truth |

Toolkit quick reference: stakeholder profiles -> chapter 3; engagement tools -> chapter 4.1;
dissemination (the Communicate tab) -> chapter 4.3; case studies -> chapter 5.

---

## 7. Domain reference

**The nine stakeholder groups** (ids in `src/data/stakeholder-profiles.ts`):
`policy-makers`, `grid-operators`, `industry`, `public`, `csos-ngos`, `scientific`,
`finance`, `regional-bodies`, `development-partners`. The first seven come from the IRENA
toolkit; regional bodies and development partners were added for energy-planning practice.

Each profile carries priorities, typical questions, concern triggers keyed to metric
thresholds, and response templates. Responses are further shaped by **development context**
(LDC / emerging / developed) and **variant** (conservative / pragmatic / progressive).

**The four tabs:**
1. **Input** — CSV upload, quick-entry form, or load example (target: under 5 minutes).
2. **Stakeholder Dialogue** — predict, reveal, compare.
3. **Explore Impacts** — directional sensitivity on soft metrics only.
4. **Communicate** — dissemination strategy, templates, case studies, best practice.
   Educational by design: it teaches formats, it does not generate publication-ready
   documents or full dashboards.

**Adaptability:** stakeholder lists, regional bodies, concern thresholds and sample
scenarios are all data, not logic — regional adaptation should not require code changes.
