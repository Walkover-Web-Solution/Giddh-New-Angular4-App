#!/usr/bin/env python3
"""Build DocStar param/body update payloads for every indexed endpoint."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path("/Users/divyanshu/Documents/Giddh-New-Angular4-App")
DOCSTAR = ROOT / "docs/api/live-captures/giddh-automation-api-doc"
sys.path.insert(0, str(ROOT / "docs/api/coverage"))
from catalog_parameter_docs import (  # noqa: E402
    catalog_record_to_docstar_payload,
    load_overrides,
    record_key,
)
from sanitize_javadoc import format_public_endpoint_description  # noqa: E402

CATALOG = ROOT / "docs/api/coverage/catalog.json"
LIVE_INDEX = DOCSTAR / "docstar-live-endpoint-index.json"
LEGACY_INDEX = DOCSTAR / "docstar-endpoint-index.json"
OUT_PATCHES = DOCSTAR / "docstar-param-doc-patches.json"
BATCH_DIR = DOCSTAR / ".docstar-param-batches"
ORG = "83427"
BATCH_SIZE = 25


def norm_url(url: str) -> str:
    url = (url or "").split("?", 1)[0].rstrip("/").lower()
    url = url.replace("https://api.giddh.com", "").replace("https://apitest.giddh.com", "")
    # Collapse {name} / {name:.+} first so colon-regex inside braces is not mangled.
    url = re.sub(r"\{[^}]+\}", "{}", url)
    # DocStar / Spring-style :name or :name:.+
    url = re.sub(r":[a-za-z0-9_.-]+(?::\.[^/]*)?", "{}", url)
    return url


def doc_path_from_url(url: str) -> str:
    u = norm_url(url)
    if not u.startswith("/"):
        u = "/" + u
    return u


def catalog_path_from_record(path: str) -> str:
    return norm_url(f"https://api.giddh.com{path if path.startswith('/') else '/' + path}")


def auth_mode(path: str) -> str:
    if path.startswith("/portal/"):
        return "portal"
    if path.startswith("/magic-link/"):
        return "portal"
    return "session"


def auth_sentence(mode: str) -> str:
    if mode == "none":
        return "No auth headers required."
    if mode == "portal":
        return "Requires portal session."
    return "Requires Auth-Key or Session-Id."


def menu_for(path: str) -> str:
    skip = {"company", "v2", "portal", "accounts", "accounts-v2"}
    parts = [p for p in path.strip("/").split("/") if p and "{" not in p and p not in skip]
    if parts:
        return parts[-1].replace("-", " ").title()
    return "Giddh"


PREFER_ACCOUNTING_MS_ROUTES = frozenset(
    {
        "POST /company/{companyUniqueName}/vouchers/get-all-vouchers-balances",
        "POST /company/{companyUniqueName}/vouchers/get-all",
    }
)

ACCOUNTING_MS_VOUCHER_ROUTE = re.compile(
    r"^POST /company/\{companyUniqueName\}/vouchers/"
)


def record_score(record: dict, route_key: str | None = None) -> int:
    score = 0
    if record.get("service") == "giddh-api-v2":
        score += 4
    if record.get("service") == "accounting-microservice" and route_key and (
        route_key in PREFER_ACCOUNTING_MS_ROUTES or ACCOUNTING_MS_VOUCHER_ROUTE.match(route_key)
    ):
        score += 12
    if record.get("classification") == "frontend-used":
        score += 3
    if (record.get("response") or {}).get("successExample"):
        score += 2
    q = (record.get("parameters") or {}).get("query") or []
    if q:
        score += 1
    return score


def build_by_route_catalog(catalog: dict) -> dict[str, dict]:
    by_route: dict[str, dict] = {}
    for record in catalog.get("records") or []:
        method = (record.get("method") or "").upper()
        path = record.get("path") or ""
        if not method or not path:
            continue
        route_key = f"{method} {catalog_path_from_record(path)}"
        current = by_route.get(route_key)
        if current is None or record_score(record, route_key) > record_score(current, route_key):
            by_route[route_key] = record
    return by_route


def load_grouped_draft_by_route() -> dict[str, dict]:
    path = DOCSTAR / "docstar-grouped-drafts.json"
    if not path.is_file():
        return {}
    payload = json.loads(path.read_text())
    out: dict[str, dict] = {}
    for menu in payload.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            method = (ep.get("requestType") or "GET").upper()
            url = ep.get("URL") or ""
            if not url:
                continue
            rk = f"{method} {norm_url(url)}"
            out[rk] = ep
    return out


def normalize_docstar_params(params: dict | None) -> dict:
    """Ensure every query param has required as a real boolean for the DocStar UI column.

    DocStar's published docs treat a non-empty string as truthy, so required:\"false\"
    still renders as Required. Always emit JSON booleans true/false.
    """
    out: dict = {}
    for name, raw in (params or {}).items():
        if not isinstance(raw, dict):
            continue
        entry = dict(raw)
        req = entry.get("required")
        if req in (None, "", "None"):
            desc = str(entry.get("description") or "").lower()
            mandatory = "mandatory" in desc and "not mandatory" not in desc
            entry["required"] = bool(mandatory)
        elif isinstance(req, bool):
            entry["required"] = req
        else:
            entry["required"] = str(req).lower() in {"true", "1", "yes"}
        out[name] = entry
    return out


def patch_from_draft(ep: dict, eid: str, name: str | None) -> dict:
    return {
        "endpointId": eid,
        "name": name or ep.get("name"),
        "catalogKey": None,
        "args": {
            "orgId": ORG,
            "endpointId": eid,
            "description": ep.get("description") or "",
            "params": normalize_docstar_params(ep.get("params") or {}),
            "body": ep.get("body") or {"type": "none"},
            "bodyDescription": ep.get("bodyDescription") or {},
        },
    }


def main() -> None:
    index_path = LIVE_INDEX if LIVE_INDEX.is_file() else LEGACY_INDEX
    if not index_path.is_file():
        raise SystemExit("Run _refresh_docstar_live_index.py (or _build_docstar_endpoint_index.py) first")

    overrides = load_overrides()
    catalog = json.loads(CATALOG.read_text())
    by_route_catalog = build_by_route_catalog(catalog)
    drafts_by_route = load_grouped_draft_by_route()

    index = json.loads(index_path.read_text())
    print(json.dumps({"indexSource": index_path.name, "endpointCount": index.get("count")}, ensure_ascii=False), file=sys.stderr)
    endpoints = index.get("endpoints") or {}

    patches: list[dict] = []
    unmatched: list[dict] = []
    for eid, row in sorted(endpoints.items(), key=lambda x: x[1].get("name") or ""):
        method = row.get("requestType") or "GET"
        url = row.get("URL") or ""
        route_key = f"{method.upper()} {norm_url(url)}"
        record = by_route_catalog.get(route_key)
        if not record:
            draft = drafts_by_route.get(route_key)
            if draft:
                patches.append(patch_from_draft(draft, eid, row.get("name")))
            else:
                unmatched.append({"endpointId": eid, "URL": url, "requestType": method, "name": row.get("name")})
            continue
        key = record_key(record.get("method", ""), record.get("path", ""))
        ov = overrides.get(key)
        payload = catalog_record_to_docstar_payload(record, ov)
        payload["params"] = normalize_docstar_params(payload.get("params") or {})
        path = record.get("path") or ""
        mode = auth_mode(path)
        summary = record.get("documentationSummary") or record.get("description") or row.get("name") or "Call this API"
        summary = summary.strip().rstrip(".")
        description = format_public_endpoint_description(summary, menu_for(path), auth_sentence(mode))
        patches.append(
            {
                "endpointId": eid,
                "name": row.get("name"),
                "catalogKey": key,
                "args": {
                    "orgId": ORG,
                    "endpointId": eid,
                    "description": description,
                    **payload,
                },
            }
        )

    for u in unmatched:
        eid = u["endpointId"]
        path_tail = (u.get("URL") or "").split("/accounts/")[-1] if u.get("URL") else "endpoint"
        patches.append(
            {
                "endpointId": eid,
                "name": u.get("name") or path_tail,
                "catalogKey": None,
                "args": {
                    "orgId": ORG,
                    "endpointId": eid,
                    "description": f"Customer portal API: {path_tail.replace('-', ' ')}. Requires portal session.",
                    "params": {},
                    "body": {"type": "none"},
                    "bodyDescription": {},
                },
            }
        )
    unmatched = []

    OUT_PATCHES.write_text(json.dumps({"patches": patches, "unmatched": unmatched}, ensure_ascii=False, indent=2))
    BATCH_DIR.mkdir(exist_ok=True)
    for old in BATCH_DIR.glob("batch-*.json"):
        old.unlink()
    for i in range(0, len(patches), BATCH_SIZE):
        chunk = patches[i : i + BATCH_SIZE]
        batch_path = BATCH_DIR / f"batch-{i // BATCH_SIZE + 1:03d}.json"
        batch_path.write_text(json.dumps(chunk, ensure_ascii=False, indent=2))

    print(
        json.dumps(
            {
                "patches": len(patches),
                "unmatched": len(unmatched),
                "batches": (len(patches) + BATCH_SIZE - 1) // BATCH_SIZE,
                "patchesFile": str(OUT_PATCHES),
            }
        )
    )


if __name__ == "__main__":
    main()
