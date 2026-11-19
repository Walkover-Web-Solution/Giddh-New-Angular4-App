#!/usr/bin/env python3
"""Append {urlName,id,ok} lines from create_page/call_any response snippets."""
import json
import sys

RESULTS = "/Users/divyanshu/Documents/Giddh-New-Angular4-App/docs/api/live-captures/giddh-automation-api-doc/.docstar-api-guides-direct-results.jsonl"

def append(url_name, page_id, ok):
    with open(RESULTS, "a") as f:
        f.write(json.dumps({"urlName": url_name, "id": page_id, "ok": ok}) + "\n")

if __name__ == "__main__":
    # triples: urlName id ok
    args = sys.argv[1:]
    for i in range(0, len(args), 3):
        append(args[i], args[i + 1], args[i + 2].lower() == "true")
    print("appended", len(args) // 3)
