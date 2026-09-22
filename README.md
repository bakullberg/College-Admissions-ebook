# College Admissions Roadmap

A guide to the college admissions process, written to the student (and useful alongside a parent or counselor).

See [OUTLINE.md](OUTLINE.md) for the full book outline.

## Structure

- `manuscript/preface/` — the quick-start synopsis
- `manuscript/part-1-laying-the-groundwork/` — Chapters 1–3
- `manuscript/part-2-testing-and-academics/` — Chapters 4–5
- `manuscript/part-3-building-the-application/` — Chapters 6–11
- `manuscript/part-4-paying-for-college/` — Chapters 12–14
- `manuscript/part-5-decisions-and-the-finish-line/` — Chapters 15–18
- `manuscript/appendix/` — month-by-month senior year planner
- `manuscript/case-study-university-of-iowa/` — the process applied to a real school, University of Iowa
- `scripts/build_pdf.py` — builds the manuscript into a designed PDF with a cover, table of contents, and PDF bookmarks
- `dist/College-Admissions-Roadmap.pdf` — the built book
- `assets/` — images, diagrams, and other supporting files

## Status

Full first draft complete — preface, all 18 chapters, appendix, and the University of Iowa case study are written, and the book builds to a designed PDF.

## Building the PDF

```bash
python3 -m pip install --user reportlab markdown pypdf
python3 scripts/build_pdf.py
```

Regenerate after editing any manuscript file — the script reads the Markdown source directly and rebuilds `dist/College-Admissions-Roadmap.pdf` from scratch, including the table of contents and page numbers.
