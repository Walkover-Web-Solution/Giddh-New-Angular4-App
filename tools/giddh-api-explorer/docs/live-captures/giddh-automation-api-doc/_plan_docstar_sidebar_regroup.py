#!/usr/bin/env python3
"""Compare DocStar sidebar parent vs catalog menu rules; emit regroup + guide apply plan."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
DOC = Path(__file__).resolve().parent
sys.path.insert(0, str(DOC))

# Reuse menu rules from draft builder
from _draft_docstar_all import menu_for  # noqa: E402

PAGES_SNAPSHOT = DOC / "docstar-collection-pages-flat.json"
LIVE_INDEX = DOC / "docstar-live-endpoint-index.json"
OUT_PLAN = DOC / "docstar-sidebar-regroup-plan.json"
GUIDE_DIR = DOC / "docstar-guide-pages"

ORG = "83427"
COLLECTION = "-Jey39dCAAyx"
ROOT_PARENT = "u9XDYe5Zc_ds"

GUIDE_PAGES = {
    "Proforma": {"pageId": "0M0j2julTA_A", "urlName": "proforma", "markdown": "proforma.md"},
    "Estimation": {"pageId": "qpclmChA8TAL", "urlName": "estimation", "markdown": "estimation.md"},
}


def load_pages() -> list[dict]:
    raw = json.loads(PAGES_SNAPSHOT.read_text())
    if isinstance(raw, list):
        return raw
    return raw.get("pages") or raw.get("data", {}).get("pages") or []


def main() -> None:
    pages = load_pages()
    by_id = {p["id"]: p for p in pages}
    modules = {p["name"]: p for p in pages if p.get("type") == 1}

    def module_name_for_page(page_id: str) -> str | None:
        while page_id and page_id in by_id:
            p = by_id[page_id]
            if p.get("type") == 1:
                return p.get("name")
            page_id = p.get("parentId")
        return None

    live = json.loads(LIVE_INDEX.read_text()).get("endpoints", {})
    misplaced: list[dict] = []
    for eid, ep in live.items():
        if eid not in by_id or by_id[eid].get("type") != 4:
            continue
        url = ep.get("URL") or ""
        path = re.sub(r"^https://api\.giddh\.com", "", url).split("?")[0]
        expected = menu_for(path, {"giddh-panel"})
        actual = module_name_for_page(by_id[eid].get("parentId") or "")
        if expected and actual and expected != actual:
            target = modules.get(expected)
            misplaced.append(
                {
                    "endpointId": eid,
                    "name": ep.get("name") or by_id[eid].get("name"),
                    "path": path,
                    "expectedMenu": expected,
                    "actualMenu": actual,
                    "targetModulePageId": target["id"] if target else None,
                    "currentParentId": by_id[eid].get("parentId"),
                }
            )

    guides = []
    for title, meta in GUIDE_PAGES.items():
        md_path = GUIDE_DIR / meta["markdown"]
        guides.append(
            {
                "pageId": meta["pageId"],
                "title": title,
                "urlName": meta["urlName"],
                "markdownFile": str(md_path.relative_to(DOC)),
                "markdownChars": len(md_path.read_text()) if md_path.is_file() else 0,
                "apply": f"PUT /orgs/{ORG}/pages/{meta['pageId']} {{ contents: <markdown> }} then publish_pages",
            }
        )

    plan = {
        "orgId": ORG,
        "collectionId": COLLECTION,
        "rootParentId": ROOT_PARENT,
        "misplacedEndpointCount": len(misplaced),
        "misplacedSample": misplaced[:40],
        "misplacedByExpectedMenu": _count(misplaced, "expectedMenu"),
        "guidePages": guides,
        "moveApi": f"POST /orgs/{ORG}/collections/{COLLECTION}/dragAndDrop",
        "notes": [
            "Guide modules (Proforma, Estimation) have empty child[] — create a subpage under each guide, then move endpoints with dragAndDrop.",
            "Refresh docstar-collection-pages-flat.json via list_collection_pages before re-planning.",
        ],
    }
    OUT_PLAN.write_text(json.dumps(plan, indent=2))
    print(json.dumps({"misplaced": len(misplaced), "guides": len(guides), "out": str(OUT_PLAN)}, indent=2))


def _count(rows: list[dict], key: str) -> dict[str, int]:
    out: dict[str, int] = {}
    for row in rows:
        k = row.get(key) or "?"
        out[k] = out.get(k, 0) + 1
    return dict(sorted(out.items(), key=lambda x: -x[1]))


if __name__ == "__main__":
    main()
