#!/usr/bin/env python3
"""Build docstar-live-endpoint-index.json from docstar-live-endpoints-raw.json (MCP GET collection endpoints)."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RAW = ROOT / "docstar-live-endpoints-raw.json"
OUT = ROOT / "docstar-live-endpoint-index.json"


def norm_url(url: str) -> str:
    url = (url or "").split("?", 1)[0].rstrip("/").lower()
    url = url.replace("https://api.giddh.com", "").replace("https://apitest.giddh.com", "")
    # Collapse {name} / {name:.+} first so colon-regex inside braces is not mangled.
    url = re.sub(r"\{[^}]+\}", "{}", url)
    # DocStar / Spring-style :name or :name:.+
    url = re.sub(r":[a-za-z0-9_.-]+(?::\.[^/]*)?", "{}", url)
    return url


def main() -> None:
    if not RAW.is_file():
        raise SystemExit(f"Missing {RAW}. Fetch via DocStar MCP call_any_read_api_of_docstar GET .../collections/-Jey39dCAAyx/endpoints")
    wrapper = json.loads(RAW.read_text())
    eps = wrapper.get("data") if isinstance(wrapper, dict) else wrapper
    if not isinstance(eps, dict):
        raise SystemExit("Unexpected raw shape")
    index: dict[str, dict] = {}
    by_route: dict[str, list[str]] = {}
    for eid, ep in eps.items():
        if not isinstance(ep, dict) or ep.get("type") != 4:
            continue
        method = (ep.get("requestType") or "GET").upper()
        url = ep.get("URL") or ""
        index[eid] = {
            "endpointId": eid,
            "requestType": method,
            "URL": url,
            "name": ep.get("name"),
        }
        rk = f"{method} {norm_url(url)}"
        by_route.setdefault(rk, []).append(eid)
    OUT.write_text(
        json.dumps({"endpoints": index, "byRoute": by_route, "count": len(index)}, ensure_ascii=False, indent=2)
    )
    print(json.dumps({"liveEndpoints": len(index), "duplicateRoutes": sum(1 for v in by_route.values() if len(v) > 1), "file": str(OUT)}))


if __name__ == "__main__":
    main()
