"""Dump the publication PDF to plain text for the quote verifier.

docs/toolkit/*.md is a hand-made transcription and is lossy: Table 1 in the
publication has a Resource requirements column that the markdown omits, and the
figure captions are absent altogether. Verifying against the markdown alone
therefore proves text was not invented, but cannot prove nothing was dropped.

This writes the publication's own text alongside it so the verifier checks
against the source document.

    pip install pymupdf
    python scripts/extract-pdf-text.py
"""

import os
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"
OUT = os.path.join("docs", "toolkit", "publication-text.txt")

if not os.path.exists(PDF):
    sys.exit(f"source PDF not found: {PDF}")

doc = pymupdf.open(PDF)
parts = [f"# Extracted from {os.path.basename(PDF)} by scripts/extract-pdf-text.py.",
         "# Do not edit. Regenerate when the source PDF changes.", ""]
for i, page in enumerate(doc):
    parts.append(f"--- page {i + 1} ---")
    parts.append(page.get_text())

text = "\n".join(parts)
with open(OUT, "w", encoding="utf-8") as handle:
    handle.write(text)
print(f"{doc.page_count} pages, {len(text) / 1024:.0f} kB -> {OUT}")
