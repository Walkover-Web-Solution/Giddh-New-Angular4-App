#!/usr/bin/env python3
"""Create or update the global DocStar environment for Giddh API TRY requests.

Reads docstar-giddh-try-environment.json. Does not publish the collection public
environment (that step is still done in DocStar UI: Settings → Public Environment).

    DOCSTAR_HM_TOKEN_FILE=... python3 _setup_docstar_giddh_public_environment.py
    DOCSTAR_HM_TOKEN_FILE=... python3 _setup_docstar_giddh_public_environment.py --publish-env
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.docstar.io"
ORG = "83427"
ROOT = Path(__file__).resolve().parent
SPEC = ROOT / "docstar-giddh-try-environment.json"
REPORT = ROOT / "docstar-giddh-try-environment-apply.json"


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
            "User-Agent": "Mozilla/5.0 GiddhDocPublicEnv",
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


def find_by_name(envs: dict, name: str) -> tuple[str | None, dict | None]:
    for eid, row in envs.items():
        if isinstance(row, dict) and row.get("name") == name:
            return eid, row
    return None, None


def main() -> None:
    publish_only = "--publish-env" in sys.argv
    spec = json.loads(SPEC.read_text())
    tok = token()
    status, listed = call("GET", f"/orgs/{ORG}/environments", tok)
    if status != 200 or not isinstance(listed, dict):
        raise SystemExit(f"List environments failed: {status} {listed}")

    payload = {
        "name": spec["name"],
        "type": spec.get("type", 0),
        "variables": [
            {
                "key": v["key"],
                "value": v.get("value", ""),
                "initialValue": v.get("initialValue", v.get("value", "")),
            }
            for v in spec.get("variables", [])
        ],
    }
    eid, existing = find_by_name(listed, spec["name"])
    if eid:
        st, result = call("PUT", f"/orgs/{ORG}/environments/{eid}", tok, payload)
        action = "updated"
    else:
        st, result = call("POST", f"/orgs/{ORG}/environments", tok, payload)
        action = "created"
        if st == 200 and isinstance(result, dict):
            eid = result.get("id") or (result.get("data") or {}).get("id")

    out = {
        "action": action,
        "httpStatus": st,
        "environmentId": eid,
        "name": spec["name"],
        "publicPublishHints": spec.get("publicPublishHints"),
        "manualStep": (
            "DocStar UI → Giddh API Draft_1 → Settings → Public Environment → "
            "select this environment → tick companyUniqueName, Auth-Key, Session-Id (editable) → Publish Environment"
        ),
    }
    if not publish_only:
        out["note"] = "Environment saved. Public environment for readers still requires the manual UI step above."
    REPORT.write_text(json.dumps(out, indent=2))
    print(json.dumps(out, indent=2))
    if st != 200:
        raise SystemExit(f"Environment {action} failed: {st} {result}")


if __name__ == "__main__":
    main()