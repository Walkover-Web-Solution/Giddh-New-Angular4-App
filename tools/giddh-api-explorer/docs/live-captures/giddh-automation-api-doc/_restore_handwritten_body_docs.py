#!/usr/bin/env python3
"""Restore hand-written request-body field notes that the 2026-11-20 bulk fix replaced.

Before that fix, field notes lived at bodyDescription.<field> (top level), which the reader
never displayed. Some were hand-edited in DocStar after the generated upload of 2026-10-28
(docstar-param-doc-patches.json). This script finds those edits in each endpoint's published
history and merges them into the current bodyDescription.payload shape.

A field note counts as hand-written when the old published text differs from the generated
2026-10-28 text for that field. The merged note keeps the hand-written text, then the
current Required/Optional marker.

    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _restore_handwritten_body_docs.py            # report only
    DOCSTAR_HM_TOKEN_FILE=... python -X utf8 _restore_handwritten_body_docs.py --publish  # write + publish
Report: docstar-handwritten-body-restore.json
"""
import json
import re
import sys
import time
from pathlib import Path

from _apply_docstar_fix_payloads import COLLECTION, ORG, ROOT_PARENT, call, token, unwrap

ROOT = Path(__file__).resolve().parent
PROGRESS = ROOT / ".docstar-fix-apply-progress.json"
GENERATED = ROOT / "docstar-param-doc-patches.json"
REPORT = ROOT / "docstar-handwritten-body-restore.json"
CUTOFF = "2026-11-19T17:00:00"  # bulk fix started after this (UTC)
MARK = re.compile(r"\s*(Required|Optional)\.\s*$")


def norm(s):
    return re.sub(r"\s+", " ", MARK.sub("", s or "")).strip()


def old_fields(bd):
    """Flatten an old top-level bodyDescription into {dotted.path: description}."""
    out = {}

    def walk(prefix, node):
        if not isinstance(node, dict):
            return
        for k, v in node.items():
            if not isinstance(v, dict):
                continue
            path = f"{prefix}{k}"
            if v.get("description"):
                out[path] = v["description"]
            val = v.get("value")
            if isinstance(val, dict):
                walk(path + ".", val)
            elif isinstance(val, list) and val and isinstance(val[0], dict):
                walk(path + ".", val[0].get("value") if "value" in val[0] else val[0])

    if isinstance(bd, dict) and "payload" not in bd:
        walk("", bd)
    return out


def published_versions(eid, tok):
    st, res = call("GET", f"/published-version/{eid}", tok)
    if st != 200:
        return st, []
    res = unwrap(res)
    items = res if isinstance(res, list) else res.get("versions") or res.get("publishedVersions") or []
    return st, items


def pick_old(items):
    """Newest published snapshot from before the bulk fix that still has the old top-level shape.

    GET /published-version/{id} returns {"publishedVersions": [{versionNo, createdAt,
    publishedData: {..., bodyDescription}}], "totalCount": n} (verified 2026-11-20).
    """
    def stamp(v):
        return str(v.get("createdAt") or v.get("updatedAt") or "")

    def old_shape(v):
        bd = snapshot_body(v)
        return isinstance(bd, dict) and bd and "payload" not in bd

    older = [v for v in items if stamp(v) and stamp(v) < CUTOFF and old_shape(v)]
    return max(older, key=stamp) if older else None


def snapshot_body(v):
    for key in ("publishedData", "publishedEndpoint", "endpoint", "data", "snapshot"):
        if isinstance(v.get(key), dict) and "bodyDescription" in v[key]:
            return v[key]["bodyDescription"]
    return v.get("bodyDescription")


def set_desc(payload_value, path, text):
    node = {"value": payload_value}
    for part in path.split("."):
        val = node.get("value")
        if isinstance(val, list):
            val = (val[0] or {}).get("value") if val else None
        if not isinstance(val, dict) or part not in val:
            return False
        node = val[part]
    marker = MARK.search(node.get("description") or "")
    # Drop any Required/Optional sentence inside the old note; the current marker goes last.
    body = re.sub(r"(?:^|(?<=\. ))(?:Required|Optional)\.\s*", "", norm(text)).strip()
    node["description"] = body.rstrip(".") + ". " + (marker.group(1) + "." if marker else "")
    node["description"] = node["description"].strip()
    return True


def main():
    publish = "--publish" in sys.argv
    tok = token()
    applied = json.loads(PROGRESS.read_text())["endpoints"]
    generated = {p["endpointId"]: old_fields((p.get("args") or {}).get("bodyDescription") or {})
                 for p in json.loads(GENERATED.read_text(encoding="utf-8"))["patches"]}
    report, changed, fetch_errors = [], [], []
    for i, eid in enumerate(applied, 1):
        st, items = published_versions(eid, tok)
        if st != 200:
            fetch_errors.append({"id": eid, "status": st})
            continue
        old = pick_old(items)
        if not old:
            continue
        old_docs = old_fields(snapshot_body(old) or {})
        gen = generated.get(eid, {})
        hand = {k: v for k, v in old_docs.items() if norm(v) and norm(v) != norm(gen.get(k))}
        if not hand:
            continue
        st, cur = call("GET", f"/orgs/{ORG}/endpoints/{eid}", tok)
        cur = unwrap(cur)
        bd = cur.get("bodyDescription") or {}
        value = ((bd.get("payload") or {}).get("value")) or {}
        restored = [k for k, text in hand.items() if set_desc(value, k, text)]
        report.append({"id": eid, "name": cur.get("name"), "restored": restored,
                       "notFoundInCurrentBody": [k for k in hand if k not in restored]})
        if restored and publish:
            st, res = call("PUT", f"/orgs/{ORG}/endpoints/{eid}", tok, {"bodyDescription": bd})
            if st in (200, 201):
                changed.append(eid)
            else:
                report[-1]["error"] = f"{st} {str(res)[:200]}"
        if i % 50 == 0:
            print(f"{i}/{len(applied)} endpoints checked, {len(report)} with hand-written notes", flush=True)
        time.sleep(0.05)
    if publish and changed:
        st, _ = call("PATCH", f"/orgs/{ORG}/collections/{COLLECTION}/bulkPublish", tok,
                     {"rootParentId": ROOT_PARENT, "pageIds": [ROOT_PARENT] + changed})
        print("publish", st)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=1), encoding="utf-8")
    print(json.dumps({"endpointsWithHandwritten": len(report),
                      "fieldsRestored": sum(len(r["restored"]) for r in report),
                      "written": len(changed), "historyFetchErrors": fetch_errors, "mode": "publish" if publish else "report"}, indent=1))


if __name__ == "__main__":
    main()
