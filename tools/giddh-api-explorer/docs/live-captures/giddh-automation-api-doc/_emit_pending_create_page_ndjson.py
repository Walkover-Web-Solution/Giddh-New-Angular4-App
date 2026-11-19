#!/usr/bin/env python3
"""
Emit create_page MCP args as NDJSON from pending-call-any batches.
Agent: for each line, CallDynamicTool user-docstar create_page with parsed JSON.
"""
import json
import glob
import os
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))
BATCH_DIR = os.path.join(ROOT, ".docstar-api-guides-call-any-batches")
PARENT = "meihjCKoWw2i"
ORG = "83427"

def emit_item(item):
    return {
        "orgId": ORG,
        "pageId": PARENT,
        "name": item["name"],
        "urlName": item["urlName"],
        "state": item["state"],
        "contents": item["contents"],
    }

def main():
    start_batch = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    end_batch = int(sys.argv[2]) if len(sys.argv) > 2 else 999
    files = sorted(glob.glob(os.path.join(BATCH_DIR, "batch_*.json")))
    for fp in files:
        bn = int(os.path.basename(fp).split("_")[1].split(".")[0])
        if bn < start_batch or bn > end_batch:
            continue
        for item in json.load(open(fp)):
            print(json.dumps(emit_item(item), ensure_ascii=False))

if __name__ == "__main__":
    main()
