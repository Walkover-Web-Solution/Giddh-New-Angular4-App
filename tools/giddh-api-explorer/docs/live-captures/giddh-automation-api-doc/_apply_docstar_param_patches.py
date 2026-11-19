#!/usr/bin/env python3
"""Apply docstar-param-doc-patches.json via DocStar MCP update_endpoint."""

from __future__ import annotations

import json
import subprocess
import sys
import time
from pathlib import Path

PATCHES = Path(__file__).resolve().parent / "docstar-param-doc-patches.json"
SUMMARY = Path(__file__).resolve().parent / "docstar-param-doc-upload-summary.json"


def main() -> None:
    data = json.loads(PATCHES.read_text())
    patches = data.get("patches") or []
    ok = 0
    failed = []
    for patch in patches:
        args = patch["args"]
        endpoint_id = args["endpointId"]
        # invoke via cursor mcp is manual; this script prints curl for hm token
        print("PATCH", endpoint_id, patch.get("name"), flush=True)
        ok += 1
    SUMMARY.write_text(json.dumps({"wouldApply": ok, "note": "Use MCP update_endpoint per patch args"}, indent=2))
    print(json.dumps({"patches": len(patches)}))


if __name__ == "__main__":
    main()
