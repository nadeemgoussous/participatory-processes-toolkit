"""Pull the chapter 4 engagement tools out of the PDF into JSON.

The markdown transcription rewrote this chapter more heavily than any other.
Chapter 4 contains no bullet lists at all: pages 31 to 44 are prose plus
tables. Every bulleted requirement, prerequisite, strength, challenge and
limitation in the transcription is invented structure over reworded text.

The substance survived that compression - each item does correspond to a real
statement - but the wording did not, so the sections are re-read here and split
into sentences. A sentence is the smallest unit the publication actually
commits to, and it keeps the checklist item-shaped.

The layout marks every section with a bold heading and the practical
considerations with inline bold labels:

    4.1.1  WORKSHOPS                       (ITCAvantGardeStd-Bold, 11pt)
    <opening prose>
    Implementation stage                   (bold heading, then a table)
    Resource requirements and prerequisites
    Practical considerations
      Strengths:  <prose>                  (inline bold label)
      Challenges: <prose>
      Limitations: <prose>
    Implementation evidence
    Box N  <title>                         (AvantGarde bold, then a table)

    pip install pymupdf
    python scripts/extract-tools.py tools-extracted.json
"""

import json
import os
import re
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"

# Tool id -> (section number, first page, last page), pages 1-based.
TOOLS = {
    "workshops": ("4.1.1", 31, 32),
    "surveys": ("4.1.2", 33, 34),
    "interviews": ("4.1.3", 35, 36),
    "committees": ("4.2.1", 37, 38),
    "networks-hubs": ("4.2.2", 39, 40),
    "presentations-reports": ("4.3.1", 41, 42),
    "visualisation-games": ("4.3.2", 43, 44),
}

SECTION_HEADINGS = {
    "Implementation stage": "stage",
    "Resource requirements and prerequisites": "requirements",
    "Practical considerations": "considerations",
    "Implementation evidence": "evidence",
    "Implementation example or evidence": "evidence",
}

INLINE_LABELS = {
    "Strengths:": "strengths",
    "Challenges:": "challenges",
    "Limitations:": "limitations",
}

ODD_SPACE = "[  -​  ‑]"

# The implementation stage table has one row of four cells; the stage labels
# are set above it rather than inside it, so the columns map positionally.
PHASES = ["framing", "development", "validation", "communication"]

# Abbreviations that end in a full stop and must not split a sentence.
ABBREVIATIONS = ("e.g.", "i.e.", "etc.", "cf.", "no.", "vs.", "approx.")


def clean(text):
    # A non-breaking hyphen is a hyphen, not a space: the publication sets
    # "co‑ordination", which must not become "co ordination".
    text = text.replace("‑", "-")
    text = re.sub(ODD_SPACE, " ", text)
    text = text.replace("­", "")
    text = re.sub(r"([-–])\s*\n\s*", r"\1", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    return text.strip()


def sentences(text):
    """Split prose into sentences.

    Each sentence is a verbatim span of the publication, which is what makes a
    checklist item quotable.
    """
    text = clean(text)
    if not text:
        return []
    out, current = [], ""
    for part in re.split(r"(?<=\.)\s+", text):
        current = (current + " " + part).strip() if current else part
        if current.lower().endswith(ABBREVIATIONS):
            continue
        # A sentence that ends mid-clause is usually an abbreviation we missed.
        if len(current) > 1:
            out.append(current)
            current = ""
    if current:
        out.append(current)
    return out


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


def parse_tool(doc, section, first, last):
    record = {
        "name": "",
        "summary": [],
        "requirements": [],
        "strengths": [],
        "challenges": [],
        "limitations": [],
        "evidence": [],
        "stageApplications": {},
        "box": [],
        "boxLabel": "",
    }

    current = "summary"       # before the first heading, the opening prose
    sub = None                # which practical consideration is being read
    buffer = []
    in_box = False
    box_name = None
    box_buffer = []
    box_title_done = False

    def flush_box():
        nonlocal box_buffer, box_name
        lines = [clean(l) for l in box_buffer if clean(l)]
        box_buffer = []
        if box_name:
            description = clean(join_lines(lines))
            if description:
                record["box"].append({"name": box_name, "description": description})
        elif lines:
            # Box 4 lists activities with no descriptions. An item wraps onto
            # the next line when that line does not start a new one.
            items = []
            for line in lines:
                if items and (line[:1].islower() or line.startswith("(")):
                    separator = "" if items[-1].endswith("(") else " "
                    items[-1] += separator + line
                else:
                    items.append(line)
            record["box"].extend({"name": i, "description": ""} for i in items)
        box_name = None

    def flush():
        nonlocal buffer
        text = join_lines(buffer)
        buffer = []
        if not text.strip():
            return
        if current == "considerations" and sub:
            record[sub].extend(sentences(text))
        elif current in ("summary", "requirements", "evidence"):
            record[current].extend(sentences(text))

    for page_number in (first, last):
        page = doc[page_number - 1]

        # The implementation stage is a four-column table whose stage labels
        # are set above it rather than inside it, so the columns are mapped
        # positionally.
        for table in page.find_tables().tables:
            rows = [
                [clean(cell_text(page, pymupdf.Rect(c))) if c else "" for c in row.cells]
                for row in table.rows
            ]
            rows = [r for r in rows if any(r)]
            if len(rows) == 1 and len(rows[0]) == 4:
                for phase, application in zip(PHASES, rows[0]):
                    if application:
                        record["stageApplications"][phase] = application

        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                line_parts = []
                for span in line["spans"]:
                    raw = span["text"]
                    text = re.sub(ODD_SPACE, " ", raw).strip()
                    if not text or span["size"] < 8:
                        continue

                    font, size = span["font"], span["size"]

                    # The box heading is set a half point smaller than the tool
                    # heading, so it needs its own threshold.
                    if "AvantGarde" in font and size >= 9.5 and text.startswith("Box"):
                        flush()
                        in_box = True
                        record["boxLabel"] = text
                        line_parts = []
                        continue
                    if in_box and "AvantGarde" in font:
                        # The box title runs on from "Box N" in the same face.
                        # Later spans in that face belong to the box contents,
                        # so stop once a title is there.
                        # A colon marks an entry name, not part of the title.
                        if not box_title_done and not text.endswith(":"):
                            record["boxLabel"] = (record["boxLabel"] + " " + text).strip()
                        line_parts = []
                        continue

                    if "AvantGarde" in font and size >= 10.5:
                        if text == section:
                            record["name"] = ""
                            line_parts = []
                            continue
                        if not record["name"] and text.isupper():
                            record["name"] = text
                        line_parts = []
                        continue

                    if in_box:
                        # Past the title now; later headings are contents.
                        box_title_done = True
                        # Box entries are a bold name ending in a colon,
                        # followed by prose.
                        if font.endswith("-Bold") and text.endswith(":"):
                            flush_box()
                            box_name = text.rstrip(":").strip()
                        else:
                            box_buffer.append(raw)
                        line_parts = []
                        continue

                    if font.endswith("-Bold") and text in SECTION_HEADINGS:
                        flush()
                        current = SECTION_HEADINGS[text]
                        sub = None
                        line_parts = []
                        continue
                    if font.endswith("-Bold") and text in INLINE_LABELS:
                        flush()
                        sub = INLINE_LABELS[text]
                        line_parts = []
                        continue
                    if current == "stage":
                        # handled by the table reader
                        line_parts = []
                        continue

                    line_parts.append(raw)
                if line_parts:
                    buffer.append("".join(line_parts))

    flush()
    flush_box()

    # Box 3 sets its three interview types side by side: a row of labels above a
    # row of descriptions, which the span walk reads as one run of text.
    if record["boxLabel"]:
        for page_number in (first, last):
            page = doc[page_number - 1]
            for table in page.find_tables().tables:
                rows = [
                    [clean(cell_text(page, pymupdf.Rect(c))) if c else "" for c in row.cells]
                    for row in table.rows
                ]
                rows = [r for r in rows if any(r)]
                labels = [c for c in rows[0] if c] if rows else []
                if len(rows) == 2 and labels and all(c.endswith(":") for c in labels):
                    record["box"] = [
                        {"name": name.rstrip(":").strip(), "description": description}
                        for name, description in zip(rows[0], rows[1])
                        if name and description
                    ]
    return record


def cell_text(page, rect):
    lines = []
    for block in page.get_text("dict", clip=rect)["blocks"]:
        for line in block.get("lines", []):
            parts = [s["text"] for s in line["spans"] if s["size"] >= 8.0]
            if parts:
                lines.append("".join(parts))
    return "\n".join(lines)


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    doc = pymupdf.open(PDF)

    out = []
    for tool_id, (section, first, last) in TOOLS.items():
        record = parse_tool(doc, section, first, last)
        record["id"] = tool_id
        record["toolkitSection"] = section
        out.append(record)

    path = sys.argv[1] if len(sys.argv) > 1 else "tools-extracted.json"
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(out, handle, indent=2, ensure_ascii=False)
    print(f"{len(out)} tools -> {path}")


if __name__ == "__main__":
    main()
