"""Extract the numbered figures from the publication PDF into src/assets/figures/.

The figures are vector drawings, not embedded images, so they are rendered
rather than copied out. SVG export was tried first and rejected: it produced
40-650 kB per figure against a 326 kB application. Quantised PNG at 1200 px
gives the same result on screen for a fraction of that.

Run when the source PDF changes. Needs Python with pymupdf and pillow, neither
of which is a project dependency:

    pip install pymupdf pillow
    python scripts/extract-figures.py
"""

import io
import os
import sys

import pymupdf
from PIL import Image

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"
OUT_DIR = os.path.join("src", "assets", "figures")

# Figure number -> 1-based page number in the PDF.
FIGURES = {1: 11, 2: 14, 3: 15, 4: 28, 5: 38}

# Rendered width in pixels. The figures display in a column about 800 px wide,
# so this covers a 1.5x display without paying for a full 2x.
TARGET_WIDTH = 1200

# Flat-colour diagrams; 64 colours is indistinguishable from full colour here.
PALETTE_COLOURS = 64


def panel_for(page, caption):
    """The filled panel a figure sits in.

    Each figure is drawn inside a single background rectangle that also holds
    the caption. Clipping to that rectangle avoids trailing body text, which a
    fixed-height crop below the caption picks up.
    """
    page_area = abs(page.rect)
    best = None
    for drawing in page.get_drawings():
        rect = drawing["rect"]
        if rect.width < page.rect.width * 0.5:
            continue
        if abs(rect) > page_area * 0.9:
            continue
        encloses_caption = (
            rect.x0 - 4 <= caption.x0
            and rect.x1 + 4 >= caption.x1
            and rect.y0 - 8 <= caption.y0
            and rect.y1 > caption.y1
        )
        if encloses_caption and (best is None or abs(rect) < abs(best)):
            best = rect
    return best


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    os.makedirs(OUT_DIR, exist_ok=True)

    doc = pymupdf.open(PDF)
    total = 0

    for number, page_number in FIGURES.items():
        page = doc[page_number - 1]
        hits = page.search_for(f"Figure {number}")
        if not hits:
            sys.exit(f"Figure {number}: caption not found on page {page_number}")
        # The last hit is the caption on the figure itself; earlier hits are
        # cross-references in the body text.
        box = panel_for(page, hits[-1])
        if box is None:
            sys.exit(f"Figure {number}: no enclosing panel on page {page_number}")

        zoom = TARGET_WIDTH / box.width
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=box)
        image = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
        image = image.convert("P", palette=Image.ADAPTIVE, colors=PALETTE_COLOURS)

        path = os.path.join(OUT_DIR, f"figure-{number}.png")
        image.save(path, "PNG", optimize=True)
        size = os.path.getsize(path)
        total += size
        print(f"figure-{number}.png  {image.width}x{image.height}  {size / 1024:5.1f} kB")

    print(f"{len(FIGURES)} figures, {total / 1024:.0f} kB total -> {OUT_DIR}")


if __name__ == "__main__":
    main()
