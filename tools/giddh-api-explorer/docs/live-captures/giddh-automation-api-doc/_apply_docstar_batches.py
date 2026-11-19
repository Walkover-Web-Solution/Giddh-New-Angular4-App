#!/usr/bin/env python3
"""Apply pre-built .docstar-batches/batch-*.json updates to DocStar (hm_ token)."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BATCH_DIR = ROOT / ".docstar-batches"
API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"


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
            "User-Agent": "Mozilla/5.0 GiddhDocBatchApply",
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

    items: list[dict] = []
    for path in sorted(BATCH_DIR.glob("batch-*.json")):
        chunk = json.loads(path.read_text())
        if isinstance(chunk, list):
            items.extend(chunk)

    ok = 0
    updated_ids: list[str] = []
    failed: list[dict] = []
    for i, item in enumerate(items, 1):
        eid = item["endpointId"]
        body = {"description": item["description"]}
        if item.get("sampleResponse"):
            body["sampleResponse"] = item["sampleResponse"]
        status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{eid}", token, body)
        if status != 200:
            failed.append({"id": eid, "name": item.get("name"), "status": status})
        else:
            ok += 1
            updated_ids.append(eid)
        if i % 40 == 0:
            print(f"progress {i}/{len(items)} ok={ok} failed={len(failed)}", flush=True)
        time.sleep(0.07)

    publish_status = None
    if updated_ids:
        page_ids = list(dict.fromkeys(updated_ids + [ROOT_PARENT]))
        publish_status, _ = request(
            "PATCH",
            f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
            token,
            {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
        )

    summary = {
        "total": len(items),
        "updated": ok,
        "failed": len(failed),
        "publishStatus": publish_status,
    }
    out = ROOT / "docstar-public-descriptions-summary.json"
    out.write_text(json.dumps({"summary": summary, "failed": failed[:50]}, indent=2))
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
