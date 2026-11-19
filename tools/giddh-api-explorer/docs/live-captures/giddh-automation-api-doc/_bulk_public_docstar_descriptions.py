#!/usr/bin/env python3
"""Remove internal 'Verified from …Controller' copy from DocStar endpoint descriptions."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[3]
sys.path.insert(0, str(REPO / "docs/api/coverage"))
from sanitize_javadoc import (  # noqa: E402
    publicize_endpoint_description,
    publicize_sample_response_description,
)

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
            "User-Agent": "Mozilla/5.0 GiddhDocPublicDescriptions",
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


def patch_endpoint(ep: dict) -> tuple[dict, bool]:
    changed = False
    body: dict = {}
    desc = ep.get("description")
    if isinstance(desc, str):
        new_desc = publicize_endpoint_description(desc)
        if new_desc != desc:
            body["description"] = new_desc
            changed = True
    samples = ep.get("sampleResponse")
    if isinstance(samples, list):
        new_samples = []
        samples_changed = False
        for sample in samples:
            if not isinstance(sample, dict):
                new_samples.append(sample)
                continue
            sdesc = sample.get("description")
            if isinstance(sdesc, str):
                new_sdesc = publicize_sample_response_description(sdesc)
                if new_sdesc != sdesc:
                    new_samples.append({**sample, "description": new_sdesc})
                    samples_changed = True
                    continue
            new_samples.append(sample)
        if samples_changed:
            body["sampleResponse"] = new_samples
            changed = True
    return body, changed


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")

    status, data = request("GET", f"{API}/orgs/{ORG}/collections/{COLLECTION}/endpoints", token)
    if status != 200 or not isinstance(data, dict):
        raise SystemExit(f"List endpoints failed: {status} {data}")

    to_update: list[tuple[str, dict]] = []
    for eid, ep in data.items():
        if ep.get("type") not in (4, 5):
            continue
        patch, changed = patch_endpoint(ep)
        if changed:
            to_update.append((eid, patch))

    ok = 0
    updated_ids: list[str] = []
    failed: list[dict] = []
    for i, (eid, patch) in enumerate(to_update, 1):
        status, result = request(
            "PUT",
            f"{API}/orgs/{ORG}/endpoints/{eid}",
            token,
            patch,
        )
        if status != 200:
            failed.append({"id": eid, "status": status, "error": str(result)[:200]})
        else:
            ok += 1
            updated_ids.append(eid)
        if i % 50 == 0:
            print(f"progress {i}/{len(to_update)} ok={ok} failed={len(failed)}", flush=True)
        time.sleep(0.08)

    publish_status: int | None = None
    publish_result: object = None
    if updated_ids:
        page_ids = list(dict.fromkeys(updated_ids + [ROOT_PARENT]))
        publish_status, publish_result = request(
            "PATCH",
            f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
            token,
            {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
        )

    summary = {
        "collection": COLLECTION,
        "orgId": ORG,
        "candidates": len(to_update),
        "updated": ok,
        "failed": len(failed),
        "publishStatus": publish_status,
    }
    out = ROOT / "docstar-public-descriptions-summary.json"
    out.write_text(
        json.dumps(
            {
                "summary": summary,
                "publish": publish_result,
                "failed": failed[:100],
                "updatedEndpointIdsSample": updated_ids[:20],
            },
            indent=2,
        )
    )
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
