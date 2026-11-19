#!/usr/bin/env python3
"""Sanitize {@link …} in catalog descriptions (both copies)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(ROOT / "docs/api/coverage"))
from sanitize_javadoc import sanitize_javadoc_text  # noqa: E402

CATALOGS = [
    ROOT / "docs/api/coverage/catalog.json",
    ROOT / "tools/giddh-api-explorer/public/data/catalog.json",
]


def main() -> None:
    changed = 0
    for path in CATALOGS:
        data = json.loads(path.read_text())
        for record in data.get("records", []):
            desc = record.get("description")
            if not desc:
                continue
            fixed = sanitize_javadoc_text(desc)
            if fixed != desc:
                record["description"] = fixed
                changed += 1
        path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")) + "\n")
        print(f"updated {path.relative_to(ROOT)}")
    print(f"descriptions sanitized: {changed}")


if __name__ == "__main__":
    main()
