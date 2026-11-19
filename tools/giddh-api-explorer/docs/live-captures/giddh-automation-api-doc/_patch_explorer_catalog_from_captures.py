#!/usr/bin/env python3
"""Wire live-capture success/failure JSON into Explorer + coverage catalogs."""

from __future__ import annotations

import json
import re
from collections import defaultdict
from copy import deepcopy
from datetime import date
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[4]  # .../Giddh-New-Angular4-App
CAPTURE_DIR = Path(__file__).resolve().parent
RESP_DIR = CAPTURE_DIR / "responses"
REQ_DIR = CAPTURE_DIR / "requests"
CATALOGS = [
    ROOT / "tools/giddh-api-explorer/public/data/catalog.json",
    ROOT / "docs/api/coverage/catalog.json",
]
REPORT_PATH = CAPTURE_DIR / "EXPLORER-CATALOG-PATCH-REPORT.md"
COMPANY_UN = "giddhain1792673422178091xos"
CAPTURED_AT = date.today().isoformat()
MAX_LIVE_ERRORS = 5
SOURCE_REL = "docs/api/live-captures/giddh-automation-api-doc/responses"


def load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def dump_json(path: Path, data: Any) -> None:
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def strip_path(path: str) -> str:
    path = (path or "").strip()
    if not path:
        return ""
    path = path.split("?", 1)[0]
    return path.strip("/")


def path_matches(concrete: str, normalized: str) -> bool:
    c_parts = strip_path(concrete).split("/") if strip_path(concrete) else []
    n_parts = strip_path(normalized).split("/") if strip_path(normalized) else []
    if len(c_parts) != len(n_parts) or not c_parts:
        return False
    for c, n in zip(c_parts, n_parts):
        if n in ("{}", "*"):
            continue
        if c != n:
            return False
    return True


def parse_http(value: Any) -> int | None:
    if value is None or value == "":
        return None
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return None


def response_kind(data: Any, http: int | None, log_status: Any) -> str:
    """Return 'success', 'error', or 'unknown'."""
    if isinstance(data, dict):
        st = data.get("status")
        if st == "success":
            return "success"
        if st == "error":
            return "error"
        # Cloudflare / plain HTML wrappers etc.
        if "errors" in data and http is not None and http >= 400:
            return "error"

    if isinstance(log_status, str):
        if log_status == "success":
            if http is None or 200 <= http < 300:
                return "success"
        if log_status == "error":
            return "error"
        if log_status.isdigit():
            code = int(log_status)
            if code >= 400:
                return "error"

    if http is not None:
        if 200 <= http < 300:
            return "success"
        if http >= 400:
            return "error"
    return "unknown"


def richness(data: Any) -> int:
    if data is None:
        return 0
    try:
        return len(json.dumps(data, ensure_ascii=False))
    except TypeError:
        return 0


def is_weak_success_example(example: Any) -> bool:
    if example is None:
        return True
    if not isinstance(example, dict):
        return richness(example) < 40
    if example.get("reference") == "response":
        return True
    body = example.get("body")
    if example.get("status") == "success" and isinstance(body, dict):
        # Placeholder like {"status":"string"} or empty-ish
        if set(body.keys()) <= {"status"} and body.get("status") in (None, "string", ""):
            return True
        if not body:
            return True
    if richness(example) < 80:
        return True
    return False


def error_dedupe_key(item: dict[str, Any]) -> tuple[str, str]:
    return (str(item.get("code") or ""), str(item.get("message") or "").strip())


def build_error_example(tag: str, data: Any, http: int | None) -> dict[str, Any]:
    code = None
    message = None
    if isinstance(data, dict):
        code = data.get("code")
        message = data.get("message")
        if message is None and isinstance(data.get("error"), dict):
            message = data["error"].get("message")
            code = code or data["error"].get("code")
    http_status = http or 400
    return {
        "httpStatus": http_status,
        "code": code or "ERROR",
        "message": (message or "").strip() or f"Live capture failure ({tag})",
        "when": f"Live capture {tag}",
        "example": data if data is not None else {"status": "error", "code": code or "ERROR"},
    }


def load_call_log_entries() -> dict[str, dict[str, Any]]:
    """tag -> {method, path, http, status, message, tag} (last write wins)."""
    by_tag: dict[str, dict[str, Any]] = {}
    for path in sorted(CAPTURE_DIR.glob("CALL-LOG*.json")):
        raw = load_json(path)
        if not isinstance(raw, list):
            continue
        for entry in raw:
            tag = entry.get("tag")
            if not tag:
                continue
            by_tag[tag] = {
                "tag": tag,
                "method": str(entry.get("method") or "GET").upper(),
                "path": entry.get("path") or "",
                "http": parse_http(entry.get("http")),
                "status": entry.get("status"),
                "message": entry.get("message") or "",
                "logFile": path.name,
            }
    # Recover orphans via request meta {method, path}
    for resp_path in RESP_DIR.glob("*.json"):
        tag = resp_path.stem
        if tag in by_tag:
            continue
        req_path = REQ_DIR / f"{tag}.json"
        if not req_path.exists():
            continue
        req = load_json(req_path)
        if isinstance(req, dict) and req.get("method") and req.get("path"):
            by_tag[tag] = {
                "tag": tag,
                "method": str(req["method"]).upper(),
                "path": req["path"],
                "http": None,
                "status": None,
                "message": "",
                "logFile": "request-meta",
            }
    return by_tag


def index_catalog_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return records


def find_matching_records(
    records: list[dict[str, Any]], method: str, concrete_path: str
) -> list[dict[str, Any]]:
    matches = []
    method_u = method.upper()
    for record in records:
        rec_method = str(record.get("method") or "").upper()
        if rec_method not in (method_u, "ANY"):
            continue
        normalized = record.get("normalizedPath") or ""
        path = record.get("path") or ""
        # Prefer normalizedPath; also try raw path with {param} style
        candidates = [normalized]
        if path:
            # Convert {foo} -> {} for matching
            candidates.append(re.sub(r"\{[^}]+\}", "{}", strip_path(path)))
        if any(path_matches(concrete_path, cand) for cand in candidates if cand):
            matches.append(record)
    return matches


def prefer_fe_sort_key(record: dict[str, Any]) -> tuple[int, str]:
    classification = record.get("classification") or ""
    has_fe = 0 if record.get("frontendUsage") or classification == "frontend-used" else 1
    return (has_fe, record.get("id") or "")


def patch_record(
    record: dict[str, Any],
    success_pick: dict[str, Any] | None,
    error_picks: list[dict[str, Any]],
) -> dict[str, bool]:
    """Mutate record. Returns flags success_patched / errors_patched."""
    flags = {"success": False, "errors": False}
    response = record.setdefault("response", {})
    if not isinstance(response, dict):
        record["response"] = {}
        response = record["response"]

    source_tag = None
    if success_pick:
        source_tag = success_pick["tag"]
        existing = response.get("successExample")
        new_example = success_pick["data"]
        should_set = (
            existing is None
            or is_weak_success_example(existing)
            or richness(new_example) >= richness(existing)
        )
        if should_set:
            response["successExample"] = deepcopy(new_example)
            http = success_pick.get("http")
            if http is not None and 200 <= http < 300:
                response["httpStatus"] = http
                # Keep Spring-ish status names when already present; else set OK/CREATED
                if http == 201:
                    response["status"] = response.get("status") or "CREATED"
                elif not response.get("status"):
                    response["status"] = "OK"
            flags["success"] = True

    if error_picks:
        source_tag = source_tag or error_picks[0]["tag"]
        existing = list(response.get("errorExamples") or [])
        existing_keys = {error_dedupe_key(e) for e in existing if isinstance(e, dict)}
        prepend: list[dict[str, Any]] = []
        for pick in error_picks:
            item = pick["errorExample"]
            key = error_dedupe_key(item)
            if key in existing_keys:
                continue
            prepend.append(item)
            existing_keys.add(key)
        if prepend:
            response["errorExamples"] = prepend + existing
            flags["errors"] = True

    if flags["success"] or flags["errors"]:
        source_file = f"{SOURCE_REL}/{source_tag}.json" if source_tag else SOURCE_REL
        live = {
            "sourceFile": source_file,
            "capturedAt": CAPTURED_AT,
            "companyUniqueName": COMPANY_UN,
        }
        # Prefer response.liveCapture (Explorer-adjacent); keep record-level in sync
        response["liveCapture"] = live
        record["liveCapture"] = live
    return flags


def main() -> None:
    entries = load_call_log_entries()
    # tag -> loaded capture classified
    captures: list[dict[str, Any]] = []
    missing_response = []
    for tag, meta in entries.items():
        resp_path = RESP_DIR / f"{tag}.json"
        if not resp_path.exists():
            missing_response.append(tag)
            continue
        try:
            data = load_json(resp_path)
        except json.JSONDecodeError:
            continue
        kind = response_kind(data, meta["http"], meta["status"])
        if kind == "unknown":
            # Infer from body size + http fallback
            if meta["http"] is not None and 200 <= meta["http"] < 300:
                kind = "success"
            elif isinstance(data, dict) and data:
                kind = "error" if meta["http"] and meta["http"] >= 400 else "success"
            else:
                continue
        captures.append({**meta, "data": data, "kind": kind, "respPath": resp_path})

    # Response files with no call-log / request meta: still try filename heuristic skip
    logged_tags = set(entries)
    orphan_responses = sorted(p.stem for p in RESP_DIR.glob("*.json") if p.stem not in logged_tags)

    # Build per-record aggregation across captures
    # Use first catalog as structure reference; patch each catalog independently but same mapping
    primary = load_json(CATALOGS[0])
    records = primary["records"]

    # Map record id -> aggregated success/error candidates
    by_record: dict[str, dict[str, Any]] = defaultdict(
        lambda: {"successes": [], "errors": [], "record": None}
    )
    unmatched_captures: list[dict[str, Any]] = []
    matched_capture_tags: set[str] = set()

    for cap in captures:
        matches = find_matching_records(records, cap["method"], cap["path"])
        if not matches:
            unmatched_captures.append(cap)
            continue
        matched_capture_tags.add(cap["tag"])
        for record in matches:
            rid = record["id"]
            bucket = by_record[rid]
            bucket["record"] = record
            if cap["kind"] == "success":
                bucket["successes"].append(cap)
            else:
                bucket["errors"].append(cap)

    # Choose best success / up to N errors per record
    plan: dict[str, dict[str, Any]] = {}
    for rid, bucket in by_record.items():
        successes = bucket["successes"]
        errors = bucket["errors"]
        success_pick = None
        if successes:
            # Prefer status:success envelopes with richest body
            def success_score(c: dict[str, Any]) -> tuple[int, int, int]:
                data = c["data"]
                body_score = 0
                status_bonus = 0
                if isinstance(data, dict):
                    if data.get("status") == "success":
                        status_bonus = 1_000_000
                    body = data.get("body")
                    body_score = richness(body) if body is not None else richness(data)
                return (status_bonus, body_score, richness(data))

            success_pick = max(successes, key=success_score)

        error_picks: list[dict[str, Any]] = []
        seen_keys: set[tuple[str, str]] = set()
        # Prefer distinct messages; richer examples first
        for err in sorted(errors, key=lambda c: richness(c["data"]), reverse=True):
            item = build_error_example(err["tag"], err["data"], err["http"])
            key = error_dedupe_key(item)
            if key in seen_keys:
                continue
            seen_keys.add(key)
            error_picks.append({"tag": err["tag"], "errorExample": item, "http": err["http"]})
            if len(error_picks) >= MAX_LIVE_ERRORS:
                break

        if success_pick or error_picks:
            plan[rid] = {
                "success_pick": success_pick,
                "error_picks": error_picks,
                "fe": prefer_fe_sort_key(bucket["record"])[0] == 0,
            }

    # Apply to each catalog
    summary = {
        "records_with_success": 0,
        "records_with_errors": 0,
        "records_patched_any": 0,
        "fe_patched": 0,
        "non_fe_patched": 0,
        "captures_total": len(captures),
        "captures_matched": len(matched_capture_tags),
        "captures_unmatched": len(unmatched_captures),
        "orphan_responses": len(orphan_responses),
        "missing_response_for_log": len(missing_response),
        "plan_size": len(plan),
    }

    # Sort plan ids: FE first for reporting
    planned_ids = sorted(plan.keys(), key=lambda rid: (0 if plan[rid]["fe"] else 1, rid))

    for catalog_path in CATALOGS:
        catalog = load_json(catalog_path)
        id_map = {r["id"]: r for r in catalog["records"]}
        patched_success = 0
        patched_errors = 0
        patched_any = 0
        fe_patched = 0
        non_fe_patched = 0
        for rid in planned_ids:
            record = id_map.get(rid)
            if not record:
                continue
            flags = patch_record(
                record, plan[rid]["success_pick"], plan[rid]["error_picks"]
            )
            if flags["success"] or flags["errors"]:
                patched_any += 1
                if plan[rid]["fe"]:
                    fe_patched += 1
                else:
                    non_fe_patched += 1
            if flags["success"]:
                patched_success += 1
            if flags["errors"]:
                patched_errors += 1
        dump_json(catalog_path, catalog)
        # Use explorer counts as canonical summary (same plan)
        if catalog_path == CATALOGS[0]:
            summary.update(
                {
                    "records_with_success": patched_success,
                    "records_with_errors": patched_errors,
                    "records_patched_any": patched_any,
                    "fe_patched": fe_patched,
                    "non_fe_patched": non_fe_patched,
                }
            )

    # Spot-check vouchers/generate
    verify = load_json(CATALOGS[0])
    gen = next(
        r
        for r in verify["records"]
        if r.get("normalizedPath") == "v4/company/{}/accounts/{}/vouchers/generate"
        and r["service"] == "accounting-microservice"
        and r["method"] == "POST"
    )
    se = gen["response"].get("successExample") or {}
    body = se.get("body") if isinstance(se, dict) else None
    gen_ok = (
        isinstance(se, dict)
        and se.get("status") == "success"
        and isinstance(body, dict)
        and body.get("type") in ("sales", "purchase", "receipt", "payment")
        and body.get("reference") != "response"
    )

    # Sample unmatched (truncate)
    unmatched_sample = [
        {"tag": c["tag"], "method": c["method"], "path": c["path"], "kind": c["kind"]}
        for c in sorted(unmatched_captures, key=lambda x: x["tag"])[:40]
    ]

    # Top patched FE endpoints for report
    fe_samples = []
    id_map_primary = {r["id"]: r for r in verify["records"]}
    for rid in planned_ids:
        if not plan[rid]["fe"]:
            continue
        rec = id_map_primary.get(rid)
        if not rec:
            continue
        fe_samples.append(
            {
                "method": rec["method"],
                "path": rec.get("normalizedPath"),
                "service": rec.get("service"),
                "success": bool(plan[rid]["success_pick"]),
                "errors": len(plan[rid]["error_picks"]),
                "tag": (plan[rid]["success_pick"] or plan[rid]["error_picks"][0])["tag"]
                if plan[rid]["success_pick"] or plan[rid]["error_picks"]
                else None,
            }
        )
        if len(fe_samples) >= 25:
            break

    report = f"""# Explorer catalog patch report

Generated: **{CAPTURED_AT}**  
Company: `{COMPANY_UN}`  
Script: `_patch_explorer_catalog_from_captures.py`

## Targets updated

1. `tools/giddh-api-explorer/public/data/catalog.json`
2. `docs/api/coverage/catalog.json`

## Counts

| Metric | Count |
| --- | ---: |
| Live captures loaded (tag + response file) | {summary["captures_total"]} |
| Captures matched to ≥1 catalog record | {summary["captures_matched"]} |
| Captures unmatched to catalog | {summary["captures_unmatched"]} |
| Response files with no call-log/request meta (orphans) | {summary["orphan_responses"]} |
| Call-log tags missing response file | {summary["missing_response_for_log"]} |
| Catalog records in patch plan | {summary["plan_size"]} |
| Records patched (any) | {summary["records_patched_any"]} |
| Records patched with **success** example | {summary["records_with_success"]} |
| Records patched with **error** example(s) | {summary["records_with_errors"]} |
| Frontend-used records patched | {summary["fe_patched"]} |
| Other records patched | {summary["non_fe_patched"]} |

## Spot-check

- `POST v4/company/{{}}/accounts/{{}}/vouchers/generate` (accounting-microservice): **{'PASS' if gen_ok else 'FAIL'}** — success body type=`{(body or {}).get('type') if isinstance(body, dict) else None}`, has real voucher fields (not `reference: response`).

## How to refresh local Explorer

1. Serve Explorer from `tools/giddh-api-explorer` (static `public/`).
2. Hard-refresh the browser (`Cmd+Shift+R`) so `/data/catalog.json` reloads (`cache: "no-store"` is already set).
3. No separate rebuild/copy step — Explorer reads `public/data/catalog.json` directly.

## Sample frontend-used patches (first 25)

| Method | Path | Service | Success | Errors | Tag |
| --- | --- | --- | ---: | ---: | --- |
"""
    for s in fe_samples:
        report += (
            f"| {s['method']} | `{s['path']}` | {s['service']} | "
            f"{'Y' if s['success'] else '-'} | {s['errors']} | `{s['tag']}` |\n"
        )

    report += "\n## Unmatched capture sample (first 40)\n\n"
    if not unmatched_sample:
        report += "_None_\n"
    else:
        report += "| Tag | Method | Path | Kind |\n| --- | --- | --- | --- |\n"
        for u in unmatched_sample:
            report += f"| `{u['tag']}` | {u['method']} | `{u['path']}` | {u['kind']} |\n"
        if summary["captures_unmatched"] > len(unmatched_sample):
            report += f"\n… and {summary['captures_unmatched'] - len(unmatched_sample)} more.\n"

    report += f"""
## Notes

- Success examples set to full live JSON envelopes when `status: success` / HTTP 2xx.
- Live errors prepended to `response.errorExamples`, deduped by `code` + `message` (existing exception-derived examples kept).
- Up to {MAX_LIVE_ERRORS} distinct live errors per record.
- `liveCapture` written on both `record` and `record.response`.
- Request-body patching skipped (Explorer uses `requestBody.example` only; no `liveRequestExample` UI).
- Orphan response files without method/path metadata were not matched ({summary["orphan_responses"]}).
"""
    REPORT_PATH.write_text(report, encoding="utf-8")

    # Console summary (no secrets)
    print(json.dumps(summary, indent=2))
    print("vouchers/generate spot-check:", "PASS" if gen_ok else "FAIL")
    print("report:", REPORT_PATH)


if __name__ == "__main__":
    main()
