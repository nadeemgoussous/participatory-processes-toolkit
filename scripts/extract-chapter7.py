"""Pull chapter 7 out of the PDF into JSON.

Chapter 7 is prose with no tables. The markdown transcription reworded every
description and added a "Quick Reference: Tool Categories" table that the
publication does not contain.

The layout is consistent:

    7.1  PUBLICATIONS                     (AvantGarde caps)
    TITLE OF THE PUBLICATION              (AvantGarde caps)
    Author names                          (bold)
    <prose>  <link>
    7.2  TOOLS AND PLATFORMS
    REPOSITORIES                          (AvantGarde caps)
    Facilitator School:  <prose>          (bold name, then prose)

    pip install pymupdf
    python scripts/extract-chapter7.py chapter7-extracted.json
"""

import json
import os
import re
import sys

import pymupdf

PDF = "archive/source-materials/IRENA_PLA_LTES_Participatory_processes_toolkit_2025 (1).pdf"
PAGES = range(76, 80)

# Headings that open a group of entries, as printed.
GROUP_HEADINGS = {
    "PUBLICATIONS": "publications",
    "REPOSITORIES": "repositories",
    "SURVEY PLATFORMS": "survey-platforms",
    "CO-CREATION PLATFORMS": "co-creation-platforms",
    "DATA VISUALISATION": "data-visualisation",
    "FRAMEWORKS": "frameworks",
}

ODD_SPACE = "[  -​  ]"
# Links are set without the scheme ("www.ucc.ie/..."), while the page carries
# the canonical address as a link annotation. The visible text locates the
# link; the annotation supplies it.
URL = re.compile(r"(?:https?://|www\.)\S+")


def clean(text):
    text = text.replace("‑", "-")
    text = re.sub(ODD_SPACE, " ", text)
    text = text.replace("­", "")
    text = re.sub(r"([-–])\s*\n\s*", r"\1", text)
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s+([,.;:])", r"\1", text)
    return text.strip()


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


def main():
    if not os.path.exists(PDF):
        sys.exit(f"source PDF not found: {PDF}")
    doc = pymupdf.open(PDF)

    groups = {key: [] for key in GROUP_HEADINGS.values()}
    annotations = []
    group = None
    entry = None
    buffer = []

    def flush():
        nonlocal buffer, entry
        text = clean(join_lines(buffer))
        buffer = []
        if entry is None:
            return
        found = [l.rstrip(".,") for l in URL.findall(text)]
        entry["description"] = clean(URL.sub("", text))
        # Prefer the annotation, which carries the scheme.
        links = []
        for visible in found:
            stem = visible[4:] if visible.startswith("www.") else visible
            match = next((a for a in annotations if stem.rstrip("/") in a), None)
            links.append(match or ("https://" + visible if visible.startswith("www.") else visible))
        # A long link wraps, so part of it survives URL.sub as a stray token.
        # Anything that is a fragment of one of this page's links is dropped.
        words = entry["description"].split()
        kept = [
            w for w in words
            # Only URL-shaped tokens: an ordinary word may also appear inside
            # a link ("renewable"), and must not be removed from the prose.
            if not (("_" in w or "/" in w or w.startswith("www."))
                    and any(w.strip(".,()") in a for a in annotations))
        ]
        entry["description"] = clean(" ".join(kept))
        entry["links"] = links
        groups[group].append(entry)
        entry = None

    for page_number in PAGES:
        page = doc[page_number - 1]
        annotations.extend(
            link["uri"] for link in page.get_links() if link.get("uri")
        )
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                if line["bbox"][0] > 520:
                    continue
                line_parts = []
                for span in line["spans"]:
                    raw = span["text"]
                    text = re.sub(ODD_SPACE, " ", raw).strip()
                    if not text or span["size"] < 8:
                        continue
                    font, size = span["font"], span["size"]

                    # The layout distinguishes these by weight rather than by
                    # case: group headings are Bold, publication titles Demi
                    # and their authors Bk, all in the same family.
                    if "AvantGarde" in font and size >= 9.5:
                        upper = text.upper().strip()
                        matched = next(
                            (v for k, v in GROUP_HEADINGS.items() if upper.startswith(k)),
                            None,
                        )
                        if matched:
                            flush()
                            group = matched
                            line_parts = []
                            continue
                        if group == "publications" and font.endswith("-Demi"):
                            if entry and not entry.get("_titleClosed"):
                                entry["title"] += " " + text
                            else:
                                flush()
                                entry = {"title": text, "author": "", "_titleClosed": False}
                            line_parts = []
                            continue
                        if group == "publications" and font.endswith("-Bk") and entry:
                            entry["_titleClosed"] = True
                            entry["author"] = clean(
                                (entry["author"] + " " + text) if entry["author"] else text
                            )
                            line_parts = []
                            continue
                        continue

                    if group and group != "publications" and font.endswith("-Bold") and text.endswith(":"):
                        flush()
                        entry = {"name": text.rstrip(":").strip()}
                        # The description starts on this same line, so the rest
                        # of the spans still belong to it.
                        continue

                    line_parts.append(raw)
                if line_parts:
                    buffer.append("".join(line_parts))

    flush()

    for items in groups.values():
        for item in items:
            item.pop("_titleClosed", None)
            if "title" in item:
                item["title"] = clean(item["title"])

    path = sys.argv[1] if len(sys.argv) > 1 else "chapter7-extracted.json"
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(groups, handle, indent=2, ensure_ascii=False)
    for key, items in groups.items():
        print(f"{key:<24} {len(items)} entries")
    print(f"-> {path}")


if __name__ == "__main__":
    main()
