#!/usr/bin/env python3
"""Apply docstar-description-update-queue.json via DocStar REST (hm_ token)."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
QUEUE_PATH = ROOT / "docstar-description-update-queue.json"
SUMMARY_PATH = ROOT / "docstar-public-descriptions-summary.json"

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
            "User-Agent": "Mozilla/5.0 GiddhDocQueueBulkUpdate",
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


def norm_desc(value: object) -> str:
    return value.strip() if isinstance(value, str) else ""


def norm_samples(samples: object) -> str:
    if not isinstance(samples, list):
        return ""
    return json.dumps(samples, sort_keys=True, separators=(",", ":"))


def patch_from_item(item: dict) -> dict:
    body: dict = {"description": item["description"]}
    if item.get("sampleResponse") is not None:
        body["sampleResponse"] = item["sampleResponse"]
    return body


def already_matches(current: dict, patch: dict) -> bool:
    if norm_desc(current.get("description")) != norm_desc(patch.get("description")):
        return False
    if "sampleResponse" in patch:
        return norm_samples(current.get("sampleResponse")) == norm_samples(patch.get("sampleResponse"))
    return True


def publicize_name(name: str) -> str:
    return f"{name}. Part of the Giddh API. Requires Auth-Key or Session-Id."


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")

    doc = json.loads(QUEUE_PATH.read_text())
    queue: list[dict] = doc["queue"]
    missing_sample: list[dict] = doc.get("missingSample") or []
    queue_ids = {item["endpointId"] for item in queue}

    ok = 0
    skipped = 0
    failed: list[dict] = []
    updated_ids: list[str] = []

    for i, item in enumerate(queue, 1):
        eid = item["endpointId"]
        patch = patch_from_item(item)
        status, current = request("GET", f"{API}/orgs/{ORG}/endpoints/{eid}", token)
        if status != 200 or not isinstance(current, dict):
            failed.append({"endpointId": eid, "phase": "get", "status": status, "error": str(current)[:300]})
            time.sleep(0.15)
            continue
        if already_matches(current, patch):
            skipped += 1
            time.sleep(0.05)
            continue
        status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{eid}", token, patch)
        if status != 200:
            failed.append({"endpointId": eid, "phase": "put", "status": status, "error": str(result)[:300]})
        else:
            ok += 1
            updated_ids.append(eid)
        if i % 50 == 0:
            print(f"queue {i}/{len(queue)} ok={ok} skip={skipped} fail={len(failed)}", flush=True)
        time.sleep(0.15)

    missing_ok = 0
    missing_failed: list[dict] = []
    for item in missing_sample:
        eid = item["id"]
        if eid in queue_ids:
            continue
        desc = publicize_name(item.get("name") or "Endpoint")
        status, current = request("GET", f"{API}/orgs/{ORG}/endpoints/{eid}", token)
        if status != 200 or not isinstance(current, dict):
            missing_failed.append({"endpointId": eid, "phase": "get", "status": status})
            time.sleep(0.15)
            continue
        if norm_desc(current.get("description")) == norm_desc(desc):
            skipped += 1
            time.sleep(0.05)
            continue
        status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{eid}", token, {"description": desc})
        if status != 200:
            missing_failed.append({"endpointId": eid, "phase": "put", "status": status, "error": str(result)[:300]})
        else:
            missing_ok += 1
            updated_ids.append(eid)
        time.sleep(0.15)

    page_ids = list(dict.fromkeys([x["endpointId"] for x in queue] + [ROOT_PARENT]))
    publish_status, publish_result = request(
        "PATCH",
        f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
        token,
        {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
    )

    summary = {
        "orgId": ORG,
        "collectionId": COLLECTION,
        "queueTotal": len(queue),
        "updatedOk": ok,
        "skippedIdentical": skipped,
        "failedCount": len(failed),
        "missingSamplePublicizedOk": missing_ok,
        "missingSampleFailedCount": len(missing_failed),
        "publishStatus": publish_status,
        "publishOk": publish_status == 200,
    }
    SUMMARY_PATH.write_text(
        json.dumps(
            {
                "summary": summary,
                "failed": failed,
                "missingSampleFailed": missing_failed,
                "publish": publish_result,
            },
            indent=2,
        )
    )
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
