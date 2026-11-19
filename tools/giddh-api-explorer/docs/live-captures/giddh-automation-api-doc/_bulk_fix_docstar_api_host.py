#!/usr/bin/env python3
"""Replace apitest.giddh.com with api.giddh.com on all endpoints in a DocStar collection."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
FIXES = Path(__file__).resolve().parent / "docstar-apitest-url-fixes.json"


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
            "User-Agent": "Mozilla/5.0 GiddhDocHostFix",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as response:
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

    fixes = json.loads(FIXES.read_text())
    ok = 0
    failed: list[dict] = []
    for i, row in enumerate(fixes, 1):
        eid = row["id"]
        status, result = request(
            "PUT",
            f"{API}/orgs/{ORG}/endpoints/{eid}",
            token,
            {"URL": row["URL"]},
        )
        if status != 200:
            failed.append({"id": eid, "status": status, "error": str(result)[:200]})
        else:
            ok += 1
        if i % 50 == 0:
            print(f"progress {i}/{len(fixes)} ok={ok} failed={len(failed)}", flush=True)
        time.sleep(0.08)

    summary = {"collection": COLLECTION, "updated": ok, "failed": len(failed), "total": len(fixes)}
    out = Path(__file__).resolve().parent / "docstar-apitest-url-fix-summary.json"
    out.write_text(json.dumps({"summary": summary, "failed": failed[:50]}, indent=2))
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
