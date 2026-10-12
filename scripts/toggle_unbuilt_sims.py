#!/usr/bin/env python3
"""Hide chapter iframes for MicroSims that haven't been built yet, and restore them once they are.

Each chapter embeds its MicroSims with an iframe pointing at docs/sims/<sim-id>/main.html.
`mkdocs build --strict` doesn't check iframe targets, so an unbuilt sim shows up on the
published site as an empty or "page not found" frame. This script wraps those iframes in an
HTML comment tagged SIM-NOT-BUILT, leaving the spec in place. Run it again after building
sims: any hidden iframe whose main.html now exists is restored.

Usage:
    python3 scripts/toggle_unbuilt_sims.py           # apply changes
    python3 scripts/toggle_unbuilt_sims.py --check   # report only, change nothing
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CHAPTERS = ROOT / "docs" / "chapters"
SIMS = ROOT / "docs" / "sims"

IFRAME = re.compile(r'<iframe src="\.\./\.\./sims/([a-z0-9-]+)/main\.html"[^>]*></iframe>')
HIDDEN = re.compile(r'<!-- SIM-NOT-BUILT (<iframe src="\.\./\.\./sims/([a-z0-9-]+)/main\.html"[^>]*></iframe>) -->')


def is_built(sim_id):
    return (SIMS / sim_id / "main.html").is_file()


def process(text):
    hidden, restored = [], []

    def restore(match):
        iframe, sim_id = match.group(1), match.group(2)
        if is_built(sim_id):
            restored.append(sim_id)
            return iframe
        return match.group(0)

    text = HIDDEN.sub(restore, text)

    def hide(match):
        sim_id = match.group(1)
        if is_built(sim_id):
            return match.group(0)
        hidden.append(sim_id)
        return f"<!-- SIM-NOT-BUILT {match.group(0)} -->"

    # Only hide iframes that aren't already inside a SIM-NOT-BUILT comment.
    parts = re.split(r"(<!-- SIM-NOT-BUILT .*? -->)", text)
    text = "".join(p if p.startswith("<!-- SIM-NOT-BUILT") else IFRAME.sub(hide, p) for p in parts)
    return text, hidden, restored


def main():
    check_only = "--check" in sys.argv
    total_hidden = total_restored = 0
    still_hidden = 0
    for path in sorted(CHAPTERS.glob("*/index.md")):
        original = path.read_text()
        updated, hidden, restored = process(original)
        still_hidden += len(HIDDEN.findall(updated))
        if hidden or restored:
            rel = path.relative_to(ROOT)
            for sim_id in hidden:
                print(f"hide     {rel}: {sim_id}")
            for sim_id in restored:
                print(f"restore  {rel}: {sim_id}")
            total_hidden += len(hidden)
            total_restored += len(restored)
            if not check_only:
                path.write_text(updated)
    mode = "would change" if check_only else "changed"
    print(f"\n{mode}: {total_hidden} hidden, {total_restored} restored; "
          f"{still_hidden} sims hidden in total after this run")


if __name__ == "__main__":
    main()
