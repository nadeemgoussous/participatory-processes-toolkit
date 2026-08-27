# Archived documentation

These files described plans or schemas that the code has since moved past. They are kept
because they explain *why* the current design looks the way it does — not as guidance.

**Do not implement from anything in this folder.** For current behaviour see
[../README.md](../README.md).

| File | Why it was archived (2026-08-26) |
|---|---|
| `SIMPLIFIED-SCHEMA-DESIGN.md` | The design proposal for the milestone-based schema. It was implemented; `src/types/scenario.ts` and `../DATA-SCHEMAS.md` are now the reference. Contains pre-implementation shapes that no longer match the code. |
| `SCHEMA-REDESIGN-SUMMARY.md` | Progress snapshot from the same migration (January 2025). Historical only. |
| `WEBLLM-IMPLEMENTATION.md` | The pre-implementation plan for WebLLM, still marked "PLANNED". WebLLM shipped as F043; see `../WEBLLM-STATUS.md`. |
| `MODEL-FINETUNING-GUIDE.md` | Fine-tuning walkthrough written around Gemma 2B. The tool moved to SmolLM2-1.7B; the general method still reads fine, the model names and sizes do not. |
