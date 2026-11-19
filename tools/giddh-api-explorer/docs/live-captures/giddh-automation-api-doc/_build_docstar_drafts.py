#!/usr/bin/env python3
"""Build Docstar draft payloads for frontend-used Giddh APIs. Does not call Docstar."""

from __future__ import annotations

import json
import re
from pathlib import Path

import sys

ROOT = Path("/Users/divyanshu/Documents/Giddh-New-Angular4-App")
sys.path.insert(0, str(ROOT / "docs/api/coverage"))
from sanitize_javadoc import sanitize_javadoc_text  # noqa: E402
EXPORT = ROOT / "Giddh API Reference (1).json"
CATALOG = ROOT / "docs/api/coverage/catalog.json"
OUT = ROOT / "docs/api/live-captures/giddh-automation-api-doc/docstar-draft-payloads.json"

SKIP_QUERY = {"t", "z", "lang"}
BASE = "https://api.giddh.com"
AUTH_KEY_PREFILL = "ENTER_YOUR_GIDDH_AUTH_KEY"
SESSION_ID_PREFILL = "ENTER_YOUR_GIDDH_SESSION_ID"
PLACEHOLDERS = {
    "companyunqiuename",
    "companyuniquename",
    "companyunique",
    "groupname",
    "groupuniquename",
    "accountunqiue",
    "accountuniquename",
    "voucherunqiuename",
    "voucheruniquename",
    "entryuniquename",
    "branchuniquename",
    "stockuniquename",
}

# Existing section pages in Giddh API Reference (collection MzcxumU2s93K).
SECTIONS = [
    ("pettycash", "dWEWGdBqll6k"),
    ("purchase-order", "0NbapUXBTg-8"),
    ("proforma", "kQPUgCMlVROJ"),
    ("estimate", "uHVADpPTJuOQ"),
    ("inventory", "_Sb7xeNWjLiF"),
    ("stock", "_Sb7xeNWjLiF"),
    ("vat-report", "7uzyt62iDnQg"),
    ("/vat", "7uzyt62iDnQg"),
    ("gst", "yvWbvqBDP54t"),
    ("eway", "yvWbvqBDP54t"),
    ("trial-balance", "svaAqChtXs1l"),
    ("balance-sheet", "svaAqChtXs1l"),
    ("profit-loss", "svaAqChtXs1l"),
    ("report", "svaAqChtXs1l"),
    ("voucher", "hH16Zm1TJ0pS"),
    ("invoice", "hH16Zm1TJ0pS"),
    ("ledger", "nLx_IiEE-aMI"),
    ("entry", "nLx_IiEE-aMI"),
    ("group", "ThTK2COOVKm7"),
    ("account", "ThTK2COOVKm7"),
    ("export", "55aMtVC97P-r"),
    ("permission", "nxNDEH-umy0p"),
    ("branch", "xraRxApkIc4e"),
    ("audit", "7J2SbSDJjT5b"),
    ("dashboard", "JTu_PPHmHkiF"),
]


def strip_tags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value or "")


def norm_path(url: str) -> str:
    url = strip_tags(url).replace("&amp;", "&")
    url = re.sub(r"^https?://[^/]+", "", url)
    path = url.split("?", 1)[0].strip("/").lower()
    path = re.sub(r":([A-Za-z0-9_]+)", "{}", path)
    path = re.sub(r"\{[^}]+\}", "{}", path)
    parts = []
    for part in path.split("/"):
        if part in PLACEHOLDERS or re.fullmatch(r"[a-z0-9]{18,}", part or ""):
            parts.append("{}")
        else:
            parts.append(part)
    return "/".join(parts)


def cat_path(record: dict) -> str:
    path = (record.get("path") or "").strip("/")
    return re.sub(r"\{[^}]+\}", "{}", path).lower()


def shrink(value, depth: int = 0):
    if isinstance(value, str):
        return value if len(value) <= 160 else value[:160] + "…"
    if isinstance(value, list):
        return [shrink(item, depth + 1) for item in value[:6]]
    if isinstance(value, dict):
        if depth > 3:
            return {}
        out = {}
        for index, (key, item) in enumerate(value.items()):
            if index >= 18:
                break
            out[str(key)] = shrink(item, depth + 1)
        return out
    if isinstance(value, (int, float, bool)) or value is None:
        return value
    return str(value)[:160]


def as_object(value):
    shrunk = shrink(value)
    if isinstance(shrunk, dict):
        return shrunk
    return {"result": shrunk}


def describe(record: dict) -> str:
    raw = sanitize_javadoc_text(
        (record.get("description") or record.get("handler") or "Call this API").strip().rstrip(".")
    )
    sentence = raw[:1].upper() + raw[1:]
    surfaces = set(record.get("surfaces") or [])
    if "customer-portal" in surfaces:
        auth = "Send the portal Session-Id."
    elif "magic-link" in surfaces and "giddh-panel" not in surfaces:
        auth = "Open with the magic-link id. No Auth-Key."
    else:
        auth = "Send the Auth-Key header."
    query = [item.get("name") for item in ((record.get("parameters") or {}).get("query") or [])]
    extra = " Pass voucherVersion=2." if "voucherVersion" in query else ""
    return f"{sentence}. {auth}{extra}"


def header(name: str, value: str, description: str) -> dict:
    return {"checked": "true", "value": value, "description": description}


def build_body(record: dict) -> dict:
    method = (record.get("method") or "GET").upper()
    path = record.get("path") or ""
    names = re.findall(r"\{([^}]+)\}", path)
    url_path = path
    for name in names:
        url_path = url_path.replace("{" + name + "}", ":" + name)
    query = []
    for item in (record.get("parameters") or {}).get("query") or []:
        name = item.get("name")
        if not name or name in SKIP_QUERY:
            continue
        query.append(item)
    params = {}
    for item in query:
        required = bool(item.get("required"))
        default = item.get("defaultValue")
        params[item["name"]] = {
            "checked": "true",
            "value": "" if default is None else str(default),
            "description": "Required." if required else "Optional.",
        }
    path_variables = {}
    for index, name in enumerate(names):
        path_variables[str(index)] = {
            "checked": "notApplicable",
            "key": name,
            "value": "",
            "description": f"Required path value for {name}.",
        }
    surfaces = set(record.get("surfaces") or [])
    headers = {}
    if not ("magic-link" in surfaces and "giddh-panel" not in surfaces and "customer-portal" not in surfaces):
        if "customer-portal" in surfaces and "giddh-panel" not in surfaces:
            headers["Session-Id"] = header(
                "Session-Id", SESSION_ID_PREFILL, "Portal session from save-session."
            )
        else:
            headers["Auth-Key"] = header("Auth-Key", AUTH_KEY_PREFILL, "Required. Company auth key.")
    request_body = (record.get("requestBody") or {}).get("example")
    has_body = method in {"POST", "PUT", "PATCH"} and request_body not in (None, "", {})
    body = {"type": "none"}
    if has_body:
        headers["Content-Type"] = header("Content-Type", "application/json", "JSON body.")
        body = {
            "type": "JSON",
            "raw": {"rawType": "JSON", "value": json.dumps(shrink(request_body), ensure_ascii=False)},
        }
    response = record.get("response") or {}
    success = response.get("successExample")
    if success is None:
        success = ((response.get("preparedSuccess") or {}).get("example"))
    samples = []
    if success is not None:
        samples.append(
            {
                "title": "Success",
                "status": int(response.get("httpStatus") or 200),
                "description": "Success.",
                "data": as_object(success),
            }
        )
    errors = list(response.get("preparedErrors") or [])
    errors.sort(key=lambda item: 0 if item.get("liveVerified") else 1)
    if errors:
        err = errors[0]
        samples.append(
            {
                "title": str(err.get("code") or "Error"),
                "status": int(err.get("httpStatus") or 400),
                "description": str(err.get("message") or "Request failed.")[:180],
                "data": as_object(err.get("example") or {"status": "error", "code": err.get("code"), "message": err.get("message")}),
            }
        )
    title = (record.get("description") or record.get("handler") or method).strip()
    if len(title) > 80:
        title = title[:77] + "…"
    return {
        "name": title,
        "requestType": method,
        "URL": BASE + url_path,
        "description": describe(record),
        "headers": headers,
        "params": params,
        "pathVariables": path_variables,
        "body": body,
        "sampleResponse": samples,
        "state": 1,
    }


def section_for(path: str, surfaces: set[str]) -> str:
    if "customer-portal" in surfaces:
        return "NEW:Customer Portal"
    if "magic-link" in surfaces and "giddh-panel" not in surfaces:
        return "NEW:Magic Link"
    if "giddh-website" in surfaces and "giddh-panel" not in surfaces:
        return "NEW:Website"
    lowered = path.lower()
    for needle, page_id in SECTIONS:
        if needle in lowered:
            return page_id
    return "NEW:Other APIs"


def main() -> None:
    export = json.loads(EXPORT.read_text())
    catalog = json.loads(CATALOG.read_text())
    records = []
    for record in catalog["records"]:
        surfaces = set(record.get("surfaces") or [])
        if record.get("classification") == "frontend-used" or surfaces & {
            "giddh-panel",
            "giddh-website",
            "customer-portal",
            "magic-link",
        }:
            if record.get("path") and record.get("method"):
                records.append(record)
    index = {}
    for record in records:
        index.setdefault(((record.get("method") or "").upper(), cat_path(record)), record)
    updates = []
    used_keys = set()
    for endpoint in export["endpointData"]:
        key = ((endpoint.get("requestType") or "").upper(), norm_path(endpoint.get("URL") or ""))
        record = index.get(key)
        if not record:
            continue
        used_keys.add(key)
        updates.append({"endpointId": endpoint["id"], "body": build_body(record)})
    creates = []
    for record in records:
        key = ((record.get("method") or "").upper(), cat_path(record))
        if key in used_keys:
            continue
        used_keys.add(key)
        creates.append(
            {
                "section": section_for(record.get("path") or "", set(record.get("surfaces") or [])),
                "body": build_body(record),
            }
        )
    OUT.write_text(
        json.dumps(
            {"updates": updates, "creates": creates, "updateCount": len(updates), "createCount": len(creates)},
            ensure_ascii=False,
        )
    )
    print(json.dumps({"updates": len(updates), "creates": len(creates), "records": len(records)}))


if __name__ == "__main__":
    main()
