#!/usr/bin/env python3
"""Publish real request/response examples to DocStar (Giddh API Draft_1, org 83427).

Input: docstar-real-responses.json, one object per public endpoint page:
  {page, method, path, requestExample|null, requestFieldNotes[], responses[{status,title,description,data,source}], notes}
built from live calls to the Giddh test server (apitest), earlier captures, or backend code for
endpoints that must not be called (payments, government filing, messaging).

For each page it replaces sampleResponse with the given responses and, when requestExample is set,
the JSON body example and its field notes (existing notes are kept for unchanged fields).

    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _apply_real_responses.py --pages <flat.json> [--index <index.json>]
    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _apply_real_responses.py --pages ... --publish
    (--results <file> applies a subset, e.g. a follow-up fix)
Report: docstar-real-responses-apply.json
"""
import json
import sys
import time
from pathlib import Path

from _apply_missing_request_bodies import (COLLECTION, JSON_CT, ORG, ROOT_PARENT, call, describe, node, route,
                                           token, unwrap)

ROOT = Path(__file__).resolve().parent
RESULTS = ROOT / "docstar-real-responses.json"
REPORT = ROOT / "docstar-real-responses-apply.json"


def old_notes(bd):
    """{dotted.path: description} from the current bodyDescription.payload."""
    out = {}

    def walk(prefix, n):
        if not isinstance(n, dict):
            return
        if n.get("description") and prefix:
            out[prefix] = n["description"]
        v = n.get("value")
        if isinstance(v, dict):
            for k, c in v.items():
                walk(f"{prefix}.{k}" if prefix else k, c)
        elif isinstance(v, list) and v and isinstance(v[0], dict) and "value" in v[0]:
            walk(prefix, {"value": v[0].get("value")})

    walk("", (bd or {}).get("payload") or {})
    return out


def patch_for(r, cur):
    patch = {"sampleResponse": [{"title": x.get("title") or ("Success" if str(x["status"]).startswith("2") else "Error"),
                                 "status": int(x["status"]), "description": x.get("description") or "",
                                 "data": x.get("data")} for x in r["responses"]]}
    ex = r.get("requestExample")
    if ex is not None and isinstance(ex, (dict, list)):
        docs = old_notes(cur.get("bodyDescription"))
        docs.update(describe(r.get("requestFieldNotes")))
        patch["body"] = {"type": "JSON", "raw": {"rawType": "JSON", "value": json.dumps(ex, indent=2, ensure_ascii=False)}}
        patch["bodyDescription"] = {"payload": node(ex, "", docs)}
        headers = dict(cur.get("headers") or {})
        headers.setdefault("Content-Type", JSON_CT)
        patch["headers"] = headers
    return patch


def main():
    args = sys.argv[1:]
    publish = "--publish" in args
    pages = json.loads(Path(args[args.index("--pages") + 1]).read_text(encoding="utf-8"))
    pages = pages if isinstance(pages, list) else next(v for v in pages.values() if isinstance(v, list))
    by_route = json.loads(Path(args[args.index("--index") + 1]).read_text(encoding="utf-8")).get("byRoute", {}) if "--index" in args else {}
    by_url = {}
    for p in pages:
        by_url.setdefault(p.get("urlName"), []).append(p["id"])
    tok = token()
    report, written, seen = [], [], set()
    results = Path(args[args.index("--results") + 1]) if "--results" in args else RESULTS
    for r in json.loads(results.read_text(encoding="utf-8")):
        if not r.get("responses"):
            continue
        want = route(r["method"], r["path"])
        entry = {"page": r["page"], "route": want, "ids": []}
        report.append(entry)
        cands = set(by_url.get(r["page"].split("/", 1)[1], [])) | set(by_route.get(want, []))
        for eid in sorted(cands - seen):
            st, cur = call("GET", f"/orgs/{ORG}/endpoints/{eid}", tok)
            cur = unwrap(cur)
            if st != 200 or not isinstance(cur, dict) or route(cur.get("requestType", ""), cur.get("URL")) != want:
                continue
            seen.add(eid)
            entry["ids"].append(eid)
            if publish:
                st, res = call("PUT", f"/orgs/{ORG}/endpoints/{eid}", tok, patch_for(r, cur))
                if st in (200, 201):
                    written.append(eid)
                else:
                    entry.setdefault("errors", []).append(f"{eid}: {st} {str(res)[:200]}")
            time.sleep(0.05)
        if not entry["ids"]:
            entry["coveredByEarlierRow" if cands and cands <= seen else "notFound"] = True
    if publish and written:
        for k in range(0, len(written), 100):
            st, res = call("PATCH", f"/orgs/{ORG}/collections/{COLLECTION}/bulkPublish", tok,
                           {"rootParentId": ROOT_PARENT, "pageIds": [ROOT_PARENT] + written[k:k + 100]})
            print("publish", st, "" if st in (200, 201) else str(res)[:200])
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({"pages": len(report), "matched": sum(len(e["ids"]) for e in report), "written": len(written),
                      "notFound": [e["page"] for e in report if e.get("notFound")],
                      "errors": [x for e in report for x in e.get("errors", [])],
                      "mode": "publish" if publish else "dry-run"}, indent=1))


if __name__ == "__main__":
    main()
