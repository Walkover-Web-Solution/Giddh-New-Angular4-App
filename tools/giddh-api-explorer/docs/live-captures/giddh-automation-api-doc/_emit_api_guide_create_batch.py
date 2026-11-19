#!/usr/bin/env python3
"""Emit one JSON line per create_page args for pending guides. Usage: emit_batch.py <batch_index>"""
import json
import glob
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
CREATE_DIR = os.path.join(ROOT, ".docstar-param-mcp-out/api-guides-create")
RESULTS = os.path.join(ROOT, ".docstar-api-guides-direct-results.jsonl")
SKIP = {
    "guide-branch",
    "guide-account",
    "guide-address",
    "guide-advance-receipt",
    "guide-audit",
    "guide-auth",
    "guide-banking",
    "getting-started",
}
PARENT = "meihjCKoWw2i"
ORG = "83427"

done = set()
if os.path.exists(RESULTS):
    for line in open(RESULTS):
        line = line.strip()
        if not line:
            continue
        o = json.loads(line)
        if o.get("ok"):
            done.add(o["urlName"])

todo = []
for f in sorted(glob.glob(os.path.join(CREATE_DIR, "[0-9]*.json"))):
    d = json.load(open(f))
    if d["urlName"] in SKIP or d["urlName"] in done:
        continue
    todo.append(
        {
            "orgId": ORG,
            "pageId": PARENT,
            "name": d["name"],
            "urlName": d["urlName"],
            "state": d["state"],
            "contents": d["contents"],
        }
    )

batch_index = int(sys.argv[1]) if len(sys.argv) > 1 else 0
size = 5
start = batch_index * size
chunk = todo[start : start + size]
for item in chunk:
    print(json.dumps(item, ensure_ascii=False))
