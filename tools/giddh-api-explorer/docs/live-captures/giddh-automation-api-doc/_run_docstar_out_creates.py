#!/usr/bin/env python3
"""Create DocStar endpoints from .docstar-out/*.json via DocStar REST API (needs hm_ token)."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.docstar.io"
ORG = "83427"
PAGE_ID = "zIqGK5BZ5fh6"
OUT = Path(__file__).resolve().parent / ".docstar-out"
PROGRESS = OUT / "mcp-progress.json"


def request(method: str, url: str, token: str, body: dict | None = None) -> tuple[int, object]:
    data = None if body is None else json.dumps(body).encode()
    req = urllib.request.Request(
        url,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
            "Accept": "application/json",
            "User-Agent": "Mozilla/5.0 GiddhCustomerPortalDocStar",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            raw = response.read().decode()
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        raw = error.read().decode()
        try:
            parsed = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            parsed = {"raw": raw[:500]}
        return error.code, parsed


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")

    progress: list[dict] = []
    if PROGRESS.is_file():
        progress = json.loads(PROGRESS.read_text())

    done_catalog = {p["catalogId"] for p in progress if p.get("endpointId")}

    for path in sorted(OUT.glob("create-*.json")):
        item = json.loads(path.read_text())
        catalog_id = item["catalogId"]
        if catalog_id in done_catalog:
            continue
        status, result = request(
            "POST",
            f"{API}/orgs/{ORG}/pages/{PAGE_ID}/endpoints",
            token,
            item["body"],
        )
        row = {"file": path.name, "catalogId": catalog_id, "status": status}
        if status == 200 and isinstance(result, dict) and "id" in result:
            row["endpointId"] = result["id"]
        else:
            row["error"] = result
        progress.append(row)
        PROGRESS.write_text(json.dumps(progress, indent=2))
        print(json.dumps(row))
        time.sleep(0.08)

    for path in sorted(OUT.glob("update-*.json")):
        item = json.loads(path.read_text())
        catalog_id = item["catalogId"]
        eid = item["endpointId"]
        status, result = request(
            "PUT",
            f"{API}/orgs/{ORG}/endpoints/{eid}",
            token,
            item["body"],
        )
        row = {"file": path.name, "catalogId": catalog_id, "endpointId": eid, "status": status, "action": "update"}
        if status != 200:
            row["error"] = result
        progress.append(row)
        PROGRESS.write_text(json.dumps(progress, indent=2))
        print(json.dumps(row))
        time.sleep(0.08)


if __name__ == "__main__":
    main()
