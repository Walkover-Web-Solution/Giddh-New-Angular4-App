#!/usr/bin/env python3
"""Replace placeholder success JSON with display-ready bodies in repo + DocStar patch file."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[4]
CAPTURE = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "docs/api/coverage"))
from display_success_samples import (  # noqa: E402
    display_body_for_reference,
    is_placeholder_success_body,
)

DRAFTS = CAPTURE / "docstar-grouped-drafts.json"
QUEUE = CAPTURE / "docstar-description-update-queue.json"
CATALOGS = [
    ROOT / "docs/api/coverage/catalog.json",
    ROOT / "tools/giddh-api-explorer/public/data/catalog.json",
]
OUT_PATCHES = CAPTURE / "docstar-display-success-patches.json"
OUT_STATS = CAPTURE / "display-success-bodies-summary.json"


def url_to_path_pattern(url: str) -> str:
    if not url:
        return ""
    path = urlparse(url.replace(":companyUniqueName", "{companyUniqueName}")).path
    path = re.sub(r":\w+(?::\.\+)?", "{}", path)
    path = re.sub(r"\{[^}]+\}", "{}", path)
    return path.lstrip("/")


def patch_sample_responses(samples: list | None, method: str, name: str, url: str) -> tuple[list | None, int]:
    if not isinstance(samples, list):
        return samples, 0
    changed = 0
    out = []
    for sample in samples:
        if not isinstance(sample, dict):
            out.append(sample)
            continue
        if sample.get("status") not in (200, 201, 204):
            out.append(sample)
            continue
        data = sample.get("data")
        if not isinstance(data, dict) or data.get("status") != "success":
            out.append(sample)
            continue
        ok, ref = is_placeholder_success_body(data.get("body"))
        if not ok or not ref:
            out.append(sample)
            continue
        new_body = display_body_for_reference(ref, method=method, name=name or "", url=url or "")
        out.append(
            {
                **sample,
                "description": "Example success response for documentation display.",
                "data": {"status": "success", "body": new_body},
            }
        )
        changed += 1
    return out, changed


def patch_drafts() -> tuple[int, dict[tuple[str, str, str], list]]:
    data = json.loads(DRAFTS.read_text())
    total = 0
    sample_by_key: dict[tuple[str, str, str], list] = {}
    for menu in data.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            method = (ep.get("requestType") or "").upper()
            name = ep.get("name") or ""
            url = ep.get("URL") or ""
            new_samples, n = patch_sample_responses(ep.get("sampleResponse"), method, name, url)
            if n:
                ep["sampleResponse"] = new_samples
                total += n
                key = (method, name.strip().lower(), url_to_path_pattern(url))
                sample_by_key[key] = new_samples
    DRAFTS.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n")
    return total, sample_by_key


def patch_catalog(sample_by_key: dict[tuple[str, str, str], list]) -> int:
    total = 0
    for catalog_path in CATALOGS:
        if not catalog_path.is_file():
            continue
        catalog = json.loads(catalog_path.read_text())
        for record in catalog.get("records") or []:
            response = record.get("response")
            if not isinstance(response, dict):
                continue
            success = response.get("successExample")
            ok, ref = is_placeholder_success_body(success.get("body") if isinstance(success, dict) else None)
            if not ok:
                if isinstance(success, dict) and "body" in success:
                    ok, ref = is_placeholder_success_body(success["body"])
                elif isinstance(success, dict):
                    ok, ref = is_placeholder_success_body(success)
            if not ok or not ref:
                continue
            method = (record.get("method") or "GET").upper()
            name = (record.get("description") or record.get("handler") or "").strip()
            path = record.get("path") or ""
            key = (method, name.lower(), url_to_path_pattern(f"https://api.giddh.com{path}"))
            new_body = display_body_for_reference(
                ref, method=method, name=name, url=f"https://api.giddh.com{path}"
            )
            if isinstance(success, dict) and "status" in success:
                response["successExample"] = {"status": "success", "body": new_body}
            else:
                response["successExample"] = {"status": "success", "body": new_body}
            total += 1
        catalog_path.write_text(json.dumps(catalog, ensure_ascii=False) + "\n")
    return total


def build_docstar_patches(sample_by_key: dict[tuple[str, str, str], list]) -> list[dict]:
    if not QUEUE.is_file():
        return []
    queue = json.loads(QUEUE.read_text()).get("queue") or []
    patches = []
    for item in queue:
        method = (item.get("name") and "") or ""
        # queue items have sampleResponse already - use patched from item after we update queue from drafts
        pass
    # Re-read drafts endpoints matched to queue by endpointId via name+method from queue
    draft_index: dict[tuple[str, str], dict] = {}
    data = json.loads(DRAFTS.read_text())
    for menu in data.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            k = ((ep.get("name") or "").strip().lower(), (ep.get("requestType") or "").upper())
            draft_index[k] = ep
    for item in queue:
        k = ((item.get("name") or "").strip().lower(), "")
        # find request type from item - not stored at top level; infer from sample or skip
        ep = None
        for (n, m), candidate in draft_index.items():
            if n == (item.get("name") or "").strip().lower():
                ep = candidate
                break
        if not ep:
            continue
        samples = ep.get("sampleResponse")
        if not samples:
            continue
        patches.append(
            {
                "endpointId": item["endpointId"],
                "name": item.get("name"),
                "sampleResponse": samples,
            }
        )
    return patches


def sync_queue_samples_from_drafts() -> int:
    data = json.loads(DRAFTS.read_text())
    draft_index: dict[tuple[str, str], dict] = {}
    for menu in data.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            k = ((ep.get("name") or "").strip().lower(), (ep.get("requestType") or "").upper())
            draft_index[k] = ep
    queue_data = json.loads(QUEUE.read_text())
    updated = 0
    for item in queue_data.get("queue") or []:
        # queue lacks requestType - match name only first unique
        name = (item.get("name") or "").strip().lower()
        ep = draft_index.get((name, ""))
        if not ep:
            for (n, m), cand in draft_index.items():
                if n == name:
                    ep = cand
                    break
        if not ep or not ep.get("sampleResponse"):
            continue
        item["sampleResponse"] = ep["sampleResponse"]
        updated += 1
    QUEUE.write_text(json.dumps(queue_data, indent=2, ensure_ascii=False) + "\n")
    return updated


def main() -> None:
    draft_changes, _ = patch_drafts()
    catalog_changes = patch_catalog({})
    sync_queue_samples_from_drafts()
    patches = []
    queue_data = json.loads(QUEUE.read_text())
    draft_data = json.loads(DRAFTS.read_text())
    draft_by_name: dict[str, list] = {}
    for menu in draft_data.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            draft_by_name.setdefault((ep.get("name") or "").strip().lower(), []).append(ep)
    for item in queue_data.get("queue") or []:
        name = (item.get("name") or "").strip().lower()
        candidates = draft_by_name.get(name) or []
        ep = candidates[0] if len(candidates) == 1 else None
        if len(candidates) > 1:
            url_pat = url_to_path_pattern(item.get("URL") or "")
            for c in candidates:
                if url_to_path_pattern(c.get("URL") or "") == url_pat:
                    ep = c
                    break
        if ep and ep.get("sampleResponse"):
            patches.append(
                {
                    "endpointId": item["endpointId"],
                    "name": item.get("name"),
                    "sampleResponse": ep["sampleResponse"],
                }
            )
    OUT_PATCHES.write_text(json.dumps({"count": len(patches), "patches": patches}, indent=2) + "\n")
    stats = {
        "draftSuccessSamplesReplaced": draft_changes,
        "catalogSuccessExamplesReplaced": catalog_changes,
        "docStarPatchCount": len(patches),
    }
    OUT_STATS.write_text(json.dumps(stats, indent=2) + "\n")
    print(json.dumps(stats))


if __name__ == "__main__":
    main()
