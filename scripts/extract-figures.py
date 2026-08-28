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
FLOW_DIR = os.path.join("src", "assets", "process-flows")

# Figure number -> 1-based page number in the PDF.
FIGURES = {1: 11, 2: 14, 3: 15, 4: 28, 5: 38}

# Each chapter 5 case study runs over two pages; the process flow is on the
# second. These are not captioned "Figure N", so they are located by page.
# Case study id -> 1-based page number.
PROCESS_FLOWS = {
    "belgium": 49,
    "brazil": 51,
    "canada": 53,
    "chile": 55,
    "colombia": 57,
    "cyprus": 59,
    "finland": 61,
    "ghana": 63,
    "panama": 65,
    "uae": 67,
    "kenya": 69,
    "pac-consortium": 71,
    "world-energy-council": 73,
}

# The flows are wider than they are tall and sit in the same column, so a
# smaller width than the numbered figures still reads clearly.
FLOW_WIDTH = 1100

# Stakeholder icons, top right of each chapter 3 section heading.
# Stakeholder id -> (1-based page number, section number).
ICONS = {
    "policy-makers": (20, "3.1"),
    "grid-operators": (21, "3.2"),
    "industry": (22, "3.3"),
    "public": (23, "3.4"),
    "csos-ngos": (24, "3.5"),
    "scientific": (25, "3.6"),
    "finance": (26, "3.7"),
}
ICON_DIR = os.path.join("src", "assets", "icons")
ICON_SIZE = 192

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


def flow_box(page):
    """The process flow diagram, between the Process and Highlight headings.

    The legend sits above the diagram on some pages and below it on others, so
    the region is taken from the drawings rather than from a fixed offset.
    """
    tops = page.search_for("Process")
    highlights = page.search_for("Highlight")
    if not tops or not highlights:
        return None
    top = min(r.y0 for r in tops)
    below = [r.y0 for r in highlights if r.y0 > top]
    if not below:
        return None
    bottom = min(below)

    box = None
    for drawing in page.get_drawings():
        rect = drawing["rect"]
        if rect.y0 >= top - 4 and rect.y1 <= bottom - 4 and rect.width > 4 and rect.height > 4:
            box = rect if box is None else (box | rect)
    if box is None:
        return None
    # Only a little padding at the bottom: the "Note:" line sits close under.
    return pymupdf.Rect(box.x0 - 8, box.y0 - 8, box.x1 + 8, box.y1 + 2)


def icon_box(page, section):
    """The icon printed to the right of a chapter 3 section heading.

    Squared off around its centre so every icon renders at the same size
    regardless of the shape of the artwork.
    """
    headings = [r for r in page.search_for(section) if r.x0 < 150 and r.y0 < 400]
    if not headings:
        return None
    heading = headings[0]
    box = None
    for drawing in page.get_drawings():
        rect = drawing["rect"]
        if rect.x0 > heading.x1 and abs(rect.y0 - heading.y0) < 40:
            box = rect if box is None else (box | rect)
    if box is None:
        return None
    side = max(box.width, box.height) / 2 + 3
    cx, cy = (box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2
    return pymupdf.Rect(cx - side, cy - side, cx + side, cy + side)


def drop_background(icon, tolerance=40):
    """Make the page tint transparent.

    Chapter 3 pages carry a filled background rectangle in the colour of the
    stakeholder group, so rendering with an alpha channel still produces an
    opaque tinted square. The corner pixel is that tint; everything close to it
    becomes transparent, and partly-matching pixels are faded proportionally so
    anti-aliased edges do not leave a hard fringe.
    """
    pixels = icon.load()
    br, bg, bb = pixels[0, 0][:3]
    for y in range(icon.height):
        for x in range(icon.width):
            r, g, b, a = pixels[x, y]
            distance = abs(r - br) + abs(g - bg) + abs(b - bb)
            if distance <= tolerance:
                pixels[x, y] = (r, g, b, 0)
            elif distance < tolerance * 3:
                fade = (distance - tolerance) / (tolerance * 2)
                pixels[x, y] = (r, g, b, int(a * fade))
    return icon


def save(page, box, width, path):
    zoom = width / box.width
    pixmap = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=box)
    image = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGB")
    image = image.convert("P", palette=Image.ADAPTIVE, colors=PALETTE_COLOURS)
    image.save(path, "PNG", optimize=True)
    return image, os.path.getsize(path)


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

        path = os.path.join(OUT_DIR, f"figure-{number}.png")
        image, size = save(page, box, TARGET_WIDTH, path)
        total += size
        print(f"figure-{number}.png  {image.width}x{image.height}  {size / 1024:5.1f} kB")

    print(f"{len(FIGURES)} figures, {total / 1024:.0f} kB total -> {OUT_DIR}")

    os.makedirs(FLOW_DIR, exist_ok=True)
    flow_total = 0
    for case_id, page_number in PROCESS_FLOWS.items():
        page = doc[page_number - 1]
        box = flow_box(page)
        if box is None:
            sys.exit(f"{case_id}: no process flow found on page {page_number}")
        path = os.path.join(FLOW_DIR, f"{case_id}.png")
        image, size = save(page, box, FLOW_WIDTH, path)
        flow_total += size
        print(f"{case_id + '.png':<28} {image.width}x{image.height}  {size / 1024:5.1f} kB")

    print(f"{len(PROCESS_FLOWS)} process flows, {flow_total / 1024:.0f} kB total -> {FLOW_DIR}")

    os.makedirs(ICON_DIR, exist_ok=True)
    icon_total = 0
    for stakeholder_id, (page_number, section) in ICONS.items():
        page = doc[page_number - 1]
        box = icon_box(page, section)
        if box is None:
            sys.exit(f"{stakeholder_id}: no icon found on page {page_number}")
        zoom = ICON_SIZE / box.width
        pixmap = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), clip=box)
        icon = Image.open(io.BytesIO(pixmap.tobytes("png"))).convert("RGBA")
        icon = drop_background(icon)
        path = os.path.join(ICON_DIR, f"{stakeholder_id}.png")
        icon.save(path, "PNG", optimize=True)
        size = os.path.getsize(path)
        icon_total += size
        print(f"{stakeholder_id + '.png':<24} {pixmap.width}x{pixmap.height}  {size / 1024:5.1f} kB")

    print(f"{len(ICONS)} icons, {icon_total / 1024:.0f} kB total -> {ICON_DIR}")


if __name__ == "__main__":
    main()
