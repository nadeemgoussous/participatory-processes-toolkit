"""Pull chapter 2 out of the PDF into JSON.

Chapter 2 is prose with two figures and no tables at all. The markdown
transcription rendered three tables from it - "Three models for energy planning
capacity", "Types of inputs" and "Summary: Benefits of Participatory
Processes" - none of which the publication contains. The capacity models are
Figure 3, not a table.

Sections are delimited by their numbered headings, set in ITCAvantGardeStd. The
four objectives in 2.4 are numbered bold headings within it.

    pip install pymupdf
    python scripts/extract-chapter2.py chapter2-extracted.json
"""

import json
import os
import re
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"
PAGES = range(13, 19)

# Numbered section headings, matched on their opening.
# Most specific first: "2.1" also starts with "2.", so the chapter heading has
# to be tested last or it swallows every section.
SECTION_STARTS = [
    ("scope", "2.1"),
    ("responsibility", "2.2"),
    ("definition", "2.3"),
    ("support", "2.4"),
    ("intro", "2."),
]

# The four objectives in 2.4, as the publication numbers them.
OBJECTIVE_PATTERN = re.compile(r"^([1-4])\.\s+(.{10,90})$")

# Thin, hair and non-breaking spaces, as escapes. A literal class of these
# characters reads as a range from space to U+200B and matches nearly
# everything, which silently empties the extraction.
ODD_SPACE = "[  -​  ]"
ABBREVIATIONS = ("e.g.", "i.e.", "etc.", "cf.", "no.", "vs.", "al.")


def clean(text):
    text = text.replace("‑", "-")
    text = re.sub(ODD_SPACE, " ", text)
    text = text.replace("­", "")
    text = re.sub(r"([-–])\s*\n\s*", r"\1", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    return text.strip()


def sentences(text):
    text = clean(text)
    if not text:
        return []
    out, current = [], ""
    for part in re.split(r"(?<=\.)\s+", text):
        current = (current + " " + part).strip() if current else part
        if current.lower().endswith(ABBREVIATIONS):
            continue
        out.append(current)
        current = ""
    if current:
        out.append(current)
    return [s for s in out if len(s.split()) > 3]


def join_lines(lines):
    out = ""
    for line in lines:
        if not out:
            out = line
        elif out.endswith(("-", "–")):
            out += line
        else:
            out += " " + line
    return out


def figure_panels(page):
    """The filled panels that hold Figure 2 and Figure 3.

    Same shape as scripts/extract-figures.py: the smallest drawing wider than
    half the page that encloses the caption.
    """
    panels = []
    page_area = abs(page.rect)
    for caption in page.search_for("Figure "):
        best = None
        for drawing in page.get_drawings():
            rect = drawing["rect"]
            if rect.width < page.rect.width * 0.5 or abs(rect) > page_area * 0.9:
                continue
            encloses = (
                rect.x0 - 4 <= caption.x0
                and rect.x1 + 4 >= caption.x1
                and rect.y0 - 8 <= caption.y0
                and rect.y1 > caption.y1
            )
            if encloses and (best is None or abs(rect) < abs(best)):
                best = rect
        if best is not None:
            panels.append(best)
    return panels


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    doc = pymupdf.open(PDF)

    sections = {key: [] for key, _ in SECTION_STARTS}
    objectives = []
    current = None
    objective = None
    buffer = []

    def flush():
        nonlocal buffer
        text = join_lines(buffer)
        buffer = []
        if not text.strip():
            return
        if objective is not None:
            objective["blocks"].extend(sentences(text))
        elif current:
            sections[current].extend(sentences(text))

    for page_number in PAGES:
        page = doc[page_number - 1]
        figures = figure_panels(page)
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                if line["bbox"][0] > 520:
                    continue
                # The labels inside Figure 2 and Figure 3 are page text. They
                # belong to the artwork, which is rendered as an image, so they
                # would otherwise appear as a run of stray words in the prose.
                if any(pymupdf.Rect(line["bbox"]).intersects(f) for f in figures):
                    continue
                line_parts = []
                heading = clean(
                    "".join(
                        s["text"] for s in line["spans"]
                        if "AvantGarde" in s["font"] and s["size"] >= 9.5
                    )
                )
                if heading:
                    # Figure captions are set in the same face.
                    if not heading.lower().startswith("figure"):
                        for key, prefix in SECTION_STARTS:
                            if heading.startswith(prefix):
                                flush()
                                current = key
                                objective = None
                                break
                    continue

                for span in line["spans"]:
                    raw = span["text"]
                    text = re.sub(ODD_SPACE, " ", raw).strip()
                    if not text or span["size"] < 8:
                        continue
                    if span["font"].endswith("-Bold"):
                        match = OBJECTIVE_PATTERN.match(text)
                        if match and current == "support":
                            flush()
                            objective = {
                                "number": int(match.group(1)),
                                "heading": clean(match.group(2)),
                                "blocks": [],
                            }
                            objectives.append(objective)
                            line_parts = []
                            break
                    line_parts.append(raw)
                if line_parts:
                    buffer.append("".join(line_parts))

    flush()

    out = {"sections": sections, "objectives": objectives}
    path = sys.argv[1] if len(sys.argv) > 1 else "chapter2-extracted.json"
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(out, handle, indent=2, ensure_ascii=False)
    for key in sections:
        print(f"{key:<16} {len(sections[key])} sentences")
    for o in objectives:
        print(f"  objective {o['number']}: {len(o['blocks'])} sentences - {o['heading'][:52]}")
    print(f"-> {path}")


if __name__ == "__main__":
    main()
