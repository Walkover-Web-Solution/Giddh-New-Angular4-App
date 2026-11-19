#!/usr/bin/env python3
"""Append create_page results. Usage: record_results.py urlName id ok [urlName id ok ...]"""
import json
import sys

RESULTS = "/Users/divyanshu/Documents/Giddh-New-Angular4-App/docs/api/live-captures/giddh-automation-api-doc/.docstar-api-guides-direct-results.jsonl"
args = sys.argv[1:]
if len(args) % 3 != 0:
    raise SystemExit("triples required: urlName id ok")
with open(RESULTS, "a") as f:
    for i in range(0, len(args), 3):
        url, pid, ok = args[i], args[i + 1], args[i + 2]
        f.write(json.dumps({"urlName": url, "id": pid, "ok": ok.lower() == "true"}) + "\n")
print("recorded", len(args) // 3)
