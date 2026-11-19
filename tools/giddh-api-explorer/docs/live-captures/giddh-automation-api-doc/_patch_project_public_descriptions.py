#!/usr/bin/env python3
"""Publicize endpoint descriptions in local DocStar draft JSON artifacts."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[3]
sys.path.insert(0, str(REPO / "docs/api/coverage"))
from sanitize_javadoc import (  # noqa: E402
    publicize_endpoint_description,
    publicize_sample_response_description,
)

TARGETS = sorted(ROOT.glob("docstar*.json"))


def publicize_any_description(text: str) -> str:
    if "Thrown in " in text or text.lower().startswith("verified from controller"):
        return publicize_sample_response_description(text)
    return publicize_endpoint_description(text)


def walk_value(value, stats: dict):
    if isinstance(value, dict):
        if "description" in value and isinstance(value["description"], str):
            old = value["description"]
            new = publicize_any_description(old)
            if new != old:
                value["description"] = new
                stats["fields"] += 1
        if "sampleResponse" in value and isinstance(value["sampleResponse"], list):
            for sample in value["sampleResponse"]:
                if isinstance(sample, dict) and isinstance(sample.get("description"), str):
                    old = sample["description"]
                    new = publicize_sample_response_description(old)
                    if new != old:
                        sample["description"] = new
                        stats["fields"] += 1
        for child in value.values():
            walk_value(child, stats)
    elif isinstance(value, list):
        for item in value:
            walk_value(item, stats)


def main() -> None:
    stats = {"files": 0, "fields": 0}
    for path in TARGETS:
        if not path.is_file():
            continue
        data = json.loads(path.read_text())
        before = stats["fields"]
        walk_value(data, stats)
        if stats["fields"] > before:
            path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
            stats["files"] += 1
    print(json.dumps(stats))


if __name__ == "__main__":
    main()
