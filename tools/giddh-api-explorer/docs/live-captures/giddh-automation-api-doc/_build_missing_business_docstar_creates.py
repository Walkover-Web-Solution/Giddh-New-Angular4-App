#!/usr/bin/env python3
"""Build DocStar create_endpoint payloads for catalog routes missing from live index."""

from __future__ import annotations

import importlib.util
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[3]
CATALOG = REPO / "docs/api/coverage/catalog.json"
LIVE_INDEX = ROOT / "docstar-live-endpoint-index.json"
OUT = ROOT / "docstar-missing-business-docstar-creates.json"

ORG = "83427"
PARENT_BUSINESS_DOCS = "NLH0VrG17dfS"
PARENT_MANUFACTURING = "azYsDCYD47hV"
PARENT_INVENTORY = "R_bS1Khfgr4m"

PATH_GROUPS = ("business-documents", "delivery-challan", "receipt-note", "/batch")

# Load _draft_docstar_all as module (JAVA constants used only for auth_mode).
_draft_path = ROOT / "_draft_docstar_all.py"
_spec = importlib.util.spec_from_file_location("draft_docstar", _draft_path)
draft = importlib.util.module_from_spec(_spec)
assert _spec.loader
_spec.loader.exec_module(draft)

sys.path.insert(0, str(REPO / "docs/api/coverage"))
from catalog_parameter_docs import load_overrides, record_key  # noqa: E402

PARAM_OVERRIDES = load_overrides()


def catalog_path_to_docstar_url(path: str) -> str:
    converted = re.sub(r"\{([^}]+)\}", r":\1", path if path.startswith("/") else "/" + path)
    return draft.BASE + converted


def in_live_index(record: dict, endpoints: dict) -> bool:
    path = record.get("path") or ""
    method = (record.get("method") or "").upper()
    dpath = path
    for k, v in [
        ("{companyUniqueName}", ":companyUniqueName"),
        ("{uniqueName}", ":uniqueName"),
        ("{variantUniqueName}", ":variantUniqueName"),
        ("{stockUniqueName}", ":stockUniqueName"),
        ("{batchUniqueName}", ":batchUniqueName"),
        ("{accountUniqueName}", ":accountUniqueName"),
        ("{entryUniqueName}", ":entryUniqueName"),
        ("{caseId}", ":caseId"),
    ]:
        dpath = dpath.replace(k, v)
    expect = draft.BASE + dpath
    for ep in endpoints.values():
        if ep.get("requestType") == method and ep.get("URL", "").rstrip("/") == expect.rstrip("/"):
            return True
    return False


def parent_page_id(path: str) -> str:
    lowered = path.lower()
    if "batch-report" in lowered:
        return PARENT_INVENTORY
    if "/batch/" in lowered or lowered.endswith("/batch/all"):
        return PARENT_MANUFACTURING
    return PARENT_BUSINESS_DOCS


def should_include(record: dict) -> bool:
    path = record.get("path") or ""
    if not any(g in path for g in PATH_GROUPS):
        return False
    if path.startswith("/api-v2-scheduled"):
        return False
    if record.get("classification") == "frontend-unmatched":
        return False
    return True


def build_create_payload(record: dict) -> dict:
    path = record.get("path") or ""
    method = (record.get("method") or "GET").upper()
    surfaces = set(record.get("surfaces") or [])
    menu = draft.menu_for(path, surfaces)
    mode = "both"
    try:
        text = draft.JAVA.read_text()
        compiled = {
            "api_exclude": draft.compile_patterns(draft.java_array("apiInterceptorExcludePatterns", text)),
            "session": draft.compile_patterns(draft.java_array("sessionAccessIncludePatterns", text)),
            "portal": draft.compile_patterns(draft.java_array("proxyIncludePatterns", text)),
            "portal_exclude": draft.compile_patterns(draft.java_array("proxyExcludePatterns", text)),
        }
        mode = draft.auth_mode(path, compiled)
    except Exception:
        pass

    headers = draft.auth_headers(mode)
    body = draft.body_block(record)
    if body.get("type") == "JSON":
        headers["Content-Type"] = {
            "checked": "true",
            "value": "application/json",
            "description": "JSON body.",
        }

    key = record_key(method, path)
    ov = PARAM_OVERRIDES.get(key)
    from catalog_parameter_docs import (  # noqa: E402
        docstar_body_block,
        docstar_body_description,
        docstar_query_params,
    )

    params = docstar_query_params(record, ov, skip=draft.SKIP_QUERY)
    body = docstar_body_block(record, ov)
    body_desc = docstar_body_description(record, ov)

    payload: dict = {
        "orgId": ORG,
        "pageId": parent_page_id(path),
        "name": draft.title_for(record, menu),
        "requestType": method,
        "URL": catalog_path_to_docstar_url(path),
        "description": draft.describe(record, menu, mode),
        "headers": headers,
        "params": params,
        "pathVariables": draft.path_variables(path),
        "body": body,
        "sampleResponse": draft.samples(record),
        "state": 1,
    }
    if body_desc:
        payload["bodyDescription"] = body_desc
    return {
        "catalogKey": key,
        "catalogId": record.get("id"),
        "parentPageId": parent_page_id(path),
        "createArgs": payload,
    }


def main() -> None:
    catalog = json.loads(CATALOG.read_text())
    live = json.loads(LIVE_INDEX.read_text())
    endpoints = live.get("endpoints") or {}

    missing: list[dict] = []
    for record in catalog.get("records") or []:
        if not should_include(record):
            continue
        if in_live_index(record, endpoints):
            continue
        missing.append(build_create_payload(record))

    missing.sort(key=lambda x: (x["createArgs"]["URL"], x["createArgs"]["requestType"]))
    OUT.write_text(json.dumps({"count": len(missing), "items": missing}, ensure_ascii=False, indent=2))
    print(json.dumps({"out": str(OUT), "count": len(missing), "byParent": _count_by_parent(missing)}))


def _count_by_parent(items: list[dict]) -> dict:
    out: dict[str, int] = {}
    for item in items:
        pid = item["parentPageId"]
        out[pid] = out.get(pid, 0) + 1
    return out


if __name__ == "__main__":
    main()
