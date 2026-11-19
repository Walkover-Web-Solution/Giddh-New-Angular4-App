# DocStar param MCP apply (agent)

Repo: `docs/api/live-captures/giddh-automation-api-doc`

## Status (2026-10-28) — **COMPLETE**

**Giddh API Draft_1** collection **-Jey39dCAAyx** (org **83427**): **720/720** production v2 param reapply **complete** via MCP `update_endpoint` only. Progress `.docstar-param-reapply-v2.mcp.json`: **nextIndex 720**, **720/720** recorded OK, **0** remaining, **0** failed.

**Published:** `publish_pages` run from `.docstar-publish-args.json` (721 page ids incl. root `u9XDYe5Zc_ds`). Summary: `docstar-param-reapply-summary.json` (**complete**).

**No further reapply loops** unless catalog rules change and patches are rebuilt.

## Rules

- **Only** `user-docstar` MCP `update_endpoint` (NOT `call_any_api_of_docstar`, NOT REST `hm_` token).
- Do **not** run `_run_docstar_param_updates.mjs` or `_docstar_param_mcp_sdk_runner.mjs` (disabled) unless the user explicitly fixes REST auth.
- **One** MCP apply loop at a time (parallel agents corrupt progress files).
- **Do not** use `prepare-batch` / `record-results` for full collection re-runs (legacy `nextIndex` cursor drifts). Use **gap-fill** below.

## Full reapply (production catalog rules)

After `python3 docs/api/coverage/_enrich_catalog_parameter_docs.py` and `python3 _build_docstar_param_patches.py`, run `node _sync_docstar_param_mcp_out.mjs` (writes `.docstar-param-mcp-out/{endpointId}.json` for MCP apply):

```bash
node _docstar_param_mcp_reapply_orchestrator.mjs loop-prepare 25
# MCP update_endpoint each (.docstar-param-mcp-out/{id}.json or .docstar-param-mcp-batch-calls.json)
node _docstar_param_mcp_reapply_finish_batch.mjs
node _docstar_param_sync_reapply_summary.mjs   # also run inside finish_batch
```

Progress: `.docstar-param-reapply-v2.mcp.json` (does not use gap-fill `updatedIds`). When `nextIndex >= total`: `publish_pages` all endpoint ids + root.

## Gap-fill loop (canonical)

```bash
node _docstar_param_mcp_apply_all.mjs prepare-missing-batch 25
# MCP update_endpoint per item (prefer .q/mcp-{endpointId}.json or item.args)
# /tmp/docstar-param-results.json → [{ "endpointId": "...", "ok": true }, ...]
node _docstar_param_mcp_apply_all.mjs record-missing-results /tmp/docstar-param-results.json
```

Repeat until `prepare-missing-batch` returns `{"done":true,"ok":720,"missing":0}`.

Optional staged args: `node _docstar_param_mcp_apply_out_dir.mjs <endpointId>`; queue folder `.docstar-param-mcp-out/apply-queue/`.

## Rebuild patches (when live collection or catalog changes)

```bash
# Refresh docstar-live-endpoints-raw.json via MCP GET .../collections/-Jey39dCAAyx/endpoints
python3 _refresh_docstar_live_index.py
python3 _build_docstar_param_patches.py
```

Then run the gap-fill loop for any new/changed endpoint IDs.

## Finish

When **`ok >= total`** (720): `publish_pages` orgId `83427`, collectionId `-Jey39dCAAyx`, `pageIds` = unique `updatedIds` + root `u9XDYe5Zc_ds`.

```bash
node _docstar_param_mcp_apply_all.mjs summary
```
