#!/usr/bin/env python3
"""Match DocStar endpoint page ids to public descriptions from grouped drafts."""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DRAFTS = ROOT / "docstar-grouped-drafts.json"
PAGES_DEFAULT = (
    Path.home()
    / ".cursor/projects/Users-divyanshu-Documents-Giddh-New-Angular4-App/agent-tools"
)


def load_draft_index() -> dict[tuple[str, str], dict]:
    data = json.loads(DRAFTS.read_text())
    index: dict[tuple[str, str], dict] = {}
    for menu in data.get("menus") or []:
        for ep in menu.get("endpoints") or []:
            key = ((ep.get("name") or "").strip().lower(), (ep.get("requestType") or "").upper())
            if key[0] and key[1]:
                index[key] = ep
    return index


def main() -> None:
    import sys

    pages_path = Path(sys.argv[1]) if len(sys.argv) > 1 else None
    if pages_path is None:
        candidates = sorted(PAGES_DEFAULT.glob("*.txt"), key=lambda p: p.stat().st_mtime, reverse=True)
        for candidate in candidates:
            try:
                payload = json.loads(candidate.read_text())
                if isinstance(payload, dict) and isinstance(payload.get("pages"), list):
                    pages_path = candidate
                    break
            except json.JSONDecodeError:
                continue
    if pages_path is None or not pages_path.is_file():
        raise SystemExit("Pass path to list_collection_pages JSON output")

    pages = json.loads(pages_path.read_text())["pages"]
    index = load_draft_index()
    queue: list[dict] = []
    missing: list[dict] = []
    for page in pages:
        if page.get("type") != 4:
            continue
        key = ((page.get("name") or "").strip().lower(), (page.get("endpoint.requestType") or page.get("requestType") or "").upper())
        draft = index.get(key)
        if not draft:
            missing.append({"id": page["id"], "name": page.get("name"), "requestType": key[1]})
            continue
        patch: dict = {"endpointId": page["id"], "name": page.get("name"), "description": draft.get("description")}
        samples = draft.get("sampleResponse")
        if isinstance(samples, list):
            patch["sampleResponse"] = samples
        queue.append(patch)

    out = ROOT / "docstar-description-update-queue.json"
    out.write_text(json.dumps({"queue": queue, "missingCount": len(missing), "missingSample": missing[:30]}, indent=2))
    print(json.dumps({"matched": len(queue), "missing": len(missing), "out": str(out)}))


if __name__ == "__main__":
    main()
