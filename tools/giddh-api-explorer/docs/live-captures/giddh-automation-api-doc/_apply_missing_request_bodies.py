#!/usr/bin/env python3
"""Add the missing request bodies to DocStar write endpoints (Giddh API Draft_1, org 83427).

Input: docstar-missing-body-results.json (96 POST/PUT/PATCH pages that had no body, each
checked against the backend handler, live captures and frontend calls). Pages with verdict
json / multipart / text get a body, field notes and a Content-Type header where it applies.
Verdict "none" pages are left alone. Each target page's live route is re-checked before writing.

    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _apply_missing_request_bodies.py --pages <flat.json> [--index <index.json>]
    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _apply_missing_request_bodies.py --pages ... --publish

--pages: collection page list ({id, urlName}); --index: optional {"byRoute": {"POST /company/{}/tags": [ids]}}.
Report: docstar-missing-body-apply.json
"""
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
API = "https://api.docstar.io"
ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"
RESULTS = ROOT / "docstar-missing-body-results.json"
REPORT = ROOT / "docstar-missing-body-apply.json"
SKIP = {"voucher/patch-voucher-v4": "Documented URL has /{voucherUniqueName}; backend route is PATCH /v4/company/{c}/vouchers. Needs a URL decision."}
JSON_CT = {"value": "application/json", "checked": "true", "required": True, "optional": False,
           "description": "Send application/json. Without it the API returns UNSUPPORTED_MEDIA_TYPE."}
TEXT_CT = {"value": "text/plain", "checked": "true", "required": True, "optional": False,
           "description": "Send text/plain. The body is read as a plain string."}


def token():
    f = os.environ.get("DOCSTAR_HM_TOKEN_FILE")
    t = Path(f).read_text().strip() if f and Path(f).exists() else os.environ.get("DOCSTAR_HM_TOKEN", "").strip()
    if not t:
        sys.exit("Set DOCSTAR_HM_TOKEN_FILE or DOCSTAR_HM_TOKEN")
    return t


def call(method, path, tok, body=None):
    req = urllib.request.Request(
        API + path, method=method, data=json.dumps(body).encode() if body is not None else None,
        headers={"Authorization": f"Bearer {tok}", "Accept": "application/json", "Content-Type": "application/json",
                 "User-Agent": "Mozilla/5.0 GiddhDocFixRunner"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            txt = r.read().decode()
            return r.status, (json.loads(txt) if txt else {})
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode()[:400]


def unwrap(d):
    return d.get("data", d) if isinstance(d, dict) else d


def route(method, url):
    p = re.sub(r"^https?://[^/]+", "", url or "").split("?")[0]
    p = re.sub(r":\.\+", "", p)
    p = re.sub(r"\{[^}]*\}|:[A-Za-z_]\w*", "{}", p)
    return f"{method.upper()} /{p.strip('/')}"


def jtype(v):
    return ("boolean" if isinstance(v, bool) else "number" if isinstance(v, (int, float)) else
            "array" if isinstance(v, list) else "object" if isinstance(v, dict) else "string")


def describe(fields):
    out = {}
    for f in fields or []:
        key = re.sub(r"\[\]", "", f["path"])
        mark = "Required." if f.get("required") else "Optional."
        text = (f.get("description") or "").strip()
        text = re.sub(r"\s*(Required|Optional)\.\s*$", "", text).rstrip(".")
        out[key] = (text + ". " if text else "") + mark
    return out


def node(value, path, docs):
    n = {"type": jtype(value), "value": value}
    if isinstance(value, dict):
        n["value"] = {k: node(v, f"{path}.{k}" if path else k, docs) for k, v in value.items()}
        for k, d in docs.items():  # documented fields missing from the example, at this level
            parent, _, leaf = k.rpartition(".")
            if parent == path and leaf not in n["value"]:
                n["value"][leaf] = {"type": "string", "value": "", "description": d}
    elif isinstance(value, list) and value and isinstance(value[0], dict):
        n["value"] = [node(value[0], path, docs)]
    if path in docs:
        n["description"] = docs[path]
    return n


def build(r, cur):
    headers = dict(cur.get("headers") or {})
    v = r["verdict"]
    if v == "json":
        ex = r["example"]
        body = {"type": "JSON", "raw": {"rawType": "JSON", "value": json.dumps(ex, indent=2, ensure_ascii=False)}}
        docs = describe(r.get("fields"))
        bd = {"payload": node(ex, "", docs)} if isinstance(ex, (dict, list)) else {}
        headers["Content-Type"] = JSON_CT
    elif v == "multipart":
        rows = [{"checked": "true", "key": p["name"], "value": "", "type": "file" if p.get("kind") == "file" else "text",
                 "description": ((p.get("description") or "").rstrip(".") + ". " + ("Required." if p.get("required") else "Optional.")).strip()}
                for p in r.get("multipartParts") or []]
        body = {"type": "multipart/form-data", "multipart/form-data": rows}
        bd = {}
        headers.pop("Content-Type", None)  # curl --form sets multipart/form-data with its boundary
    else:  # text
        ex = r["example"] if isinstance(r["example"], str) else json.dumps(r["example"])
        body = {"type": "TEXT", "raw": {"rawType": "TEXT", "value": ex}}
        bd = {}
        headers["Content-Type"] = TEXT_CT
    patch = {"body": body, "headers": headers}
    if bd:
        patch["bodyDescription"] = bd
    return patch


def main():
    args = sys.argv[1:]
    publish = "--publish" in args
    pages = json.loads(Path(args[args.index("--pages") + 1]).read_text(encoding="utf-8"))
    pages = pages if isinstance(pages, list) else next(v for v in pages.values() if isinstance(v, list))
    by_route = {}
    if "--index" in args:
        by_route = json.loads(Path(args[args.index("--index") + 1]).read_text(encoding="utf-8")).get("byRoute", {})
    by_url = {}
    for p in pages:
        by_url.setdefault(p.get("urlName"), []).append(p["id"])
    tok = token()
    report, written, seen = [], [], set()
    for r in json.loads(RESULTS.read_text(encoding="utf-8")):
        if r["verdict"] not in ("json", "multipart", "text"):
            continue
        entry = {"page": r["page"], "method": r["method"], "path": r["path"], "verdict": r["verdict"], "ids": []}
        report.append(entry)
        if r["page"] in SKIP:
            entry["skipped"] = SKIP[r["page"]]
            continue
        want = route(r["method"], r["path"])
        cands = set(by_url.get(r["page"].split("/", 1)[1], [])) | set(by_route.get(want, []))
        for eid in sorted(cands - seen):
            st, cur = call("GET", f"/orgs/{ORG}/endpoints/{eid}", tok)
            cur = unwrap(cur)
            if st != 200 or not isinstance(cur, dict) or route(cur.get("requestType", ""), cur.get("URL")) != want:
                continue
            body = cur.get("body") or {}
            if body.get("type") not in (None, "none"):
                entry.setdefault("alreadyHasBody", []).append(eid)
                continue
            entry["ids"].append(eid)
            seen.add(eid)
            if publish:
                st, res = call("PUT", f"/orgs/{ORG}/endpoints/{eid}", tok, build(r, cur))
                if st in (200, 201):
                    written.append(eid)
                else:
                    entry.setdefault("errors", []).append(f"{eid}: {st} {str(res)[:200]}")
            time.sleep(0.05)
        if not entry["ids"] and cands and cands <= seen:
            entry["coveredByEarlierRow"] = sorted(cands)
        elif not entry["ids"] and not entry.get("alreadyHasBody"):
            entry["notFound"] = want
    if publish and written:
        for k in range(0, len(written), 100):
            st, res = call("PATCH", f"/orgs/{ORG}/collections/{COLLECTION}/bulkPublish", tok,
                           {"rootParentId": ROOT_PARENT, "pageIds": [ROOT_PARENT] + written[k:k + 100]})
            print("publish", st, str(res)[:200] if st not in (200, 201) else "")
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({"targets": len(report), "pagesMatched": sum(len(e["ids"]) for e in report),
                      "written": len(written), "notFound": [e["page"] for e in report if e.get("notFound")],
                      "skipped": [e["page"] for e in report if e.get("skipped")],
                      "errors": [x for e in report for x in e.get("errors", [])],
                      "mode": "publish" if publish else "dry-run"}, indent=1))


if __name__ == "__main__":
    main()
