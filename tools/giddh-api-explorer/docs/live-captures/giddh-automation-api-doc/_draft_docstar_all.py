#!/usr/bin/env python3
"""Build and upload grouped DocStar drafts. Never publishes (state stays 1)."""

from __future__ import annotations

import json
import re
import sys
import time
import urllib.error
import urllib.request
from collections import defaultdict
from pathlib import Path

ROOT = Path("/Users/divyanshu/Documents/Giddh-New-Angular4-App")
CATALOG = ROOT / "docs/api/coverage/catalog.json"
sys.path.insert(0, str(ROOT / "docs/api/coverage"))
from catalog_parameter_docs import (  # noqa: E402
    docstar_body_block,
    docstar_body_description,
    docstar_query_params,
    load_overrides,
    record_key,
)
from sanitize_javadoc import (  # noqa: E402
    format_public_endpoint_description,
    publicize_sample_response_description,
    sanitize_javadoc_text,
)

PARAM_OVERRIDES = load_overrides()

JAVA = Path(
    "/Users/divyanshu/Downloads/giddha-giddh-api-v2-57797b57402f/src/main/java/com/giddh/api/config/InterceptorConfig.java"
)
OUT = ROOT / "docs/api/live-captures/giddh-automation-api-doc/docstar-grouped-drafts.json"
ORG = "12427"
COLLECTION = "Qu2nsC5BQofh"
ROOT_PAGE = "UaD_rrskJXGB"
BASE = "https://api.giddh.com"
API = "https://api.docstar.io"
AUTH_KEY_PREFILL = "ENTER_YOUR_GIDDH_AUTH_KEY"
SESSION_ID_PREFILL = "ENTER_YOUR_GIDDH_SESSION_ID"
SKIP_QUERY = {"t", "z", "lang"}

# Reuse these sidebar pages when the menu name matches.
EXISTING_MENUS = {
    "Customer Portal": "VgAmTJbqjWpa",
    "Magic Link": "So3xwl7_76Qn",
    "Inventory": "qYHSi8R8nFgy",
    "Website": "R4zC68ikZEIH",
    "Purchase Order": "Tzbf9HQc0xXn",
    "India Tax": "-d3uEbvFXG3N",
    "Voucher": "3ZbfQExiaTWU",
    "Reports": "u5gKNMlRl-3w",
    "Proforma": "xwzlMhVUcCUI",
    "Estimation": "X__hfNxx0erg",
    "Sales Person": "JA6_Fan793Ji",
}

PREFIXES = [
    ("salesperson", "Sales Person"),
    ("sales-register", "Sales Register"),
    ("sales-report", "Sales Register"),
    ("new-old-sales", "Sales Register"),
    ("purchase-register", "Purchase Register"),
    ("purchase-order", "Purchase Order"),
    ("purchase-bill", "Purchase Bill"),
    ("stock-group", "Stock Group"),
    ("stock-unit", "Stock Unit"),
    ("branch-transfer", "Branch Transfer"),
    ("inventory-adjustment", "Inventory Adjustment"),
    ("inventory-user", "Inventory User"),
    ("inventory", "Inventory"),
    ("business-document", "Business Document"),
    ("delivery-challan", "Business Document"),
    ("receipt-note", "Business Document"),
    ("recurring-voucher", "Recurring Voucher"),
    ("advance-receipt", "Advance Receipt"),
    ("petty-cash", "Petty Cash"),
    ("pettycash", "Petty Cash"),
    ("custom-field", "Custom Field"),
    ("customfield", "Custom Field"),
    ("customer-vendor-discount", "Discount"),
    ("trial-balance", "Trial Balance"),
    ("balance-sheet", "Balance Sheet"),
    ("profit-loss", "Profit and Loss"),
    ("e-invoice", "E-Invoice"),
    ("einvoice", "E-Invoice"),
    ("eway", "E-Way Bill"),
    ("ewb", "E-Way Bill"),
    ("gstr", "GST"),
    ("gst", "GST"),
    ("magic-link", "Magic Link"),
    ("portal-user", "Customer Portal"),
    ("portal", "Customer Portal"),
    ("accounts", "Account"),
    ("account", "Account"),
    ("groups", "Group"),
    ("group", "Group"),
    ("stocks", "Stock"),
    ("stock", "Stock"),
    ("warehouse", "Warehouse"),
    ("branches", "Branch"),
    ("branch", "Branch"),
    ("vouchers", "Voucher"),
    ("voucher", "Voucher"),
    ("invoices", "Invoice"),
    ("invoice", "Invoice"),
    ("ledgers", "Ledger"),
    ("ledger", "Ledger"),
    ("proforma", "Proforma"),
    ("estimates", "Estimation"),
    ("estimate", "Estimation"),
    ("tax", "India Tax"),
    ("vat", "VAT"),
    ("users", "User"),
    ("user", "User"),
    ("role", "Permission"),
    ("permission", "Permission"),
    ("subscription", "Subscription"),
    ("billing", "Subscription"),
    ("razorpay", "Payment"),
    ("paypal", "Payment"),
    ("payu", "Payment"),
    ("gocardless", "Banking"),
    ("bank", "Banking"),
    ("imports", "Import"),
    ("import", "Import"),
    ("export", "Export"),
    ("communication", "Communication"),
    ("project", "Project"),
    ("template", "Template"),
    ("currency", "Currency"),
    ("country", "Country"),
    ("dashboard", "Dashboard"),
    ("audit", "Audit"),
    ("activity", "Audit"),
    ("discount", "Discount"),
    ("manufactur", "Manufacturing"),
    ("batch", "Manufacturing"),
    ("setting", "Settings"),
    ("address", "Company"),
    ("company", "Company"),
    ("white-label", "Website"),
    ("ecommerce", "E-commerce"),
    ("webhook", "Webhook"),
    ("login", "Auth"),
    ("signup", "Auth"),
    ("auth", "Auth"),
]


def java_array(name: str, text: str) -> list[str]:
    match = re.search(rf"{name}\s*=\s*new String\[\]\s*\{{(.*?)\}};", text, re.S)
    if not match:
        raise SystemExit(f"missing java array {name}")
    return re.findall(r'"([^"]+)"', match.group(1))


def ant_to_re(pattern: str) -> re.Pattern[str]:
    parts: list[str] = []
    i = 0
    while i < len(pattern):
        if pattern.startswith("**", i):
            parts.append(".*")
            i += 2
        elif pattern[i] == "*":
            parts.append("[^/]*")
            i += 1
        else:
            parts.append(re.escape(pattern[i]))
            i += 1
    return re.compile("^" + "".join(parts) + "$")


def compile_patterns(values: list[str]) -> list[re.Pattern[str]]:
    return [ant_to_re(item) for item in values]


def matches(path: str, patterns: list[re.Pattern[str]]) -> bool:
    return any(pattern.match(path) for pattern in patterns)


def shrink(value, depth: int = 0):
    if isinstance(value, str):
        return value if len(value) <= 180 else value[:180] + "…"
    if isinstance(value, list):
        return [shrink(item, depth + 1) for item in value[:5]]
    if isinstance(value, dict):
        if depth > 3:
            return {}
        out = {}
        for index, (key, item) in enumerate(value.items()):
            if index >= 12:
                break
            out[str(key)] = shrink(item, depth + 1)
        return out
    if isinstance(value, (int, float, bool)) or value is None:
        return value
    return str(value)[:180]


PATH_RULES = [
    ("salesperson", "Sales Person"),
    ("magic-link", "Magic Link"),
    ("portal", "Customer Portal"),
    ("stock-group", "Stock Group"),
    ("hierarchical-stock", "Stock Group"),
    ("flatten-stock", "Stock Group"),
    ("stock-unit", "Stock Unit"),
    ("inventory", "Inventory"),
    ("/stock", "Stock"),
    ("gstr", "GST"),
    ("/gst", "GST"),
    ("/dsc/", "GST"),
    ("vat", "VAT"),
    ("eway", "E-Way Bill"),
    ("ewb", "E-Way Bill"),
    ("einvoice", "E-Invoice"),
    ("e-invoice", "E-Invoice"),
    ("financial-year", "Financial Year"),
    ("add-domain", "Company"),
    ("verify-domain", "Company"),
    ("/domain", "Company"),
    ("email-key", "Communication"),
    ("sms-key", "Communication"),
    ("gmail", "Communication"),
    ("mail-token", "Communication"),
    ("purchases-register", "Purchase Register"),
    ("purchase-register", "Purchase Register"),
    ("purchase-record", "Purchase Register"),
    ("sales-register", "Sales Register"),
    ("sales-report", "Sales Register"),
    ("new-old-sales", "Sales Register"),
    ("trial-balance", "Reports"),
    ("balance-sheet", "Reports"),
    ("profit-loss", "Reports"),
    ("daybook", "Reports"),
    ("cash-flow", "Reports"),
    ("due-amount", "Reports"),
    ("reverse-charge", "Reports"),
    ("multicompany", "Reports"),
    ("/cogs", "Reports"),
    ("calculateratio", "Reports"),
    ("report", "Reports"),
    ("brief-account", "Account"),
    ("flatten-account", "Account"),
    ("account-search", "Account"),
    ("/account", "Account"),
    ("top-shared-group", "Group"),
    ("shared-with", "Group"),
    ("/group", "Group"),
    ("plaid", "Banking"),
    ("yodlee", "Banking"),
    ("gocardless", "Banking"),
    ("/bank", "Banking"),
    ("razorpay", "Payment"),
    ("paypal", "Payment"),
    ("payu", "Payment"),
    ("/uer/", "Permission"),
    ("entity-role", "Permission"),
    ("/role", "Permission"),
    ("permission", "Permission"),
    ("trigger", "Trigger"),
    ("login", "Auth"),
    ("signup", "Auth"),
    ("verify-email", "Auth"),
    ("verify-number", "Auth"),
    ("reset-password", "Auth"),
    ("generate-otp", "Auth"),
    ("/auth", "Auth"),
    ("import", "Import"),
    ("export", "Export"),
    ("business-document", "Business Documents"),
    ("delivery-challan", "Business Documents"),
    ("receipt-note", "Business Documents"),
    ("voucher", "Voucher"),
    ("invoice", "Invoice"),
    ("ledger", "Ledger"),
    ("proforma", "Proforma"),
    ("estimate", "Estimation"),
    ("purchase-order", "Purchase Order"),
    ("purchase-bill", "Purchase Bill"),
    ("warehouse", "Warehouse"),
    ("branch-transfer", "Branch Transfer"),
    ("branch", "Branch"),
    ("project", "Project"),
    ("template", "Template"),
    ("customfield", "Custom Field"),
    ("custom-field", "Custom Field"),
    ("discount", "Discount"),
    ("manufactur", "Manufacturing"),
    ("/batch", "Manufacturing"),
    ("subscription", "Subscription"),
    ("/plan", "Subscription"),
    ("billing", "Subscription"),
    ("petty", "Petty Cash"),
    ("currency", "Currency"),
    ("country", "Country"),
    ("webhook", "Webhook"),
    ("ecommerce", "E-commerce"),
    ("white-label", "Website"),
    ("/tax", "India Tax"),
    ("communication", "Communication"),
    ("dashboard", "Dashboard"),
    ("audit", "Audit"),
    ("activity", "Audit"),
    ("setting", "Settings"),
    ("user", "User"),
]


def segments(path: str) -> list[str]:
    parts = [part for part in path.strip("/").split("/") if part and not part.startswith("{")]
    if parts and parts[0] == "company":
        parts = parts[1:]
    while parts and parts[0] in {"v2", "v3", "v4", "v5", "ui"}:
        parts.pop(0)
    if parts and parts[0] in {"us", "uk", "in", "ke", "zw", "ae", "sa", "kenya"} and len(parts) > 1:
        parts = parts[1:]
    return parts


def menu_for(path: str, surfaces: set[str]) -> str:
    if "customer-portal" in surfaces or "/portal" in path:
        return "Customer Portal"
    if "magic-link" in surfaces and "giddh-panel" not in surfaces:
        return "Magic Link"
    if "giddh-website" in surfaces and "giddh-panel" not in surfaces:
        return "Website"
    lowered = path.lower()
    if lowered.startswith("/ui/") or lowered.startswith("ui/"):
        return "Reference Data"
    for needle, name in PATH_RULES:
        if needle in lowered:
            return name
    parts = segments(path)
    key = parts[0] if parts else "company"
    return key.replace("-", " ").replace("_", " ").title()


def spring_path(path: str) -> str:
    return re.sub(r"\{[^}]+\}", "x", "/" + path.strip("/"))


def auth_mode(path: str, compiled: dict[str, list[re.Pattern[str]]]) -> str:
    probe = spring_path(path)
    if matches(probe, compiled["session"]) and not matches(probe, compiled["api_exclude"]):
        return "session"
    if matches(probe, compiled["portal"]) and not matches(probe, compiled["portal_exclude"]):
        return "portal"
    if matches(probe, compiled["api_exclude"]):
        return "none"
    return "both"


def auth_headers(mode: str) -> dict:
    accept = {"checked": "true", "value": "application/json", "description": "Ask for JSON."}
    if mode == "both":
        return {
            "Auth-Key": {
                "checked": "true",
                "value": AUTH_KEY_PREFILL,
                "description": "Company auth key. Send this or Session-Id. One is required.",
            },
            "Session-Id": {
                "checked": "true",
                "value": SESSION_ID_PREFILL,
                "description": "Logged-in user session. Send this or Auth-Key. One is required.",
            },
            "Accept": accept,
        }
    if mode == "session":
        return {
            "Session-Id": {
                "checked": "true",
                "value": SESSION_ID_PREFILL,
                "description": "Logged-in user session. Required. Auth-Key is not accepted on this path.",
            },
            "Accept": accept,
        }
    if mode == "portal":
        return {
            "Session-Id": {
                "checked": "true",
                "value": SESSION_ID_PREFILL,
                "description": "Customer portal session. Required.",
            },
            "Accept": accept,
        }
    return {"Accept": accept}


def auth_sentence(mode: str) -> str:
    if mode == "both":
        return "Requires Auth-Key or Session-Id."
    if mode == "session":
        return "Requires Session-Id."
    if mode == "portal":
        return "Requires customer portal Session-Id."
    return "No authentication required."


def title_for(record: dict, menu: str) -> str:
    raw = sanitize_javadoc_text((record.get("description") or "").strip())
    generic = {"create", "get", "get all", "update", "delete", "post", "put", "patch", "list"}
    if raw and raw.lower() not in generic and len(raw) > 18:
        text = raw[:1].upper() + raw[1:]
        return text[:77] + ("…" if len(text) > 77 else "")
    handler = record.get("handler") or raw or record.get("method") or "Call"
    words = re.sub(r"([a-z])([A-Z])", r"\1 \2", handler).replace("_", " ").strip()
    words = re.sub(r"\s+", " ", words).title()
    if words.lower() in {"get all", "get", "create", "update", "delete", "list"}:
        words = f"{words} {menu}"
    return words[:80]


def doc_url(path: str) -> str:
    converted = re.sub(r"\{([^}]+)\}", r":\1", path if path.startswith("/") else "/" + path)
    return BASE + converted


def path_variables(path: str) -> dict:
    names = re.findall(r"\{([^}]+)\}", path)
    return {
        str(index): {
            "checked": "notApplicable",
            "key": name,
            "value": "",
            "description": name,
        }
        for index, name in enumerate(names)
    }


def query_params(record: dict) -> dict:
    key = record_key(record.get("method") or "", record.get("path") or "")
    return docstar_query_params(record, PARAM_OVERRIDES.get(key), skip=SKIP_QUERY)


def body_block(record: dict) -> dict:
    key = record_key(record.get("method") or "", record.get("path") or "")
    block = docstar_body_block(record, PARAM_OVERRIDES.get(key))
    if block.get("type") == "JSON":
        raw = block["raw"]["value"]
        block = {
            "type": "JSON",
            "raw": {"rawType": "JSON", "value": json.dumps(shrink(json.loads(raw)), indent=2)},
        }
    return block


def body_description(record: dict) -> dict:
    key = record_key(record.get("method") or "", record.get("path") or "")
    return docstar_body_description(record, PARAM_OVERRIDES.get(key))


def samples(record: dict) -> list[dict]:
    response = record.get("response") or {}
    out = []
    success = response.get("successExample")
    if success is not None:
        out.append(
            {
                "title": "Success",
                "status": response.get("httpStatus") or 200,
                "description": "Saved success example from the API catalog capture.",
                "data": shrink(success) if isinstance(success, dict) else {"result": shrink(success)},
            }
        )
    errors = []
    for item in response.get("errorExamples") or []:
        when = item.get("when") or ""
        score = 0
        if "shared ExceptionHandler" not in when:
            score += 2
        if item.get("code") in {"INVALID_AUTH_KEY", "INVALID_SESSION", "MISSING_HEADER"}:
            score += 1
        errors.append((score, item))
    errors.sort(key=lambda pair: pair[0], reverse=True)
    seen = set()
    for _, item in errors:
        code = item.get("code")
        if code in seen:
            continue
        seen.add(code)
        example = item.get("example") or {
            "status": "error",
            "code": code,
            "message": item.get("message"),
        }
        out.append(
            {
                "title": (item.get("message") or code or "Error")[:60],
                "status": item.get("httpStatus") or 400,
                "description": publicize_sample_response_description(
                    f"Verified from controller. {when}"
                ),
                "data": shrink(example) if isinstance(example, dict) else {"result": shrink(example)},
            }
        )
        if len(out) >= 4:
            break
    return out


def describe(record: dict, menu: str, mode: str) -> str:
    if record.get("documentationSummary"):
        raw = record["documentationSummary"].strip().rstrip(".")
    else:
        raw = sanitize_javadoc_text(
            (record.get("description") or record.get("handler") or "Call this API").strip().rstrip(".")
        )
    sentence = raw[:1].upper() + raw[1:]
    if len(sentence) < 24:
        sentence = f"{sentence} a {menu.lower()} record"
    return format_public_endpoint_description(sentence, menu, auth_sentence(mode))


def build() -> dict:
    text = JAVA.read_text()
    compiled = {
        "api_exclude": compile_patterns(java_array("apiInterceptorExcludePatterns", text)),
        "session": compile_patterns(java_array("sessionAccessIncludePatterns", text)),
        "portal": compile_patterns(java_array("proxyIncludePatterns", text)),
        "portal_exclude": compile_patterns(java_array("proxyExcludePatterns", text)),
    }
    catalog = json.loads(CATALOG.read_text())
    chosen = {}
    for record in catalog["records"]:
        path_hint = (record.get("path") or "").lower()
        if record.get("classification") != "frontend-used" and "salesperson" not in path_hint:
            continue
        if record.get("classification") == "frontend-unmatched":
            continue
        method = (record.get("method") or "").upper()
        path = record.get("path") or ""
        if not method or not path or "{" in path and path.count("{") != path.count("}"):
            continue
        key = (method, path)
        current = chosen.get(key)
        if current is None:
            chosen[key] = record
        elif record.get("service") == "giddh-api-v2" and current.get("service") != "giddh-api-v2":
            chosen[key] = record
        elif (record.get("response") or {}).get("successExample") and not (
            current.get("response") or {}
        ).get("successExample"):
            chosen[key] = record
    menus = defaultdict(list)
    for (method, path), record in chosen.items():
        surfaces = set(record.get("surfaces") or [])
        menu = menu_for(path, surfaces)
        mode = auth_mode(path, compiled)
        headers = auth_headers(mode)
        body = body_block(record)
        if body.get("type") == "JSON":
            headers["Content-Type"] = {
                "checked": "true",
                "value": "application/json",
                "description": "JSON body.",
            }
        menus[menu].append(
            {
                "name": title_for(record, menu),
                "requestType": method,
                "URL": doc_url(path),
                "description": describe(record, menu, mode),
                "headers": headers,
                "params": query_params(record),
                "pathVariables": path_variables(path),
                "body": body,
                "bodyDescription": body_description(record),
                "sampleResponse": samples(record),
                "state": 1,
            }
        )
    payload = {
        "menus": [
            {"name": name, "endpoints": items}
            for name, items in sorted(menus.items(), key=lambda item: (-len(item[1]), item[0]))
        ]
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False))
    print(json.dumps({"menus": len(payload["menus"]), "endpoints": sum(len(m["endpoints"]) for m in payload["menus"]), "file": str(OUT)}))
    for menu in payload["menus"]:
        print(f"{len(menu['endpoints']):4} {menu['name']}")
    return payload


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
            "User-Agent": "Mozilla/5.0 GiddhDocDraft",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as response:
            raw = response.read().decode()
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        raw = error.read().decode()
        try:
            parsed = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            parsed = {"raw": raw[:500]}
        return error.code, parsed


def norm_url(url: str) -> str:
    url = (url or "").split("?", 1)[0].rstrip("/").lower()
    url = re.sub(r":[a-za-z0-9_]+", "{}", url)
    url = re.sub(r"\{[^}]+\}", "{}", url)
    return url


def upload(token: str) -> None:
    payload = json.loads(OUT.read_text())
    status, pages = request("GET", f"{API}/orgs/{ORG}/collections/{COLLECTION}/pages", token)
    if status != 200:
        raise SystemExit(f"list pages failed {status} {pages}")
    page_rows = pages.get("pages") if isinstance(pages, dict) else pages
    by_name = {row.get("name"): row["id"] for row in page_rows if row.get("type") == 1}
    menu_ids = dict(EXISTING_MENUS)
    for menu in payload["menus"]:
        name = menu["name"]
        if name in by_name:
            menu_ids[name] = by_name[name]
            continue
        if name in menu_ids and menu_ids[name]:
            continue
        status, created = request(
            "POST",
            f"{API}/orgs/{ORG}/pages/{ROOT_PAGE}",
            token,
            {
                "name": name,
                "state": 1,
                "contents": f"<p>These APIs belong to {name}. They are grouped here so you can find every {name} API in one place.</p>",
            },
        )
        if status not in (200, 201):
            raise SystemExit(f"create menu {name} failed {status} {created}")
        page = created.get("page") or created
        menu_ids[name] = page["id"]
        print("menu", name, page["id"], flush=True)
        time.sleep(0.15)

    status, existing = request("GET", f"{API}/orgs/{ORG}/collections/{COLLECTION}/endpoints", token)
    if status != 200:
        raise SystemExit(f"list endpoints failed {status} {str(existing)[:400]}")
    rows = existing if isinstance(existing, list) else existing.get("endpoints") or existing.get("data") or []
    index = {}
    for row in rows:
        index.setdefault((row.get("requestType"), norm_url(row.get("URL") or "")), row)

    created_count = 0
    updated_count = 0
    failed = []
    for menu in payload["menus"]:
        parent = menu_ids[menu["name"]]
        for endpoint in menu["endpoints"]:
            key = (endpoint["requestType"], norm_url(endpoint["URL"]))
            current = index.get(key)
            body = dict(endpoint)
            body["state"] = 1
            if current and current.get("parentId") == parent:
                status, result = request("PUT", f"{API}/orgs/{ORG}/endpoints/{current['id']}", token, body)
                kind = "update"
            elif current:
                request("DELETE", f"{API}/orgs/{ORG}/pages/{current['id']}", token)
                status, result = request("POST", f"{API}/orgs/{ORG}/pages/{parent}/endpoints", token, body)
                kind = "move"
            else:
                status, result = request("POST", f"{API}/orgs/{ORG}/pages/{parent}/endpoints", token, body)
                kind = "create"
            if status not in (200, 201):
                failed.append({"name": endpoint["name"], "status": status, "kind": kind, "error": str(result)[:240]})
                print("FAIL", endpoint["requestType"], endpoint["name"], status, flush=True)
            else:
                if kind == "update":
                    updated_count += 1
                else:
                    created_count += 1
                if (created_count + updated_count) % 25 == 0:
                    print(f"progress created={created_count} updated={updated_count} failed={len(failed)}", flush=True)
            time.sleep(0.12)
    summary = {"created": created_count, "updated": updated_count, "failed": len(failed)}
    Path("/tmp/docstar-draft-upload-summary.json").write_text(json.dumps({"summary": summary, "failed": failed[:40]}, indent=2))
    print(json.dumps(summary), flush=True)


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "upload":
        token = Path("/tmp/docstar-hm-token").read_text().strip()
        upload(token)
    else:
        build()
