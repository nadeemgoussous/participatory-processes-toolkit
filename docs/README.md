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
| [toolkit/publication-text.txt](toolkit/publication-text.txt) | Reference | The publication's own text, generated from the PDF by `scripts/extract-pdf-text.py`. Every string shown in the app is checked against this file by `npm run verify:quotes`. Generated: regenerate, do not edit. |

## Archived

[archive/markdown-transcription/](archive/markdown-transcription/) holds the hand-made
markdown version of the publication that the app was built on until 2026-08-28. It rewrote
and truncated the publication and invented six structures outright; its README lists them.
It is not a source.

[archive/](archive/) also holds documentation for the scenario simulator this tool used to be —
the milestone scenario schema, the rule-based response engine, the WebLLM and Ollama tiers,
the stakeholder enhancement system and the SPLAT CSV import. None of it describes the
current code. It is kept because the history explains why several files are shaped as they
are.
