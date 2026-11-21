#!/usr/bin/env python3
"""Point Giddh DocStar endpoints at shared {{variables}} for TRY (Auth-Key, company path).

Replaces literal :companyUniqueName in URL with {{companyUniqueName}} and sets
Auth-Key / Session-Id header values to {{Auth-Key}} / {{Session-Id}} when they
use the standard ENTER_YOUR_GIDDH_* placeholders.

Requires a published public environment on the collection (see DOCSTAR-QA-REPORT).

    DOCSTAR_HM_TOKEN_FILE=... python3 _wire_docstar_try_variables.py --dry-run
    DOCSTAR_HM_TOKEN_FILE=... python3 _wire_docstar_try_variables.py --publish
"""

from __future__ import annotations

import json
import os
import re
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
REPORT = ROOT / "docstar-try-variables-apply.json"

VAR_COMPANY = "{{companyUniqueName}}"
VAR_AUTH = "{{Auth-Key}}"
VAR_SESSION = "{{Session-Id}}"


def token() -> str:
    f = os.environ.get("DOCSTAR_HM_TOKEN_FILE")
    t = Path(f).read_text().strip() if f and Path(f).exists() else os.environ.get("DOCSTAR_HM_TOKEN", "").strip()
    if not t:
        sys.exit("Set DOCSTAR_HM_TOKEN_FILE or DOCSTAR_HM_TOKEN")
    return t


def call(method: str, path: str, tok: str, body: dict | None = None) -> tuple[int, object]:
    req = urllib.request.Request(
        API + path,
        method=method,
        data=None if body is None else json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {tok}",
            "Accept": "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 GiddhDocTryVars",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            raw = r.read().decode()
            return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read().decode()
        try:
            parsed = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            parsed = {"raw": raw[:500]}
        return e.code, parsed


def patch_url(url: str) -> tuple[str, bool]:
    if not url:
        return url, False
    new = url
    for old in (":companyUniqueName", "{companyUniqueName}"):
        new = new.replace(old, VAR_COMPANY)
    return new, new != url


def patch_headers(headers: dict | None) -> tuple[dict | None, bool]:
    if not isinstance(headers, dict):
        return headers, False
    changed = False
    out = dict(headers)
    for name, var, legacy in (
        ("Auth-Key", VAR_AUTH, PLACEHOLDERS["authKey"]),
        ("Session-Id", VAR_SESSION, PLACEHOLDERS["sessionId"]),
    ):
        if name not in out or not isinstance(out[name], dict):
            continue
        val = out[name].get("value", "")
        if val in ("", legacy) or val.startswith("ENTER_YOUR"):
            out[name] = {**out[name], "value": var}
            changed = True
    return out, changed


def main() -> None:
    dry = "--dry-run" in sys.argv
    do_publish = "--publish" in sys.argv
    tok = token()
    status, data = call("GET", f"/orgs/{ORG}/collections/{COLLECTION}/endpoints", tok)
    if status != 200 or not isinstance(data, dict):
        raise SystemExit(f"List endpoints failed: {status} {data}")

    planned: list[dict] = []
    for eid, ep in data.items():
        if ep.get("type") not in (4, 5):
            continue
        url, url_changed = patch_url(ep.get("URL") or "")
        headers, hdr_changed = patch_headers(ep.get("headers"))
        if not url_changed and not hdr_changed:
            continue
        planned.append(
            {
                "id": eid,
                "urlName": ep.get("urlName"),
                "URL": url if url_changed else None,
                "headers": headers if hdr_changed else None,
            }
        )

    updated: list[str] = []
    failed: list[dict] = []
    if not dry:
        for i, row in enumerate(planned, 1):
            body: dict = {}
            if row["URL"] is not None:
                body["URL"] = row["URL"]
            if row["headers"] is not None:
                body["headers"] = row["headers"]
            st, result = call("PUT", f"/orgs/{ORG}/endpoints/{row['id']}", tok, body)
            if st != 200:
                failed.append({"id": row["id"], "status": st, "error": str(result)[:200]})
            else:
                updated.append(row["id"])
            if i % 50 == 0:
                print(f"progress {i}/{len(planned)}", flush=True)
            time.sleep(0.08)

        if do_publish and updated:
            page_ids = list(dict.fromkeys(updated + [ROOT_PARENT]))
            call(
                "PATCH",
                f"/orgs/{ORG}/collections/{COLLECTION}/bulkPublish",
                tok,
                {"rootParentId": ROOT_PARENT, "pageIds": page_ids},
            )

    summary = {
        "dryRun": dry,
        "published": do_publish and not dry,
        "planned": len(planned),
        "updated": len(updated),
        "failed": len(failed),
        "sample": planned[:5],
    }
    REPORT.write_text(json.dumps({"summary": summary, "failed": failed[:20]}, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()