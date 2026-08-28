# Markdown transcription of the publication (superseded)

A hand-made markdown version of IRENA (2025), *Participatory processes for strategic energy
planning*. It was the app's content source until 2026-08-28, and is kept only because the
history explains the shape of several data files.

**Do not use it as a source.** It is not a faithful transcription. It rewrites and truncates
the publication, and in six places invents content that is not in it at all:

| Invented | Where it was shown |
|---|---|
| "Summary: Stakeholder Engagement Matrix" | a table on the Stakeholders page, and every stakeholder card subtitle |
| Chapter 6 "Key takeaways", six numbered points | the Why participate page |
| Chapter 6 "Current challenges" table and five sub-headings | the Plan page |
| Chapter 2 "Three models for energy planning capacity" table | the Why participate page (the models are Figure 3) |
| Chapter 2 "Types of inputs" and "Summary: Benefits of Participatory Processes" tables | the Why participate page |
| Chapter 7 "Quick Reference: Tool Categories" table | the Resources page |

It also turned prose into bullet lists the publication does not have (chapters 1, 2, 3, 4
and 7), truncated sentences mid-clause (chapters 3 and 5), rewrote the chapter 5 case study
subtitles, and dropped Table 1's Resource requirements column and every figure caption.

The source of truth is now `docs/toolkit/publication-text.txt`, generated from the PDF by
`scripts/extract-pdf-text.py`. `npm run verify:quotes` checks against that file alone.
