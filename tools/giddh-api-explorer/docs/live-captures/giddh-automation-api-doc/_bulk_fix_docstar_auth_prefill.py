#!/usr/bin/env python3
"""Set Auth-Key / Session-Id header prefill values on all endpoints in a DocStar collection."""

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
ROOT_PARENT = "u9XDYe5Zc_ds"
ROOT = Path(__file__).resolve().parent
PLACEHOLDERS = json.loads((ROOT / "docstar-auth-placeholders.json").read_text())
AUTH_KEY = PLACEHOLDERS["authKey"]
SESSION_ID = PLACEHOLDERS["sessionId"]


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
            "User-Agent": "Mozilla/5.0 GiddhDocAuthPrefill",
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


def patch_headers(headers: dict | None) -> tuple[dict | None, bool]:
    if not isinstance(headers, dict):
        return headers, False
    changed = False
    out = dict(headers)
    for name, prefill in (("Auth-Key", AUTH_KEY), ("Session-Id", SESSION_ID)):
        if name not in out:
            continue
        entry = out[name]
        if not isinstance(entry, dict):
            continue
        value = entry.get("value", "")
        if value != prefill:
            out[name] = {**entry, "value": prefill}
            changed = True
    return out, changed


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
        headers, changed = patch_headers(ep.get("headers"))
        if changed:
            to_update.append((eid, headers))

    ok = 0
    updated_ids: list[str] = []
    failed: list[dict] = []
    for i, (eid, headers) in enumerate(to_update, 1):
        status, result = request(
            "PUT",
            f"{API}/orgs/{ORG}/endpoints/{eid}",
            token,
            {"headers": headers},
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
        "rootParentId": ROOT_PARENT,
        "authKeyPrefill": AUTH_KEY,
        "sessionIdPrefill": SESSION_ID,
        "candidates": len(to_update),
        "updated": ok,
        "failed": len(failed),
        "publishStatus": publish_status,
        "publishedPageCount": len(updated_ids) + 1 if updated_ids else 0,
        "authErrors": [
            f for f in failed if f.get("status") in (401, 403)
        ],
    }
    out = ROOT / "docstar-auth-prefill-summary.json"
    out.write_text(
        json.dumps(
            {
                "summary": summary,
                "publish": publish_result,
                "failed": failed[:100],
                "updatedEndpointIds": updated_ids[:20],
            },
            indent=2,
        )
    )
    print(json.dumps(summary))


if __name__ == "__main__":
    main()
