#!/usr/bin/env python3
"""Apply public template descriptions for endpoints not in grouped-drafts queue."""

from __future__ import annotations

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
QUEUE = ROOT / "docstar-missing-followup-queue.json"
API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"


def public_description(name: str) -> str:
    title = (name or "Call this API").strip().split(".")[0][:120]
    return f"{title}. Part of the Giddh API. Requires Auth-Key or Session-Id."


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
            "User-Agent": "Mozilla/5.0 GiddhDocFollowup",
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

    payload = json.loads(QUEUE.read_text())
    items = payload.get("queue") or []
    ok = 0
    updated_ids: list[str] = []
    failed: list[dict] = []
    for i, item in enumerate(items, 1):
        eid = item["endpointId"]
        body = {"description": public_description(item.get("name") or "")}
        status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{eid}", token, body)
        if status != 200:
            failed.append({"id": eid, "status": status})
        else:
            ok += 1
            updated_ids.append(eid)
        time.sleep(0.08)

    publish_status = None
    if updated_ids:
        page_ids = list(dict.fromkeys(updated_ids + [ROOT_PARENT]))
        publish_status, _ = request(
            "PATCH",
            f"{API}/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
            token,
            {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
        )

    summary_path = ROOT / "docstar-public-descriptions-summary.json"
    prior = json.loads(summary_path.read_text()) if summary_path.is_file() else {}
    prior.setdefault("summary", {})["followup"] = {
        "attempted": len(items),
        "updatedOk": ok,
        "failedCount": len(failed),
        "publishStatus": publish_status,
    }
    prior["followupFailed"] = failed
    summary_path.write_text(json.dumps(prior, indent=2) + "\n")
    print(json.dumps({"ok": ok, "failed": len(failed)}))


if __name__ == "__main__":
    main()
