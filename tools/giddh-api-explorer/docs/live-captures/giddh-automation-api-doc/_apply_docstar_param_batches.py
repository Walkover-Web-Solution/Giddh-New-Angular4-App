#!/usr/bin/env python3
"""Apply .docstar-param-batches/batch-*.json (params, body, bodyDescription) to DocStar."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
BATCH_DIR = ROOT / ".docstar-param-batches"
API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"
SUMMARY = ROOT / "docstar-param-doc-upload-summary.json"


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
            "User-Agent": "Mozilla/5.0 GiddhDocParamBatchApply",
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


def patch_body(item: dict) -> dict:
    args = item.get("args") or {}
    body = {k: args[k] for k in ("description", "params", "body", "bodyDescription") if k in args and args[k]}
    return body


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")
    if "YOUR_" in token or not token.startswith("hm_"):
        raise SystemExit("Invalid token: paste a real DocStar hm_ bearer, not the placeholder YOUR_hm_TOKEN.")

    items: list[dict] = []
    for path in sorted(BATCH_DIR.glob("batch-*.json")):
        chunk = json.loads(path.read_text())
        if isinstance(chunk, list):
            items.extend(chunk)

    ok = 0
    skipped = 0
    failed: list[dict] = []
    updated_ids: list[str] = []
    for i, item in enumerate(items, 1):
        eid = item["endpointId"]
        put_body = patch_body(item)
        status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{eid}", token, put_body)
        if status != 200:
            failed.append({"endpointId": eid, "name": item.get("name"), "status": status, "error": str(result)[:240]})
        else:
            ok += 1
            updated_ids.append(eid)
        if i % 40 == 0:
            print(f"progress {i}/{len(items)} ok={ok} fail={len(failed)}", flush=True)
        time.sleep(0.08)

    publish_status = None
    if updated_ids:
        page_ids = list(dict.fromkeys(updated_ids + [ROOT_PARENT]))
        publish_status, publish_result = request(
            "PATCH",
            f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
            token,
            {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
        )
    else:
        publish_result = {}

    summary = {
        "total": len(items),
        "updated": ok,
        "skipped": skipped,
        "failed": len(failed),
        "publishStatus": publish_status,
    }
    SUMMARY.write_text(json.dumps({"summary": summary, "failed": failed[:80], "publish": publish_result}, indent=2))
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
