# Documentation index

Every file is marked **Current** (kept in step with the code) or **Reference** (accurate
about its own subject, but not a description of today's behaviour). Anything genuinely
out of date lives in [`archive/`](archive/) and should not be implemented from.

Start with [`../CLAUDE.md`](../CLAUDE.md) — it is the short operating manual for the repo.

## Current

| Doc | Status | What it is for |
|---|---|---|
| [KNOWN-GAPS.md](KNOWN-GAPS.md) | Current | Verified defects, stale tests and technical debt, with evidence. Read before planning a large change. |
| [DECISIONS.md](DECISIONS.md) | Current | Log of architectural decisions. Add an entry when you change something structural. |
| [DATA-SCHEMAS.md](DATA-SCHEMAS.md) | Current | `ScenarioInput`, `DerivedMetrics`, response and adjustment types; job / land / emission factors; validation; CSV and JSON formats. |
| [STAKEHOLDER-PROFILES.md](STAKEHOLDER-PROFILES.md) | Current | The nine stakeholder groups: priorities, concern triggers, typical questions, engagement practice. |
| [TECHNICAL-IMPLEMENTATION.md](TECHNICAL-IMPLEMENTATION.md) | Current | Response generation pipeline, template selection, AI tiers, soft-metric algorithms, testing and bundle guidance. |
| [UI-DESIGN.md](UI-DESIGN.md) | Current | Tailwind v4 tokens, component classes, tab layouts, responsive and accessibility rules. |
| [WEBLLM-STATUS.md](WEBLLM-STATUS.md) | Current | WebLLM and Ollama configuration, prompts, echo detection, performance, bundle impact. |
| [WORKSHOP-DEPLOYMENT.md](WORKSHOP-DEPLOYMENT.md) | Current | Getting the tool into a workshop: local server, USB, hosted build. |
| [OLLAMA-SETUP.md](OLLAMA-SETUP.md) | Current | Facilitator-side Ollama install and model pull. Note the dev-server-only caveat in WEBLLM-STATUS. |

## Reference

| Doc | Status | What it is for |
|---|---|---|
| [toolkit/](toolkit/) | Reference | IRENA *Participatory Processes for Strategic Energy Planning* toolkit in markdown. The content source of truth for stakeholder profiles (ch. 3), engagement tools (ch. 4), dissemination (4.3) and case studies (ch. 5). |
| [SPLAT-CSV-ANALYSIS.md](SPLAT-CSV-ANALYSIS.md) | Reference | Column-level analysis of a real SPLAT export; the basis for `src/utils/csv-parser.ts`. Its "current schema" comparison predates the milestone schema. |
| [STAKEHOLDER-ENHANCEMENTS-GUIDE.md](STAKEHOLDER-ENHANCEMENTS-GUIDE.md) | Reference | How development context, variants and multi-metric triggers were designed. |
| [CUSTOM-MODELS.md](CUSTOM-MODELS.md) | Reference | Swapping in a different or fine-tuned model for WebLLM / Ollama. |
| [WORKSHOP-CUSTOMIZATION-PLAN.md](WORKSHOP-CUSTOMIZATION-PLAN.md) | Reference | Deferred plan for per-workshop customisation. Not implemented. |
| [examples/](examples/) | Reference | A real SPLAT CSV export and the stakeholder training data used to generate the response library. |

## Archived

[`archive/`](archive/) — superseded plans and snapshots, listed with the reason in
[archive/README.md](archive/README.md). Historical context only.

## Keeping this honest

Each Current doc carries a "last verified against the code" date near the top. When you
change code that a doc describes, update the doc and that date in the same commit. A doc
that cannot be verified quickly should be demoted to Reference or archived rather than left
to rot.
