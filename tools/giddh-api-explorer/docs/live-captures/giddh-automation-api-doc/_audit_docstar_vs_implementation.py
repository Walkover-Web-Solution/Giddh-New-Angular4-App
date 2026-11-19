#!/usr/bin/env python3
"""Implementation-driven audit: DocStar endpoints vs catalog vs Spring controllers.

Produces:
  - DOCSTAR-IMPLEMENTATION-AUDIT-REPORT.md
  - docstar-implementation-audit.json
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass, field
from pathlib import Path

ROOT = Path("/Users/divyanshu/Documents/Giddh-New-Angular4-App")
DOCSTAR = ROOT / "docs/api/live-captures/giddh-automation-api-doc"
CATALOG = ROOT / "docs/api/coverage/catalog.json"
LIVE_RAW = DOCSTAR / "docstar-live-endpoints-raw.json"
LIVE_INDEX = DOCSTAR / "docstar-live-endpoint-index.json"

REPO_ROOTS = {
    "giddh-api-v2": Path("/Users/divyanshu/Downloads/giddha-giddh-api-v2-57797b57402f"),
    "accounting-microservice": Path(
        "/Users/divyanshu/Downloads/giddha-giddh-accounting-microservice-21ec5e126986"
    ),
    "import-microservice": Path(
        "/Users/divyanshu/Downloads/giddha-giddh-import-microservice-eb3f6ae25db5"
    ),
    "search-api": Path("/Users/divyanshu/Downloads/giddha-giddh-search-api-a9ab0faf66ed"),
}

SCOPE_SERVICES = frozenset(REPO_ROOTS)


def norm_url(url: str) -> str:
    url = (url or "").split("?", 1)[0].rstrip("/").lower()
    url = url.replace("https://api.giddh.com", "").replace("https://apitest.giddh.com", "")
    # Collapse {name} / {name:.+} first so colon-regex inside braces is not mangled.
    url = re.sub(r"\{[^}]+\}", "{}", url)
    # DocStar / Spring-style :name or :name:.+
    url = re.sub(r":[a-za-z0-9_.-]+(?::\.[^/]*)?", "{}", url)
    return url


def catalog_path_from_record(path: str) -> str:
    return norm_url(f"https://api.giddh.com{path if path.startswith('/') else '/' + path}")


REQUEST_PARAM_RE = re.compile(
    r"@RequestParam\s*(?:\((?P<args>.*?)\))?\s+(?:final\s+)?(?P<type>[\w.<>,\s?]+?)\s+(?P<name>\w+)\s*[,)]",
    re.DOTALL,
)
REQ_NAME_RE = re.compile(r"(?:value|name)\s*=\s*\"([^\"]+)\"")
REQ_REQUIRED_RE = re.compile(r"required\s*=\s*(true|false)")
REQ_DEFAULT_RE = re.compile(r"defaultValue\s*=\s*\"([^\"]*)\"")


def extract_method_block(text: str, handler: str, approx_line: int) -> str | None:
    """Best-effort extract of a Java method body starting near approx_line."""
    if not handler:
        return None
    lines = text.splitlines()
    # Prefer nearest method signature matching handler name
    candidates: list[int] = []
    sig = re.compile(rf"\b{re.escape(handler)}\s*\(")
    for i, line in enumerate(lines):
        if sig.search(line) and "@" not in line.split(handler)[0]:
            # look back for Mapping annotation
            window = "\n".join(lines[max(0, i - 12) : i + 1])
            if re.search(r"@(Get|Post|Put|Patch|Delete|Request)Mapping", window):
                candidates.append(i)
    if not candidates:
        for i, line in enumerate(lines):
            if sig.search(line):
                candidates.append(i)
    if not candidates:
        return None
    # pick closest to approx_line (1-based)
    target = max(0, (approx_line or 1) - 1)
    start = min(candidates, key=lambda i: abs(i - target))
    # walk back to include annotations
    ann_start = start
    while ann_start > 0 and (
        lines[ann_start - 1].strip().startswith("@")
        or lines[ann_start - 1].strip().startswith("//")
        or lines[ann_start - 1].strip().startswith("*")
        or lines[ann_start - 1].strip() == ""
        or lines[ann_start - 1].strip().startswith("public")
        or lines[ann_start - 1].strip().startswith("protected")
    ):
        ann_start -= 1
        if lines[ann_start].strip().startswith("public") or lines[ann_start].strip().startswith(
            "protected"
        ):
            break
    # find opening brace then match braces for signature+params only (until first {)
    chunk_start = "\n".join(lines[ann_start : start + 80])
    brace = chunk_start.find("{")
    if brace < 0:
        return chunk_start
    # Include annotations + signature through closing paren before {
    return chunk_start[: brace + 1]


def parse_request_params(method_src: str) -> list[dict]:
    out: list[dict] = []
    for m in REQUEST_PARAM_RE.finditer(method_src or ""):
        args = m.group("args") or ""
        java_name = m.group("name")
        java_type = re.sub(r"\s+", " ", (m.group("type") or "").strip())
        name_m = REQ_NAME_RE.search(args)
        name = name_m.group(1) if name_m else java_name
        req_m = REQ_REQUIRED_RE.search(args)
        # Spring default: required=true unless defaultValue present
        if req_m:
            required = req_m.group(1) == "true"
        else:
            required = "defaultValue" not in args
        def_m = REQ_DEFAULT_RE.search(args)
        out.append(
            {
                "name": name,
                "type": java_type,
                "required": required,
                "defaultValue": def_m.group(1) if def_m else None,
                "source": "RequestParam",
            }
        )
    return out


@dataclass
class EndpointAudit:
    endpointId: str
    name: str | None
    method: str
    url: str
    routeKey: str
    status: str
    service: str | None = None
    controller: str | None = None
    handler: str | None = None
    sourceFile: str | None = None
    sourceLine: int | None = None
    catalogId: str | None = None
    issues: list[str] = field(default_factory=list)
    javaQuery: list[dict] = field(default_factory=list)
    catalogQuery: list[dict] = field(default_factory=list)
    docstarQueryIssues: list[str] = field(default_factory=list)
    bodyDescriptionEmpty: bool = False
    hasJsonBody: bool = False
    notes: list[str] = field(default_factory=list)


def record_score(record: dict) -> int:
    score = 0
    if record.get("service") in SCOPE_SERVICES:
        score += 10
    if record.get("service") == "giddh-api-v2":
        score += 2
    if record.get("classification") == "frontend-used":
        score += 3
    if (record.get("parameters") or {}).get("query"):
        score += 1
    if (record.get("requestBody") or {}).get("example"):
        score += 1
    return score


def build_catalog_by_route(catalog: dict) -> dict[str, dict]:
    by_route: dict[str, dict] = {}
    for record in catalog.get("records") or []:
        method = (record.get("method") or "").upper()
        path = record.get("path") or ""
        if not method or not path:
            continue
        rk = f"{method} {catalog_path_from_record(path)}"
        cur = by_route.get(rk)
        if cur is None or record_score(record) > record_score(cur):
            by_route[rk] = record
    return by_route


def resolve_source(record: dict) -> Path | None:
    service = record.get("service")
    rel = record.get("sourceFile")
    if not service or not rel:
        return None
    root = REPO_ROOTS.get(service)
    if not root:
        return None
    path = root / rel
    return path if path.is_file() else None


def analyze_docstar_params(ep: dict) -> list[str]:
    issues: list[str] = []
    params = ep.get("params") or {}
    for name, p in params.items():
        if not isinstance(p, dict):
            issues.append(f"param {name}: non-object entry")
            continue
        if "required" not in p:
            issues.append(f"param {name}: missing required boolean")
        elif not isinstance(p["required"], bool):
            issues.append(f"param {name}: required is {type(p['required']).__name__}={p['required']!r} (must be bool)")
        desc = (p.get("description") or "").strip()
        if not desc:
            issues.append(f"param {name}: empty description")
    return issues


def has_json_body(ep: dict) -> bool:
    body = ep.get("body") or {}
    btype = (body.get("type") or "").upper()
    if btype in ("", "NONE"):
        return False
    raw = ((body.get("raw") or {}).get("value") or "").strip()
    return bool(raw) and raw not in ("{}", "null", "[]")


def main() -> None:
    catalog = json.loads(CATALOG.read_text())
    by_route = build_catalog_by_route(catalog)
    raw_wrap = json.loads(LIVE_RAW.read_text())
    live_eps = raw_wrap.get("data") or {}
    index = json.loads(LIVE_INDEX.read_text())
    endpoints = index.get("endpoints") or {}

    audits: list[EndpointAudit] = []
    java_cache: dict[str, str] = {}

    for eid, meta in sorted(endpoints.items(), key=lambda x: (x[1].get("name") or "", x[0])):
        ep = live_eps.get(eid) or {}
        method = (meta.get("requestType") or ep.get("requestType") or "GET").upper()
        url = meta.get("URL") or ep.get("URL") or ""
        rk = f"{method} {norm_url(url)}"
        record = by_route.get(rk)
        audit = EndpointAudit(
            endpointId=eid,
            name=meta.get("name") or ep.get("name"),
            method=method,
            url=url,
            routeKey=rk,
            status="Unverified",
        )
        audit.docstarQueryIssues = analyze_docstar_params(ep)
        audit.hasJsonBody = has_json_body(ep)
        audit.bodyDescriptionEmpty = audit.hasJsonBody and not (ep.get("bodyDescription") or {})

        if not record:
            audit.status = "Missing from catalog / unmatched route"
            audit.issues.append("No catalog record matched method+normalized path")
            audits.append(audit)
            continue

        audit.catalogId = record.get("id")
        audit.service = record.get("service")
        audit.controller = record.get("controller")
        audit.handler = record.get("handler")
        audit.sourceFile = record.get("sourceFile")
        audit.sourceLine = record.get("sourceLine")
        audit.catalogQuery = list((record.get("parameters") or {}).get("query") or [])

        if record.get("service") not in SCOPE_SERVICES:
            audit.status = "Requires investigation"
            audit.issues.append(f"Matched non-scope service {record.get('service')}")
            audits.append(audit)
            continue

        src = resolve_source(record)
        if not src:
            audit.status = "Unverified"
            audit.issues.append("Controller source file not found on disk")
            audits.append(audit)
            continue

        key = str(src)
        if key not in java_cache:
            java_cache[key] = src.read_text(encoding="utf-8", errors="replace")
        method_src = extract_method_block(
            java_cache[key], record.get("handler") or "", int(record.get("sourceLine") or 1)
        )
        if not method_src:
            audit.status = "Unverified"
            audit.issues.append("Could not extract controller method from source")
            audits.append(audit)
            continue

        java_params = parse_request_params(method_src)
        audit.javaQuery = java_params

        cat_by_name = {p.get("name"): p for p in audit.catalogQuery if p.get("name")}
        java_by_name = {p["name"]: p for p in java_params}

        # Compare java vs catalog required
        for name, jp in java_by_name.items():
            cp = cat_by_name.get(name)
            if not cp:
                audit.issues.append(f"query `{name}` in Java @RequestParam but missing from catalog")
                continue
            if bool(cp.get("required")) != bool(jp.get("required")):
                audit.issues.append(
                    f"query `{name}` required mismatch: Java={jp['required']} catalog={cp.get('required')}"
                )
        for name in cat_by_name:
            if name not in java_by_name and java_params:
                # Catalog may document ModelAttribute query fields; only flag if method has RequestParams
                pass

        # DocStar vs catalog names
        ds_params = set((ep.get("params") or {}).keys())
        cat_names = set(cat_by_name)
        for name in sorted(cat_names - ds_params):
            audit.issues.append(f"query `{name}` in catalog but missing from DocStar params")
        for name in sorted(ds_params - cat_names):
            # Extra DocStar params can be intentional enrichments (e.g. voucherVersion)
            audit.notes.append(f"DocStar has extra query param `{name}` not in catalog list")

        if audit.docstarQueryIssues:
            audit.issues.extend(audit.docstarQueryIssues)
        if audit.bodyDescriptionEmpty:
            rb_fields = (record.get("requestBody") or {}).get("fields") or []
            if rb_fields or (record.get("requestBody") or {}).get("example"):
                audit.issues.append("JSON body present but DocStar bodyDescription empty")

        if audit.issues:
            audit.status = "Corrected needed" if any(
                "required" in i or "missing from DocStar" in i or "bodyDescription" in i or "mismatch" in i
                for i in audit.issues
            ) else "Requires investigation"
            # refine
            if all(
                i.startswith("DocStar has extra") or "empty description" in i
                for i in audit.issues
            ):
                pass
            if not any("mismatch" in i or "missing" in i or "required" in i or "bodyDescription" in i for i in audit.issues):
                if audit.issues:
                    audit.status = "Requires investigation"
            else:
                audit.status = "Needs correction"
        else:
            audit.status = "Verified — matches implementation"

        # javadoc-looking names
        if audit.name and ("{@code" in audit.name or "{@" in audit.name):
            audit.issues.append("Endpoint name still contains JavaDoc markup")
            audit.status = "Needs correction"

        audits.append(audit)

    # Backend inventory vs DocStar
    backend_routes = []
    for record in catalog.get("records") or []:
        if record.get("service") not in SCOPE_SERVICES:
            continue
        method = (record.get("method") or "").upper()
        path = record.get("path") or ""
        backend_routes.append(
            {
                "id": record.get("id"),
                "method": method,
                "path": path,
                "routeKey": f"{method} {catalog_path_from_record(path)}",
                "service": record.get("service"),
                "controller": record.get("controller"),
                "handler": record.get("handler"),
            }
        )

    docstar_routes = {a.routeKey for a in audits}
    missing_from_docstar = [b for b in backend_routes if b["routeKey"] not in docstar_routes]
    # dedupe by routeKey
    seen = set()
    missing_unique = []
    for b in missing_from_docstar:
        if b["routeKey"] in seen:
            continue
        seen.add(b["routeKey"])
        missing_unique.append(b)

    status_counts = Counter(a.status for a in audits)
    service_counts = Counter(a.service or "unmatched" for a in audits)

    report = {
        "generatedAt": "2026-10-29",
        "scope": {
            "docstarOrg": "83427",
            "docstarCollection": "-Jey39dCAAyx",
            "repositories": {k: str(v) for k, v in REPO_ROOTS.items()},
        },
        "totals": {
            "docstarEndpoints": len(audits),
            "catalogRecordsAll": len(catalog.get("records") or []),
            "catalogRecordsInFourRepos": sum(
                1 for r in catalog.get("records") or [] if r.get("service") in SCOPE_SERVICES
            ),
            "backendUniqueRoutesInScope": len({b["routeKey"] for b in backend_routes}),
            "verified": status_counts.get("Verified — matches implementation", 0),
            "needsCorrection": status_counts.get("Needs correction", 0),
            "unverified": status_counts.get("Unverified", 0),
            "unmatchedRoute": status_counts.get("Missing from catalog / unmatched route", 0),
            "requiresInvestigation": status_counts.get("Requires investigation", 0),
            "missingFromDocstarUniqueRoutes": len(missing_unique),
            "docstarQueryParamIssues": sum(1 for a in audits if a.docstarQueryIssues),
            "emptyBodyDescription": sum(1 for a in audits if a.bodyDescriptionEmpty),
        },
        "statusCounts": dict(status_counts),
        "serviceCounts": dict(service_counts),
        "endpoints": [asdict(a) for a in audits],
        "missingFromDocstarSample": missing_unique[:200],
        "missingFromDocstarTotal": len(missing_unique),
    }

    out_json = DOCSTAR / "docstar-implementation-audit.json"
    out_json.write_text(json.dumps(report, ensure_ascii=False, indent=2))

    # Markdown summary
    lines = [
        "# DocStar ↔ Implementation Audit Report",
        "",
        f"Generated: {report['generatedAt']}",
        "",
        "## Scope",
        "",
        "- DocStar org `83427`, collection `-Jey39dCAAyx` (Giddh API Draft_1)",
        "- Repositories: giddh-api-v2, accounting-microservice, import-microservice, search-api",
        "- Source of truth: Spring controllers in those repos + catalog route inventory",
        "",
        "## Totals",
        "",
        f"| Metric | Count |",
        f"| --- | ---: |",
        f"| DocStar endpoints (live) | {report['totals']['docstarEndpoints']} |",
        f"| Catalog records (all) | {report['totals']['catalogRecordsAll']} |",
        f"| Catalog records in 4 repos | {report['totals']['catalogRecordsInFourRepos']} |",
        f"| Unique in-scope backend routes | {report['totals']['backendUniqueRoutesInScope']} |",
        f"| Verified — matches implementation | {report['totals']['verified']} |",
        f"| Needs correction | {report['totals']['needsCorrection']} |",
        f"| Unverified | {report['totals']['unverified']} |",
        f"| Unmatched DocStar route | {report['totals']['unmatchedRoute']} |",
        f"| Requires investigation | {report['totals']['requiresInvestigation']} |",
        f"| Backend routes missing from DocStar | {report['totals']['missingFromDocstarUniqueRoutes']} |",
        f"| DocStar endpoints with query-param doc issues | {report['totals']['docstarQueryParamIssues']} |",
        f"| DocStar endpoints with empty bodyDescription (JSON body) | {report['totals']['emptyBodyDescription']} |",
        "",
        "## Status breakdown",
        "",
    ]
    for k, v in sorted(status_counts.items(), key=lambda x: (-x[1], x[0])):
        lines.append(f"- **{k}**: {v}")
    lines += [
        "",
        "## Limitations",
        "",
        "- `@RequestParam` parsing covers explicit annotations on the controller method; query fields bound only via `@ModelAttribute` / DTO binders are verified via catalog request models, not re-inferred from bytecode.",
        "- Response schemas and every error code are not exhaustively runtime-tested in this pass.",
        "- `missingFromDocstar` includes admin/internal/frontend-unused routes present in the four repos; DocStar scope historically publishes a curated public subset (~787), not all ~1392 expanded routes.",
        "- Generic DocStar REST `Authorization` header failed earlier; inventory refresh used `proxy_auth_token` via MCP `call_any_read_api_of_docstar`.",
        "",
        "## Next correction queue (Needs correction — first 80)",
        "",
    ]
    needs = [a for a in audits if a.status == "Needs correction"]
    for a in needs[:80]:
        lines.append(f"- `{a.endpointId}` {a.method} {a.url} — {a.name}")
        for issue in a.issues[:6]:
            lines.append(f"  - {issue}")
    if len(needs) > 80:
        lines.append(f"- … and {len(needs) - 80} more (see JSON)")
    lines += [
        "",
        "## Machine-readable detail",
        "",
        f"See `{out_json.name}` for per-endpoint evidence (controller, handler, Java query params, issues).",
        "",
    ]
    out_md = DOCSTAR / "DOCSTAR-IMPLEMENTATION-AUDIT-REPORT.md"
    out_md.write_text("\n".join(lines) + "\n")
    print(
        json.dumps(
            {
                "reportMd": str(out_md),
                "reportJson": str(out_json),
                "totals": report["totals"],
                "statusCounts": dict(status_counts),
            },
            indent=2,
        )
    )


if __name__ == "__main__":
    main()
