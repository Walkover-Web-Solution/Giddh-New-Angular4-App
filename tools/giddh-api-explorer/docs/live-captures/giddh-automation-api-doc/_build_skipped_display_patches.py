#!/usr/bin/env python3
"""Build sampleResponse patches for DocStar endpoints not in grouped-drafts queue."""

from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[3]
import sys

sys.path.insert(0, str(REPO / "docs/api/coverage"))
from display_success_samples import display_body_for_reference  # noqa: E402

SKIPPED = ROOT / "docstar-display-success-skipped.json"
URL_FIXES = ROOT / "docstar-apitest-url-fixes.json"
CATALOG = REPO / "docs/api/coverage/catalog.json"
OUT = ROOT / "docstar-skipped-display-patches.json"


def norm_path(url: str) -> str:
    path = urlparse(url.replace(":companyUniqueName", "{}")).path
    path = re.sub(r":\w+(?::\.\+)?", "{}", path)
    path = re.sub(r"\{[^}]+\}", "{}", path)
    return path.strip("/")


def norm_name(value: str) -> str:
    return re.sub(r"[^a-z0-9]", "", (value or "").lower())


def catalog_indexes() -> tuple[dict[tuple[str, str], dict], dict[str, dict]]:
    catalog = json.loads(CATALOG.read_text())
    by_path: dict[tuple[str, str], dict] = {}
    by_name: dict[str, dict] = {}
    for record in catalog.get("records") or []:
        method = (record.get("method") or "").upper()
        path = (record.get("path") or "").lstrip("/")
        path = re.sub(r"\{[^}]+\}", "{}", path)
        by_path[(method, path)] = record
        for label in (record.get("description"), record.get("handler")):
            if label:
                by_name[norm_name(label)] = record
    return by_path, by_name


def success_to_sample(record: dict) -> list[dict] | None:
    response = record.get("response") or {}
    success = response.get("successExample")
    if success is None:
        return None
    if isinstance(success, dict) and "status" in success:
        body = success
    else:
        body = {"status": "success", "body": success}
    status = response.get("httpStatus") or 200
    return [
        {
            "title": "Success",
            "status": status,
            "description": "Example success response for documentation display.",
            "data": body if body.get("status") == "success" else {"status": "success", "body": body},
        }
    ]


def main() -> None:
    skipped = json.loads(SKIPPED.read_text()).get("items") or []
    id_to_url = {row["id"]: row["URL"] for row in json.loads(URL_FIXES.read_text()) if row.get("id") and row.get("URL")}
    by_path, by_name = catalog_indexes()
    patches = []
    unmatched = []
    for item in skipped:
        eid = item["endpointId"]
        method = (item.get("requestType") or "GET").upper()
        name = item.get("name") or ""
        url = id_to_url.get(eid, "")
        key = (method, norm_path(url)) if url else None
        record = by_path.get(key) if key else None
        if not record:
            record = by_name.get(norm_name(name))
        if not record:
            body = display_body_for_reference("response", method=method, name=name, url=url)
            patches.append(
                {
                    "endpointId": eid,
                    "name": name,
                    "sampleResponse": [
                        {
                            "title": "Success",
                            "status": 200 if method != "POST" else 200,
                            "description": "Example success response for documentation display.",
                            "data": {"status": "success", "body": body},
                        }
                    ],
                    "source": "generated-fallback",
                }
            )
            continue
        samples = success_to_sample(record)
        if not samples:
            unmatched.append({**item, "url": url, "reason": "no-success-in-catalog"})
            continue
        patches.append({"endpointId": eid, "name": name, "sampleResponse": samples, "source": "catalog"})

    OUT.write_text(json.dumps({"count": len(patches), "unmatchedCount": len(unmatched), "patches": patches, "unmatched": unmatched}, indent=2) + "\n")
    print(json.dumps({"patches": len(patches), "unmatched": len(unmatched)}))


if __name__ == "__main__":
    main()
