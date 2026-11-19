#!/usr/bin/env python3
"""Emit compact update_endpoint payloads for agent/MCP bulk apply (stdout JSON lines)."""

from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BATCH_DIR = ROOT / ".docstar-param-batches"


def patch_args(item: dict) -> dict:
    args = dict(item.get("args") or {})
    out = {"orgId": args.get("orgId", "83427"), "endpointId": args["endpointId"]}
    for key in ("description", "params", "body", "bodyDescription"):
        val = args.get(key)
        if val is None:
            continue
        if key == "bodyDescription" and val == {}:
            continue
        if key == "params" and val == {}:
            continue
        out[key] = val
    return out


def main() -> None:
    start = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 10**9
    items: list[dict] = []
    for path in sorted(BATCH_DIR.glob("batch-*.json")):
        num = int(path.stem.split("-")[1])
        if num > 27:
            continue
        chunk = json.loads(path.read_text())
        if isinstance(chunk, list):
            items.extend(chunk)
    for item in items[start : start + limit]:
        print(json.dumps({"endpointId": item["endpointId"], "name": item.get("name"), "args": patch_args(item)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
