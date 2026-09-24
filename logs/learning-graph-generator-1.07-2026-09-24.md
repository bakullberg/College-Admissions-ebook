# Learning Graph Generator Session Log

- **Skill:** learning-graph-generator v1.07
- **Date:** 2026-09-24
- **Book:** College Admissions Roadmap

## Python programs used

| Program | Version |
|---|---|
| csv-to-json.py | 1.05 |
| analyze-graph.py | unversioned (copied from skill v1.07) |
| taxonomy-distribution.py | unversioned (copied from skill v1.07) |
| validate-learning-graph.py / .sh | unversioned (copied from skill v1.07); jsonschema installed with `pip3 install --user` |

## Steps

1. **Course description assessment:** skipped. `quality_score: 98` in `docs/course-description.md` is above 85.
2. **Concept list:** 365 concepts generated from the course description and manuscript headings. At the author's request, the 23 University of Iowa–specific concepts were removed and 4 generic ones re-homed, leaving **342 concepts**. All labels are 32 characters or fewer, with no duplicates.
3. **Dependencies:** `learning-graph.csv` written with 569 edges and 5 foundational concepts (College Admissions Process, High School Transcript, Four-Year College, Extracurricular Activities, Cost of Attendance).
4. **Quality analysis:** valid DAG, 0 cycles, 0 orphans, 1 connected component, 78 terminal nodes (22.8%), average 1.69 dependencies, maximum chain length 34. The long chain follows the senior-year calendar (list → apply → decide → enroll). Quality score: 85/100.
5. **Taxonomy:** 13 categories (FOUND, LIST, ORG, TEST, ACAD, ACTV, ESSAY, RECS, PLAT, AID, SCHOL, DEC, WELL), ranging from 3.2% to 11.4% of concepts each. No MISC category was needed.
6. **Taxonomy names, colors, and metadata:** `taxonomy-names.json`, `color-config.json`, and `metadata.json` written.
7. **JSON:** `csv-to-json.py learning-graph.csv learning-graph.json color-config.json metadata.json taxonomy-names.json`. The output passes `validate-learning-graph.sh`. The top concepts by CIS are College Admissions Process, Four-Year College, High School Transcript, and Cost of Attendance, which confirms the edges point the right way.
8. **Taxonomy distribution report:** written to `taxonomy-distribution.md`.
9. **index.md:** generated from `index-template.md`.
10. **Navigation:** the Learning Graph section in `mkdocs.yml` was updated. `mkdocs build --strict` passes.
