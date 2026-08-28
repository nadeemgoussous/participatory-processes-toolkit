"""Pull the chapter 3 stakeholder sections out of the PDF into JSON.

The markdown transcription reworded this chapter, turned prose into invented
bullet lists, truncated sentences, and added a "Summary: Stakeholder Engagement
Matrix" that does not appear in the publication at all.

The publication sets each section as:

    3.N  NAME                                          (ITCAvantGardeStd-Bold)
    Who are they?  <prose>                             (bold label, then Book)
    Why engage them?  <prose>
    What is the benefit for them?  <prose>
    Challenges in engaging with this stakeholder       (bold heading)
      * Label: <prose>                                 (bold lead-in, then Book)
    Good practices collected                           (bold heading)
      * <prose>

    pip install pymupdf
    python scripts/extract-stakeholders.py stakeholders-extracted.json
"""

import json
import os
import re
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"

# Stakeholder id -> (1-based page, section number).
SECTIONS = {
    "policy-makers": (20, "3.1"),
    "grid-operators": (21, "3.2"),
    "industry": (22, "3.3"),
    "public": (23, "3.4"),
    "csos-ngos": (24, "3.5"),
    "scientific": (25, "3.6"),
    "finance": (26, "3.7"),
}

# The bold labels that open a section, in order.
FIELD_LABELS = {
    "Who are they?": "whoAreThey",
    "Why engage them?": "whyEngage",
    "What is the benefit for them?": "benefit",
}
CHALLENGES_HEADING = "Challenges in engaging with this stakeholder"
PRACTICES_HEADING = "Good practices collected"

# Thin, hair and non-breaking spaces, plus the non-breaking hyphen. Written as
# escapes: a literal class of these characters reads as a range from space to
# U+200B, which matches nearly everything.
ODD_SPACE = "[  -​  ]"


def clean(text):
    text = re.sub(ODD_SPACE, " ", text)
    text = text.replace("­", "")
    text = re.sub(r"([-–])\s*\n\s*", r"\1", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    return text.strip()


def parse_section(page, section):
    """Walk the spans, switching buffer whenever a bold label appears."""
    record = {
        "name": "",
        "whoAreThey": [],
        "whyEngage": [],
        "benefit": [],
        "challenges": [],
        "goodPractices": [],
    }

    current = None          # which field the prose belongs to
    bullet_label = None     # bold lead-in of the current challenge bullet
    buffer = []

    def join_lines(lines):
        """Join lines of a paragraph.

        Spans split mid-word around italics, so a line's spans are concatenated
        with nothing; joining every span with a space produces "( e.g." and
        "cross- sectoral". A line ending in a hyphen continues the word.
        """
        out = ""
        for line in lines:
            if not out:
                out = line
            elif out.endswith(("-", "–")):
                out += line
            else:
                out += " " + line
        return out

    def flush():
        nonlocal buffer, bullet_label
        text = clean(join_lines(buffer))
        buffer = []
        if not text:
            bullet_label = None
            return
        if current == "challenges":
            record["challenges"].append(
                {"challenge": bullet_label or "", "description": text}
            )
        elif current == "goodPractices":
            record["goodPractices"].append(text)
        elif current:
            record[current].append(text)
        bullet_label = None

    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            line_parts = []
            for span in line["spans"]:
                raw = span["text"]
                text = raw.strip()
                if not text or span["size"] < 8:
                    continue

                if "AvantGarde" in span["font"]:
                    # The chapter tabs down the outer edge of the page are set
                    # in the same face; keep only the heading in the text
                    # column.
                    if span["bbox"][0] < 420:
                        record["name"] += raw
                    continue

                bold = span["font"].endswith("-Bold")
                stripped = re.sub(ODD_SPACE, " ", text).strip()
                bare = stripped.lstrip("•\t ").strip()

                if bold and stripped in FIELD_LABELS:
                    flush()
                    current = FIELD_LABELS[stripped]
                    line_parts = []
                    continue
                if bold and stripped == CHALLENGES_HEADING:
                    flush()
                    current = "challenges"
                    line_parts = []
                    continue
                if bold and stripped == PRACTICES_HEADING:
                    flush()
                    current = "goodPractices"
                    line_parts = []
                    continue
                if bold and stripped.startswith("•"):
                    # A new bullet. Its bold lead-in is the challenge label,
                    # where the section uses one.
                    flush()
                    bullet_label = bare.rstrip(":").strip() if bare else None
                    line_parts = []
                    continue
                if stripped.startswith("•"):
                    flush()
                    line_parts = [bare] if bare else []
                    continue

                line_parts.append(raw)
            if line_parts:
                buffer.append("".join(line_parts))

    flush()

    record["name"] = clean(re.sub(r"^\s*" + re.escape(section) + r"\s*", "", record["name"]))
    return record


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    doc = pymupdf.open(PDF)

    out = []
    for stakeholder_id, (page_number, section) in SECTIONS.items():
        record = parse_section(doc[page_number - 1], section)
        record["id"] = stakeholder_id
        record["toolkitSection"] = section
        out.append(record)

    path = sys.argv[1] if len(sys.argv) > 1 else "stakeholders-extracted.json"
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(out, handle, indent=2, ensure_ascii=False)
    print(f"{len(out)} stakeholder sections -> {path}")


if __name__ == "__main__":
    main()
