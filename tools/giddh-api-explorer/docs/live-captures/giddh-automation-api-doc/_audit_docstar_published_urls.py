#!/usr/bin/env python3
"""Compare live DocStar endpoint URLs with expected paths from docstar-real-responses.json.

Flags pages whose stored URL path is a strict prefix of the catalog path (e.g. missing
/trags suffix on Create Tag). Requires DOCSTAR_HM_TOKEN_FILE.

    DOCSTAR_HM_TOKEN_FILE=... python3 _audit_docstar_published_urls.py
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import urlparse

API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT = Path(__file__).resolve().parent
CATALOG = ROOT / "docstar-real-responses.json"
REPORT = ROOT / "docstar-url-audit.json"


def token() -> str:
    f = os.environ.get("DOCSTAR_HM_TOKEN_FILE")
    t = Path(f).read_text().strip() if f and Path(f).exists() else os.environ.get("DOCSTAR_HM_TOKEN", "").strip()
    if not t:
        sys.exit("Set DOCSTAR_HM_TOKEN_FILE or DOCSTAR_HM_TOKEN")
    return t


def call(method: str, path: str, tok: str) -> tuple[int, object]:
    req = urllib.request.Request(
        API + path,
        method=method,
        headers={"Authorization": f"Bearer {tok}", "Accept": "application/json", "User-Agent": "GiddhDocUrlAudit"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            raw = r.read().decode()
            return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:400]


def norm_path(url: str) -> str:
    p = urlparse(url or "").path
    p = re.sub(r":([A-Za-z0-9_]+)", r"{\1}", p)
    p = re.sub(r"\{\{([^}]+)\}\}", r"{\1}", p)
    return re.sub(r"/+", "/", p).rstrip("/")


def load_expected() -> dict[str, str]:
    rows = json.loads(CATALOG.read_text())
    if not isinstance(rows, list):
        rows = rows.get("pages", [])
    out: dict[str, str] = {}
    for row in rows:
        page = row.get("page") or ""
        path = row.get("path")
        method = (row.get("method") or "GET").upper()
        if not page or not path:
            continue
        key = f"{method} {path}"
        out[page] = key
    return out


def main() -> None:
    tok = token()
    status, data = call("GET", f"/orgs/{ORG}/collections/{COLLECTION}/endpoints", tok)
    if status != 200 or not isinstance(data, dict):
        raise SystemExit(f"List endpoints failed: {status} {data}")

    expected_by_slug = load_expected()
    mismatches: list[dict] = []
    for eid, ep in data.items():
        if ep.get("type") not in (4, 5):
            continue
        slug = ep.get("urlName") or ""
        live = norm_path(ep.get("URL") or "")
        exp_key = expected_by_slug.get(f"{slug.rsplit('/', 1)[0]}/{slug}" if "/" not in slug else slug)
        # match page keys like tags/create-tag
        for page, exp in expected_by_slug.items():
            if page.endswith(f"/{slug}") or page.split("/")[-1] == slug:
                exp_path = exp.split(" ", 1)[-1]
                exp_norm = norm_path(exp_path)
                if live and exp_norm and live != exp_norm:
                    if exp_norm.startswith(live) and len(exp_norm) > len(live):
                        mismatches.append(
                            {
                                "id": eid,
                                "urlName": slug,
                                "page": page,
                                "livePath": live,
                                "expectedPath": exp_norm,
                                "kind": "truncated_prefix",
                            }
                        )
                    elif live != exp_norm:
                        mismatches.append(
                            {
                                "id": eid,
                                "urlName": slug,
                                "page": page,
                                "livePath": live,
                                "expectedPath": exp_norm,
                                "kind": "differs",
                            }
                        )
                break

    summary = {"mismatches": len(mismatches), "truncated": sum(1 for m in mismatches if m["kind"] == "truncated_prefix")}
    REPORT.write_text(json.dumps({"summary": summary, "items": mismatches}, indent=2))
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()