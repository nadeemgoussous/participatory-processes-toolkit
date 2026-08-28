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
prose = []
parts = [f"# Extracted from {os.path.basename(PDF)} by scripts/extract-pdf-text.py.",
         "# Do not edit. Regenerate when the source PDF changes.", ""]
def sized_text(page, clip=None, min_size=8.0):
    """Page text without the superscript footnote markers, the footnote bodies
    or the running header, all of which are set below 8pt.

    The data files are extracted the same way, so a quotation that omits a
    marker ("15 000 hours" for "15 000 hours10") still verifies."""
    lines = []
    blocks = page.get_text("dict", clip=clip)["blocks"] if clip else page.get_text("dict")["blocks"]
    for block in blocks:
        for line in block.get("lines", []):
            # The chapter tabs run down the outer margin and would otherwise
            # land between the two halves of a sentence that crosses a page.
            if not clip and line["bbox"][0] > 520:
                continue
            spans = [s["text"] for s in line["spans"] if s["size"] >= min_size]
            if spans:
                lines.append("".join(spans))
    return "\n".join(lines)


for i, page in enumerate(doc):
    parts.append(f"--- page {i + 1} ---")
    parts.append(sized_text(page))
    # Table cells again, cell by cell. In the linear page text the columns of a
    # table interleave, so a quotation taken from one cell does not appear as a
    # contiguous run. Reading each cell by its rectangle makes it verifiable.
    try:
        tables = page.find_tables().tables
    except Exception:
        tables = []
    # Prose again, with the table regions removed. A sentence that runs past a
    # table is interleaved with the table's cells in the linear page text, so
    # it never appears as a contiguous run without this pass.
    if tables:
        rects = [pymupdf.Rect(t.bbox) for t in tables]
        lines = []
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                rect = pymupdf.Rect(line["bbox"])
                if any(rect.intersects(r) for r in rects):
                    continue
                spans = [sp["text"] for sp in line["spans"] if sp["size"] >= 8.0]
                if spans:
                    lines.append("".join(spans))
        if lines:
            parts.append("\n".join(lines))
            prose.extend(lines)
    else:
        prose.extend(sized_text(page).splitlines())

    for table in tables:
        for row in table.rows:
            for cell in row.cells:
                if not cell:
                    continue
                text = sized_text(page, clip=pymupdf.Rect(cell)).strip()
                if text:
                    parts.append(text)

# One continuous prose stream for the whole document. A sentence that runs
# across a page break is split by the page marker in the per-page dump above,
# so it is not contiguous there; here it is.
parts.append("--- continuous prose ---")
parts.append("\n".join(prose))

text = "\n".join(parts)
with open(OUT, "w", encoding="utf-8") as handle:
    handle.write(text)
print(f"{doc.page_count} pages, {len(text) / 1024:.0f} kB -> {OUT}")
