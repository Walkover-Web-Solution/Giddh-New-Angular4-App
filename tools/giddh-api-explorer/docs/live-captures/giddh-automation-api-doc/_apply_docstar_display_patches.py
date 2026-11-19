#!/usr/bin/env python3
"""Push sampleResponse display bodies to DocStar from docstar-display-success-patches.json."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PATCHES = ROOT / "docstar-display-success-patches.json"
SKIPPED_PATCHES = ROOT / "docstar-skipped-display-patches.json"
FOLLOWUP = ROOT / "docstar-missing-followup-queue.json"
GROUPED = ROOT / "docstar-grouped-drafts.json"
SUMMARY = ROOT / "docstar-display-success-upload-summary.json"
API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"
PACE_S = 0.1


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
            "User-Agent": "Mozilla/5.0 GiddhDocDisplaySuccess",
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


def sample_by_name_from_grouped() -> dict[str, list]:
    payload = json.loads(GROUPED.read_text())
    out: dict[str, list] = {}
    for menu in payload.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            name = (ep.get("name") or "").strip()
            sr = ep.get("sampleResponse")
            if name and sr:
                out[name] = sr
    return out


def build_work() -> tuple[list[dict], dict]:
    patch_payload = json.loads(PATCHES.read_text())
    patches = patch_payload.get("patches") or []
    by_id: dict[str, dict] = {}
    for item in patches:
        by_id[item["endpointId"]] = {
            "endpointId": item["endpointId"],
            "name": item.get("name"),
            "sampleResponse": item["sampleResponse"],
            "source": "display-success-patches",
        }
    skipped_only = "--skipped-only" in sys.argv
    with_skipped = "--with-skipped" in sys.argv
    if skipped_only:
        by_id.clear()
    if SKIPPED_PATCHES.is_file() and (skipped_only or with_skipped):
        for item in json.loads(SKIPPED_PATCHES.read_text()).get("patches") or []:
            by_id[item["endpointId"]] = {
                "endpointId": item["endpointId"],
                "name": item.get("name"),
                "sampleResponse": item["sampleResponse"],
                "source": item.get("source") or "skipped-display-patches",
            }

    followup_stats = {
        "queueCount": 0,
        "matchedByName": 0,
        "skippedNoMatch": 0,
        "skippedAlreadyPatched": 0,
        "noSampleInDraft": 0,
    }
    if FOLLOWUP.is_file() and not skipped_only:
        followup_stats["queueCount"] = json.loads(FOLLOWUP.read_text()).get("count") or 0
        name_to_sr = sample_by_name_from_grouped()
        queue = json.loads(FOLLOWUP.read_text()).get("queue") or []
        for item in queue:
            eid = item["endpointId"]
            if eid in by_id:
                followup_stats["skippedAlreadyPatched"] += 1
                continue
            name = (item.get("name") or "").strip()
            sr = name_to_sr.get(name)
            if sr is None:
                followup_stats["skippedNoMatch"] += 1
                continue
            if not sr:
                followup_stats["noSampleInDraft"] += 1
                continue
            followup_stats["matchedByName"] += 1
            by_id[eid] = {
                "endpointId": eid,
                "name": name,
                "sampleResponse": sr,
                "source": "followup-queue-grouped-drafts",
            }

    return list(by_id.values()), followup_stats


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")

    work, followup_stats = build_work()
    ok = 0
    updated_ids: list[str] = []
    failed: list[dict] = []
    by_source: dict[str, dict[str, int]] = {}

    for i, item in enumerate(work, 1):
        eid = item["endpointId"]
        source = item.get("source") or "unknown"
        by_source.setdefault(source, {"attempted": 0, "ok": 0, "failed": 0})
        by_source[source]["attempted"] += 1

        status, result = request(
            "PUT",
            f"{API}/orgs/{ORG}/endpoints/{eid}",
            token,
            {"sampleResponse": item["sampleResponse"]},
        )
        if status != 200:
            by_source[source]["failed"] += 1
            failed.append(
                {
                    "endpointId": eid,
                    "name": item.get("name"),
                    "source": source,
                    "status": status,
                    "error": result,
                }
            )
        else:
            ok += 1
            by_source[source]["ok"] += 1
            updated_ids.append(eid)
        if i % 50 == 0:
            print(f"progress {i}/{len(work)} ok={ok}", flush=True)
        time.sleep(PACE_S)

    publish_chunks: list[dict] = []
    if updated_ids:
        page_ids = list(dict.fromkeys(updated_ids + [ROOT_PARENT]))
        for start in range(0, len(page_ids), 200):
            chunk = page_ids[start : start + 200]
            if ROOT_PARENT not in chunk:
                chunk = chunk + [ROOT_PARENT]
            status, result = request(
                "PATCH",
                f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
                token,
                {"rootParentId": ROOT_PARENT, "pageIds": chunk},
            )
            publish_chunks.append(
                {
                    "chunkIndex": start // 200,
                    "pageIdsCount": len(chunk),
                    "status": status,
                    "ok": status == 200,
                    "result": result if status != 200 else {"published": len(chunk)},
                }
            )

    summary = {
        "orgId": ORG,
        "collectionId": COLLECTION,
        "rootParentId": ROOT_PARENT,
        "updateMethod": "DocStar REST PUT sampleResponse only",
        "patchesFileCount": json.loads(PATCHES.read_text()).get("count"),
        "workItemsTotal": len(work),
        "updatedOk": ok,
        "failedCount": len(failed),
        "bySource": by_source,
        "followupQueue": followup_stats,
        "publishChunks": publish_chunks,
        "publishChunksOk": all(c.get("ok") for c in publish_chunks) if publish_chunks else None,
        "failed": failed,
    }
    SUMMARY.write_text(json.dumps(summary, indent=2) + "\n")
    print(json.dumps({k: summary[k] for k in summary if k != "failed"}))


if __name__ == "__main__":
    main()
