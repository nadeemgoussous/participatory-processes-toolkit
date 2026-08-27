# Archive

This directory holds original source material that is no longer used during
development but is worth keeping alongside the project.

## Structure

### source-materials/
Original source files used during initial setup (December 8, 2025):
- `IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf` - the source
  toolkit; its content is converted to markdown in `docs/toolkit/`
- `source-photos/` - original stakeholder icon photos before conversion
- `extract-icons.py` - script used to extract and process those icons

### claude-progress-history.txt
The full Claude Code session log from December 2025 through August 2026 (~1 550 lines).
Moved out of the repo root on 2026-08-26 so that `claude-progress.txt` can stay a one-page
current-state file that is actually read at the start of a session.

## Last Cleanup

**Date**: August 25, 2026
**Reason**: Removed `old-test-docs/` and `session-guides/` - snapshots of test
runs and one-off session guides from December 2025, all superseded by the live
test suite and `claude-progress.txt`. Recoverable from git history if needed.

## feature_list-scenario-tool.json

The 48-entry feature tracker for the scenario dialogue tool, as it stood at the
2026-08-27 pivot. It describes the scenario import, the prediction loop, the response
engine and the AI tiers, none of which exist any more. Kept for history; it is not a
tracker for the current app.
