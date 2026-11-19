#!/usr/bin/env python3
"""Create Customer Portal DocStar endpoints from manifest; bulk publish; write results."""

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
PAGE_ID = "zIqGK5BZ5fh6"
ROOT_PARENT = "u9XDYe5Zc_ds"
ROOT = Path(__file__).resolve().parent
MANIFEST = ROOT / ".docstar-create-manifest.json"
PAYLOADS = ROOT / "customer-portal-docstar-create-payloads.json"
RESULTS = ROOT / "customer-portal-docstar-create-results.json"


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


def load_existing(token: str) -> dict[tuple[str, str], str]:
    status, data = request(
        "GET",
        f"{API}/orgs/{ORG}/collections/{COLLECTION}/endpoints",
        token,
    )
    if status != 200 or not isinstance(data, dict):
        raise SystemExit(f"List endpoints failed: {status} {data}")
    out: dict[tuple[str, str], str] = {}
    for eid, ep in data.items():
        if ep.get("parentId") == PAGE_ID:
            out[(ep.get("requestType", ""), ep.get("URL", ""))] = eid
    return out


def body_from_payload(ep: dict) -> dict:
    body = {
        k: ep[k]
        for k in (
            "name",
            "requestType",
            "URL",
            "description",
            "headers",
            "params",
            "pathVariables",
            "body",
            "sampleResponse",
        )
        if k in ep
    }
    body["state"] = 1
    return body


def main() -> None:
    token_path = Path("/tmp/docstar-hm-token")
    token = (sys.argv[1] if len(sys.argv) > 1 else "").strip() or (
        token_path.read_text().strip() if token_path.is_file() else ""
    )
    if not token:
        raise SystemExit("Pass DocStar hm_ token as argv[1] or write to /tmp/docstar-hm-token")

    payloads = json.loads(PAYLOADS.read_text())
    existing = load_existing(token)

    results: list[dict] = []
    created = 0
    skipped = 0
    failed: list[dict] = []
    endpoint_ids: list[str] = []

    for ep in payloads["endpoints"]:
        catalog_id = ep["catalogId"]
        key = (ep["requestType"], ep["URL"])
        body = body_from_payload(ep)

        if key in existing:
            eid = existing[key]
            status, result = request(
                "PUT",
                f"{API}/orgs/{ORG}/endpoints/{eid}",
                token,
                body,
            )
            if status != 200:
                failed.append(
                    {"catalogId": catalog_id, "endpointId": eid, "action": "update", "status": status, "error": result}
                )
                results.append({"catalogId": catalog_id, "endpointId": eid, "status": "failed", "action": "update"})
            else:
                skipped += 1
                endpoint_ids.append(eid)
                results.append({"catalogId": catalog_id, "endpointId": eid, "status": "skipped", "action": "updated_existing"})
            time.sleep(0.08)
            continue

        status, result = request(
            "POST",
            f"{API}/orgs/{ORG}/pages/{PAGE_ID}/endpoints",
            token,
            body,
        )
        if status != 200 or not isinstance(result, dict) or "id" not in result:
            failed.append({"catalogId": catalog_id, "action": "create", "status": status, "error": result})
            results.append({"catalogId": catalog_id, "status": "failed", "action": "create"})
        else:
            eid = result["id"]
            created += 1
            endpoint_ids.append(eid)
            existing[key] = eid
            results.append({"catalogId": catalog_id, "endpointId": eid, "status": "created"})
        time.sleep(0.08)

    page_ids = list(dict.fromkeys(endpoint_ids + [PAGE_ID, ROOT_PARENT]))
    pub_status, pub_result = request(
        "PATCH",
        f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
        token,
        {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
    )

    out = {
        "orgId": ORG,
        "pageId": PAGE_ID,
        "collectionId": COLLECTION,
        "rootParentId": ROOT_PARENT,
        "summary": {
            "created": created,
            "skipped": skipped,
            "failed": len(failed),
            "publishStatus": pub_status,
        },
        "publish": pub_result,
        "failed": failed,
        "results": results,
    }
    RESULTS.write_text(json.dumps(out, indent=2))
    print(json.dumps(out["summary"]))


if __name__ == "__main__":
    main()
