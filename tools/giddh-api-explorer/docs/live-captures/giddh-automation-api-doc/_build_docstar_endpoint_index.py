#!/usr/bin/env python3
"""Build endpointId -> method/URL index from local DocStar export JSON."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "docstar-endpoint-index.json"


def walk(obj, index: dict) -> None:
    if isinstance(obj, dict):
        typ = obj.get("type")
        eid = obj.get("endpointId") or (obj.get("id") if typ in (4, 5) else None)
        body = obj.get("body") if isinstance(obj.get("body"), dict) and obj.get("body", {}).get("URL") else obj
        if isinstance(body, dict) and body.get("URL"):
            eid = eid or obj.get("endpointId")
            if eid:
                index[eid] = {
                    "endpointId": eid,
                    "requestType": (body.get("requestType") or obj.get("requestType") or "GET").upper(),
                    "URL": body["URL"],
                    "name": body.get("name") or obj.get("name"),
                }
        elif eid and obj.get("URL"):
            index[eid] = {
                "endpointId": eid,
                "requestType": (obj.get("requestType") or "GET").upper(),
                "URL": obj["URL"],
                "name": obj.get("name"),
            }
        for value in obj.values():
            walk(value, index)
    elif isinstance(obj, list):
        for item in obj:
            walk(item, index)


def norm_url(url: str) -> str:
    url = (url or "").split("?", 1)[0].rstrip("/").lower()
    url = url.replace("https://api.giddh.com", "").replace("https://apitest.giddh.com", "")
    url = re.sub(r":[a-za-z0-9_.-]+(?::[^/]*)?", "{}", url)
    url = re.sub(r"\{[^}]+\}", "{}", url)
    return url


def main() -> None:
    index: dict[str, dict] = {}
    globs = [
        "docstar-response-patches/*.json",
        ".docstar-out/*.json",
        "docstar-mcp-batch.json",
        "docstar-draft-payloads.json",
        "customer-portal-docstar-create-results.json",
        ".docstar-batches/manifest.json",
    ]
    for pattern in globs:
        for path in ROOT.glob(pattern):
            try:
                walk(json.loads(path.read_text()), index)
            except (json.JSONDecodeError, OSError):
                continue

    by_route: dict[str, str] = {}
    for eid, row in index.items():
        key = f"{row['requestType']} {norm_url(row['URL'])}"
        by_route.setdefault(key, eid)

    OUT.write_text(json.dumps({"endpoints": index, "byRoute": by_route, "count": len(index)}, ensure_ascii=False, indent=2))
    print(json.dumps({"count": len(index), "file": str(OUT)}))


if __name__ == "__main__":
    main()
