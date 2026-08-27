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
**Status:** accepted
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
**Status:** accepted
**Context:** Workshop venues cannot be relied on for connectivity, and small local models
produce weak output often enough that they cannot be load-bearing.
**Decision:** `generateEnhancedResponse` always produces a complete response first. AI tiers
(WebLLM → Ollama → cloud) may replace it, but each returns `null` on any failure and control
falls through silently. Echo detection rejects responses that parrot the prompt.
**Consequences:** The tool is never blocked and never shows an AI error. The cost is that a
lot of code exists for a tier most users never see, and the AI path is hard to test.

## 2025-12 — SmolLM2-1.7B over WebGPU as the browser model
**Status:** accepted
**Context:** Participants cannot install software, and the tool must work offline after
first load.
**Decision:** WebLLM with `SmolLM2-1.7B-Instruct-q4f16_1-MLC` (~1.8 GB, cached in the
browser), few-shot prompted per stakeholder; Ollama with the same model for facilitators.
**Consequences:** Zero installation and true offline inference after one download, at the
cost of Chrome/Edge 113+ (WebGPU), a large first download, and 5-15 s per response. The
static import also puts the WebLLM runtime in the main bundle — see `docs/KNOWN-GAPS.md` §3.

## 2026-02 — Generated response library plus a hand-written selector
**Status:** accepted
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
