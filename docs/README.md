# Documentation index

The app is a digital edition of IRENA (2025), *Participatory processes for strategic energy
planning: A toolkit for national energy planners*.

## Current

| Doc | Status | What it covers |
|---|---|---|
| [../CLAUDE.md](../CLAUDE.md) | Current | Operating manual: invariants, commands, architecture, conventions |
| [DECISIONS.md](DECISIONS.md) | Current | Decision log, including the 2026-08-27 pivot to a toolkit edition |
| [KNOWN-GAPS.md](KNOWN-GAPS.md) | Current | Verified defects and remaining work |
| [UI-DESIGN.md](UI-DESIGN.md) | Current | Design tokens, layout, component patterns |
| [WORKSHOP-DEPLOYMENT.md](WORKSHOP-DEPLOYMENT.md) | Current | USB, local-server and GitHub Pages deployment |

## Source of truth

| Doc | Status | What it covers |
|---|---|---|
| [toolkit/](toolkit/) | Reference | The publication, in markdown. Every string shown in the app is checked against these files by `npm run verify:quotes`. Treat as read-only. |

## Archived

[archive/](archive/) holds documentation for the scenario simulator this tool used to be —
the milestone scenario schema, the rule-based response engine, the WebLLM and Ollama tiers,
the stakeholder enhancement system and the SPLAT CSV import. None of it describes the
current code. It is kept because the history explains why several files are shaped as they
are.
