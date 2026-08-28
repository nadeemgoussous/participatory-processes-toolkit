"""Pull the chapter 5 case studies out of the PDF into JSON.

The markdown transcription (now in docs/archive/) did not just abbreviate the case
studies, it rewrites them. Belgium's objective reads "Engage citizens,
particularly secondary school students, in dialogue on transitioning to
net-zero" in the markdown, where the publication says "My2050 is dedicated to
engaging citizens, particularly secondary school students, in a substantive
dialogue focused on transitioning society towards a net-zero emissions future".

This writes the publication's own wording so src/data/case-studies.ts can be
rebuilt from it.

    pip install pymupdf
    python scripts/extract-case-studies.py case-studies-extracted.json
"""

import json
import os
import re
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"

# Case study id -> (first page, second page), 1-based.
PAGES = {
    "belgium": (48, 49),
    "brazil": (50, 51),
    "canada": (52, 53),
    "chile": (54, 55),
    "colombia": (56, 57),
    "cyprus": (58, 59),
    "finland": (60, 61),
    "ghana": (62, 63),
    "panama": (64, 65),
    "uae": (66, 67),
    "kenya": (68, 69),
    "pac-consortium": (70, 71),
    "world-energy-council": (72, 73),
}

# Row labels of the executive summary table, in the order they appear. Some
# labels are split across lines ("Engagement \nactivities").
LABELS = [
    ("governance", "Governance"),
    ("scope", "Scope"),
    ("objectives", "Objectives"),
    ("engagementActivities", "Engagement activities"),
    ("keyOutcomes", "Key outcomes"),
    ("resources", "Resources"),
]

# Thin, hair and non-breaking spaces. The layout uses them inside numbers
# ("28 000") and between words, and they break plain matching.
ODD_SPACE = "[ -​    ]"


def despace(text):
    return re.sub(ODD_SPACE, " ", text)


def clean(text):
    """Normalise the spacing artefacts of PDF text extraction."""
    text = despace(text)
    text = text.replace("­", "")  # soft hyphen
    # A hyphen or dash before a line break belongs to the word: "long-\nterm",
    # "Medium–\nhigh".
    text = re.sub(r"([-–])\s*\n\s*", r"\1", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    # Footnote markers attach to the end of a sentence: "future.7 In 2023".
    text = re.sub(r"\.(\d{1,2}) (?=[A-Z])", ". ", text)
    return text.strip()


def bullets(text):
    """Split a cell that uses bullet markers into its items."""
    parts = [p for p in re.split(r"•\s*", text) if p.strip()]
    return [clean(p) for p in parts]


def parse_heading(page):
    """Name, subtitle and intro, separated by how the page styles them.

    Guessing from line length does not work: on some pages the section number
    is tab-joined to the name, and the subtitle runs to five lines. The layout
    is consistent about fonts, so use those instead.

      ITCAvantGardeStd-Bold  section number and name
      GothamNarrow-Bold      subtitle
      GothamNarrow-Book      intro paragraph

    Spans smaller than 7pt are footnote markers and are dropped.
    """
    name_parts, title_parts, intro_parts = [], [], []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            # Spans split mid-sentence around italics, so join them within the
            # line with nothing and separate whole lines with a space. Joining
            # every span with nothing loses the space between lines and
            # produces "strategies.The KCERT".
            name_line, title_line, intro_line = [], [], []
            for span in line["spans"]:
                text = span["text"]
                if not text.strip() or span["size"] < 7:
                    continue
                if text.strip() == "Governance":
                    for parts, buf in ((name_parts, name_line),
                                       (title_parts, title_line),
                                       (intro_parts, intro_line)):
                        if buf:
                            parts.append("".join(buf))
                    return name_parts, title_parts, intro_parts
                font, size = span["font"], span["size"]
                if "AvantGarde" in font:
                    name_line.append(text)
                elif size >= 9.5 and font.endswith("-Bold"):
                    title_line.append(text)
                elif size >= 9.5:
                    intro_line.append(text)
            for parts, buf in ((name_parts, name_line),
                               (title_parts, title_line),
                               (intro_parts, intro_line)):
                if buf:
                    parts.append("".join(buf))
    return name_parts, title_parts, intro_parts


def body_text(page, min_size=8.0):
    """Page text without the running header and the footnotes.

    Both are set below 8pt. Taking the whole page text instead pulls the
    footnote at the foot of the page into the last table cell, which is
    Resources.
    """
    lines = []
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            parts = [s["text"] for s in line["spans"] if s["size"] >= min_size]
            if parts:
                lines.append("".join(parts))
    return "\n".join(lines)


def join_lines(parts):
    """Join lines, keeping hyphenated words whole ("well-" + "informed")."""
    out = ""
    for part in parts:
        if not out:
            out = part
        elif out.endswith(("-", "–")):
            out += part
        else:
            out += " " + part
    return out


def parse_first_page(page):
    body = despace(body_text(page))

    name_parts, title_parts, intro_parts = parse_heading(page)
    # Strip the section number before clean(), whose footnote rule would
    # otherwise read "5.1 BELGIUM" as a footnote marker and leave "5. BELGIUM".
    name = re.sub(r"^\s*5\.\d+\s*", "", despace(" ".join(name_parts)))
    name = clean(name)

    fields = {
        "id": None,
        "name": name,
        "title": clean(join_lines(title_parts)),
        # Spans break mid-sentence around italics, so join without extra spaces
        # and let clean() collapse what is left.
        "intro": clean(join_lines(intro_parts)),
    }

    # The executive summary is a table. Reading it as a table rather than
    # splitting the linear page text on labels keeps the footnote at the foot
    # of the page out of the Resources cell, which is the last one.
    cells = summary_cells(page)
    for key, pattern in LABELS:
        label = re.sub(r"\\s\+", " ", pattern)
        cell = cells.get(label.lower(), "")
        fields[key] = bullets(cell) if "•" in cell else clean(cell)
    return fields


def cell_text(page, rect):
    """Text inside a table cell, without superscript footnote markers.

    The publication attaches markers directly to a word ("15 000 hours10"),
    which a plain text read cannot distinguish from a figure. They are set
    several points smaller, so they are filtered by size.
    """
    lines = []
    for block in page.get_text("dict", clip=rect)["blocks"]:
        for line in block.get("lines", []):
            parts = [s["text"] for s in line["spans"] if s["size"] >= 8.0]
            if parts:
                lines.append("".join(parts))
    return "\n".join(lines)


def summary_cells(page):
    """The executive summary table, keyed by its lower-cased row label."""
    cells = {}
    for table in page.find_tables().tables:
        for row in table.rows:
            if len(row.cells) < 2 or not row.cells[0] or not row.cells[1]:
                continue
            label = clean(cell_text(page, pymupdf.Rect(row.cells[0]))).lower()
            if label:
                cells[label] = cell_text(page, pymupdf.Rect(row.cells[1]))
    return cells


def parse_second_page(raw):
    body = despace(raw)
    out = {"highlight": "", "lessonsLearnt": []}

    high = re.search(r"\n\s*Highlight\s*\n", body)
    lessons = re.search(r"\n\s*Lessons learnt\s*\n", body)
    if high:
        end = lessons.start() if lessons else len(body)
        out["highlight"] = clean(body[high.end():end])
    if lessons:
        tail = body[lessons.end():]
        tail = re.split(r"\n\s*\d+\s*\|", tail)[0]  # stop at the page footer
        items = re.split(r"\n\s*\d+\.\s*", "\n" + tail)
        out["lessonsLearnt"] = [clean(i) for i in items if clean(i)]
    return out


# Table 1, Summary of case studies, runs over these pages.
SUMMARY_PAGES = (46, 47)

SUMMARY_COLUMNS = [
    "planningContext",
    "primaryObjectives",
    "keyStakeholders",
    "methodsUsed",
    "resourceRequirements",
    "transferableElements",
]


# Where the table's country column does not match the section heading.
SUMMARY_KEYS = {
    "pac-consortium": "PAC Consortium",
    "kenya": "KCERT 2050 (Kenya Carbon Emission Reduction Tool)",
}


def parse_summary_table(doc):
    """Table 1, keyed by the country column.

    The markdown transcription of this table drops the Resource requirements
    column entirely, which is why it is taken from the PDF.

    Cells are read from the page by rectangle rather than through
    `table.extract()`: the extractor mangles ligatures, turning "efficient"
    into "efcfi ient", while the page text is clean.
    """
    rows = {}
    for page_number in SUMMARY_PAGES:
        page = doc[page_number - 1]
        for table in page.find_tables().tables:
            for row in table.rows:
                cells = [
                    clean(page.get_textbox(pymupdf.Rect(c))) if c else ""
                    for c in row.cells
                ]
                if not cells or not cells[0] or cells[0].startswith("Country"):
                    continue
                rows[cells[0]] = dict(zip(SUMMARY_COLUMNS, cells[1:]))
    return rows


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    doc = pymupdf.open(PDF)

    summary = parse_summary_table(doc)

    studies = []
    for case_id, (first, second) in PAGES.items():
        record = parse_first_page(doc[first - 1])
        record.update(parse_second_page(body_text(doc[second - 1])))
        record["id"] = case_id
        # Match the table row by its country column. Most match on name, but
        # the table says "PAC Consortium" where the section says "PARIS
        # AGREEMENT COMPATIBLE (PAC) SCENARIO CONSORTIUM".
        key = SUMMARY_KEYS.get(case_id) or next(
            (k for k in summary if k.lower() in record["name"].lower()
             or record["name"].lower().startswith(k.lower())),
            None,
        )
        record["summary"] = summary.get(key, {}) if key else {}
        record["summaryKey"] = key
        studies.append(record)

    # Written to a file rather than stdout: pymupdf prints an advisory notice
    # to stdout, which would corrupt the JSON.
    out = sys.argv[1] if len(sys.argv) > 1 else "case-studies-extracted.json"
    with open(out, "w", encoding="utf-8") as handle:
        json.dump(studies, handle, indent=2, ensure_ascii=False)
    print(f"{len(studies)} case studies -> {out}")


if __name__ == "__main__":
    main()
