#!/usr/bin/env python3
"""Build the book's manuscript into a single designed PDF with a cover and table of contents."""

import os
import re

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas as canvas_lib
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    ListFlowable,
    ListItem,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)
from reportlab.platypus.tableofcontents import TableOfContents

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MANUSCRIPT = os.path.join(ROOT, "manuscript")
OUT_PATH = os.path.join(ROOT, "dist", "College-Admissions-Roadmap.pdf")

PAGE_W, PAGE_H = 6 * inch, 9 * inch
MARGIN = 0.72 * inch

NAVY = colors.HexColor("#1B2A4A")
NAVY_DARK = colors.HexColor("#121D33")
GOLD = colors.HexColor("#C9A24B")
CREAM = colors.HexColor("#F6F1E4")
INK = colors.HexColor("#1A1A1A")
MUTED = colors.HexColor("#565656")
RULE = colors.HexColor("#C9A24B")

TITLE = "College Admissions Roadmap"
SUBTITLE = "A Step-by-Step Guide to Applying, Paying, and Choosing Well"
TAGLINE = "With a Case Study: The University of Iowa"

# ---------------------------------------------------------------------------
# Book structure: (kind, path or title, toc_level)
# kind is one of: "part", "file"
# ---------------------------------------------------------------------------
BOOK = [
    ("file", "manuscript/preface/preface.md", 0),
    ("part", "Part One", "Laying the Groundwork"),
    ("file", "manuscript/part-1-laying-the-groundwork/01-understanding-how-admissions-works.md", 1),
    ("file", "manuscript/part-1-laying-the-groundwork/02-building-your-college-list.md", 1),
    ("file", "manuscript/part-1-laying-the-groundwork/03-getting-organized.md", 1),
    ("part", "Part Two", "Testing & Academics"),
    ("file", "manuscript/part-2-testing-and-academics/04-the-sat-act-question.md", 1),
    ("file", "manuscript/part-2-testing-and-academics/05-your-senior-year-course-load.md", 1),
    ("part", "Part Three", "Building the Application"),
    ("file", "manuscript/part-3-building-the-application/06-activities-and-resume.md", 1),
    ("file", "manuscript/part-3-building-the-application/07-the-personal-essay.md", 1),
    ("file", "manuscript/part-3-building-the-application/08-supplemental-essays.md", 1),
    ("file", "manuscript/part-3-building-the-application/09-letters-of-recommendation.md", 1),
    ("file", "manuscript/part-3-building-the-application/10-filling-out-the-common-app-coalition-app.md", 1),
    ("file", "manuscript/part-3-building-the-application/11-interviews.md", 1),
    ("part", "Part Four", "Paying for College"),
    ("file", "manuscript/part-4-paying-for-college/12-understanding-financial-aid.md", 1),
    ("file", "manuscript/part-4-paying-for-college/13-scholarships.md", 1),
    ("file", "manuscript/part-4-paying-for-college/14-comparing-award-letters.md", 1),
    ("part", "Part Five", "Decisions & the Finish Line"),
    ("file", "manuscript/part-5-decisions-and-the-finish-line/15-waiting-and-managing-anxiety.md", 1),
    ("file", "manuscript/part-5-decisions-and-the-finish-line/16-handling-decisions.md", 1),
    ("file", "manuscript/part-5-decisions-and-the-finish-line/17-making-your-final-choice.md", 1),
    ("file", "manuscript/part-5-decisions-and-the-finish-line/18-getting-ready-for-fall.md", 1),
    ("file", "manuscript/appendix/month-by-month-planner.md", 0),
    ("file", "manuscript/case-study-university-of-iowa/case-study-university-of-iowa.md", 0),
]

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------
styles = {
    "PartLabel": ParagraphStyle(
        "PartLabel", fontName="Helvetica", fontSize=13, leading=16,
        textColor=GOLD, alignment=TA_CENTER, spaceAfter=6,
    ),
    "PartTitle": ParagraphStyle(
        "PartTitle", fontName="Helvetica-Bold", fontSize=26, leading=31,
        textColor=NAVY, alignment=TA_CENTER, spaceAfter=0,
    ),
    "ChapterTitle": ParagraphStyle(
        "ChapterTitle", fontName="Helvetica-Bold", fontSize=19, leading=23,
        textColor=NAVY, spaceBefore=0, spaceAfter=14,
    ),
    "H2": ParagraphStyle(
        "H2", fontName="Helvetica-Bold", fontSize=13, leading=16,
        textColor=NAVY, spaceBefore=16, spaceAfter=8,
    ),
    "Body": ParagraphStyle(
        "Body", fontName="Times-Roman", fontSize=10.3, leading=15,
        textColor=INK, alignment=TA_JUSTIFY, spaceAfter=9,
    ),
    "Status": ParagraphStyle(
        "Status", fontName="Times-Italic", fontSize=9.5, leading=13,
        textColor=MUTED, spaceAfter=9,
    ),
    "Bullet": ParagraphStyle(
        "Bullet", fontName="Times-Roman", fontSize=10.3, leading=14.5,
        textColor=INK, spaceAfter=4,
    ),
    "Quote": ParagraphStyle(
        "Quote", fontName="Times-Italic", fontSize=10.3, leading=15,
        textColor=NAVY, leftIndent=18, rightIndent=18, spaceBefore=6, spaceAfter=10,
    ),
    "TOCHeading": ParagraphStyle(
        "TOCHeading", fontName="Helvetica-Bold", fontSize=20, leading=24,
        textColor=NAVY, alignment=TA_CENTER, spaceAfter=22,
    ),
}

toc_style_0 = ParagraphStyle(
    "TOCLevel0", fontName="Helvetica-Bold", fontSize=11.5, leading=20,
    textColor=NAVY, spaceBefore=10,
)
toc_style_1 = ParagraphStyle(
    "TOCLevel1", fontName="Helvetica", fontSize=10, leading=16,
    textColor=INK, leftIndent=16,
)

# ---------------------------------------------------------------------------
# Inline markdown -> reportlab mini-markup
# ---------------------------------------------------------------------------
def escape_xml(text):
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline_md(text):
    text = escape_xml(text)
    text = re.sub(
        r"\[([^\]]+)\]\((https?://[^\)]+)\)",
        r'<link href="\2" color="#1B2A4A"><u>\1</u></link>',
        text,
    )
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"(?<!\w)\*(?!\*)(.+?)(?<!\*)\*(?!\w)", r"<i>\1</i>", text)
    text = re.sub(r"`([^`]+)`", r'<font face="Courier">\1</font>', text)
    return text


BULLET = "•"


def markdown_to_flowables(path, toc_level):
    """Parse one chapter's markdown file into a list of flowables."""
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        lines = f.read().splitlines()

    flow = []
    bullets = []
    ordered = []

    def flush_bullets():
        if bullets:
            flow.append(
                ListFlowable(
                    [ListItem(Paragraph(b, styles["Bullet"]), leftIndent=6) for b in bullets],
                    bulletType="bullet",
                    bulletChar=BULLET,
                    bulletFontName="Helvetica",
                    bulletFontSize=8,
                    leftIndent=16,
                    spaceAfter=8,
                )
            )
            bullets.clear()

    def flush_ordered():
        if ordered:
            flow.append(
                ListFlowable(
                    [ListItem(Paragraph(b, styles["Bullet"]), leftIndent=6) for b in ordered],
                    bulletType="1",
                    bulletFontName="Helvetica",
                    bulletFontSize=8,
                    leftIndent=16,
                    spaceAfter=8,
                )
            )
            ordered.clear()

    first_heading_seen = False

    for raw in lines:
        line = raw.strip()

        if not line:
            continue

        m1 = re.match(r"^#\s+(.*)", line)
        m2 = re.match(r"^##\s+(.*)", line)
        mb = re.match(r"^-\s+(.*)", line)
        mo = re.match(r"^\d+\.\s+(.*)", line)
        mq = re.match(r"^>\s?(.*)", line)

        if m1:
            flush_bullets()
            flush_ordered()
            style_name = "PartTitle" if toc_level == 0 else "ChapterTitle"
            p = Paragraph(inline_md(m1.group(1)), styles[style_name])
            p._toc_level = toc_level
            p._toc_title = m1.group(1)
            flow.append(p)
            first_heading_seen = True
            continue

        if m2:
            flush_bullets()
            flush_ordered()
            flow.append(Paragraph(inline_md(m2.group(1)), styles["H2"]))
            continue

        if mb:
            flush_ordered()
            bullets.append(inline_md(mb.group(1)))
            continue

        if mo:
            flush_bullets()
            ordered.append(inline_md(mo.group(1)))
            continue

        if mq:
            flush_bullets()
            flush_ordered()
            flow.append(Paragraph(inline_md(mq.group(1)), styles["Quote"]))
            continue

        flush_bullets()
        flush_ordered()
        style = "Status" if line.startswith("*Status:") else "Body"
        flow.append(Paragraph(inline_md(line), styles[style]))

    flush_bullets()
    flush_ordered()
    return flow


def part_divider(number_label, title):
    p1 = Paragraph(number_label.upper(), styles["PartLabel"])
    p2 = Paragraph(title, styles["PartTitle"])
    p2._toc_level = 0
    p2._toc_title = f"{number_label}: {title}"
    return [
        Spacer(1, 2.6 * inch),
        _gold_rule(),
        Spacer(1, 0.18 * inch),
        p1,
        p2,
        Spacer(1, 0.18 * inch),
        _gold_rule(),
    ]


def _gold_rule():
    return Paragraph(
        '<para alignment="center"><font color="#C9A24B">— &#10022; —</font></para>',
        ParagraphStyle("rule", fontName="Helvetica", fontSize=11, alignment=TA_CENTER),
    )


# ---------------------------------------------------------------------------
# Cover art
# ---------------------------------------------------------------------------
def draw_cover(c, doc):
    c.saveState()
    c.setFillColor(NAVY_DARK)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # subtle top/bottom gold rules
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.line(0.7 * inch, PAGE_H - 1.15 * inch, PAGE_W - 0.7 * inch, PAGE_H - 1.15 * inch)
    c.line(0.7 * inch, 1.55 * inch, PAGE_W - 0.7 * inch, 1.55 * inch)

    # winding "roadmap" path with six waypoints (build list -> test -> apply -> aid -> decide -> enroll)
    c.setStrokeColor(GOLD)
    c.setLineWidth(2.2)
    path = c.beginPath()
    pts = [
        (1.1 * inch, 2.3 * inch),
        (2.0 * inch, 2.9 * inch),
        (1.7 * inch, 3.4 * inch),
        (2.9 * inch, 3.8 * inch),
        (3.5 * inch, 4.25 * inch),
        (4.6 * inch, 4.5 * inch),
        (4.9 * inch, 4.5 * inch),
    ]
    path.moveTo(*pts[0])
    for x, y in pts[1:]:
        path.lineTo(x, y)
    c.drawPath(path, stroke=1, fill=0)

    for x, y in pts[:-1]:
        c.setFillColor(GOLD)
        c.circle(x, y, 3.2, fill=1, stroke=0)
    # final waypoint as a small star
    _draw_star(c, pts[-1][0], pts[-1][1], 7)

    # Title block
    c.setFillColor(CREAM)
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 2.05 * inch, "College Admissions")
    c.drawCentredString(PAGE_W / 2, PAGE_H - 2.55 * inch, "Roadmap")

    c.setFont("Helvetica", 12.5)
    c.setFillColor(GOLD)
    _wrap_centered(c, SUBTITLE, PAGE_W / 2, PAGE_H - 3.05 * inch, 34, 16)

    c.setFont("Helvetica-Oblique", 10)
    c.setFillColor(CREAM)
    c.drawCentredString(PAGE_W / 2, 1.95 * inch, TAGLINE)

    c.setFont("Helvetica", 9)
    c.setFillColor(GOLD)
    c.drawCentredString(PAGE_W / 2, 1.05 * inch, "A GUIDE FOR STUDENTS, FAMILIES & COUNSELORS")

    c.restoreState()


def _wrap_centered(c, text, x, y, max_chars, leading):
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if len(trial) > max_chars:
            lines.append(cur)
            cur = w
        else:
            cur = trial
    if cur:
        lines.append(cur)
    for i, line in enumerate(lines):
        c.drawCentredString(x, y - i * leading, line)


def _draw_star(c, cx, cy, r):
    import math

    c.setFillColor(GOLD)
    points = []
    for i in range(10):
        ang = math.pi / 2 + i * math.pi / 5
        rad = r if i % 2 == 0 else r * 0.42
        points.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    p = c.beginPath()
    p.moveTo(*points[0])
    for pt in points[1:]:
        p.lineTo(*pt)
    p.close()
    c.drawPath(p, fill=1, stroke=0)


# ---------------------------------------------------------------------------
# Body page chrome (footer + running title)
# ---------------------------------------------------------------------------
def draw_body(c, doc):
    c.saveState()
    c.setFont("Helvetica", 8)
    c.setFillColor(MUTED)
    c.drawCentredString(PAGE_W / 2, 0.5 * inch, str(c.getPageNumber() - 1))
    c.setStrokeColor(colors.HexColor("#D8D2C0"))
    c.setLineWidth(0.5)
    c.line(MARGIN, 0.68 * inch, PAGE_W - MARGIN, 0.68 * inch)
    c.restoreState()


# ---------------------------------------------------------------------------
# Document template with TOC + bookmark wiring
# ---------------------------------------------------------------------------
class BookDocTemplate(BaseDocTemplate):
    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and hasattr(flowable, "_toc_level"):
            level = flowable._toc_level
            title = flowable._toc_title
            key = f"toc-{id(flowable)}"
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(title, key, level=level, closed=0)
            self.notify("TOCEntry", (level, title, self.page, key))


def build():
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)

    doc = BookDocTemplate(
        OUT_PATH,
        pagesize=(PAGE_W, PAGE_H),
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.75 * inch,
        bottomMargin=0.85 * inch,
        title=TITLE,
        author="Beth",
    )

    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, 0, 0, 0, 0, id="cover")
    body_frame = Frame(
        MARGIN, doc.bottomMargin, PAGE_W - 2 * MARGIN,
        PAGE_H - doc.topMargin - doc.bottomMargin, id="body",
    )

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=draw_cover),
        PageTemplate(id="Body", frames=[body_frame], onPage=draw_body),
    ])

    # Page 1 renders with the default (first) template, "Cover" — the cover
    # art is drawn entirely by draw_cover() via onPage, so the frame content
    # here is an invisible placeholder. Then switch to "Body" for everything else.
    story = [Spacer(0, 0), NextPageTemplate("Body"), PageBreak()]

    # --- Table of contents ---
    story.append(Paragraph("Contents", styles["TOCHeading"]))
    toc = TableOfContents()
    toc.levelStyles = [toc_style_0, toc_style_1]
    toc.dotsMinLevel = 0
    story.append(toc)

    # --- Chapters ---
    for item in BOOK:
        if item[0] == "part":
            _, label, title = item
            story.append(NextPageTemplate("Body"))
            story.append(PageBreak())
            story.extend(part_divider(label, title))
        else:
            _, path, toc_level = item
            story.append(NextPageTemplate("Body"))
            story.append(PageBreak())
            story.extend(markdown_to_flowables(path, toc_level))

    doc.multiBuild(story)
    print(f"Wrote {OUT_PATH}")


if __name__ == "__main__":
    build()
