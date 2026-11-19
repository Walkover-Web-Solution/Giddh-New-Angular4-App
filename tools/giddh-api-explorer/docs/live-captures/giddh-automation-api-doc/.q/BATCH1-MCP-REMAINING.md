# Batch 1 — remaining MCP `update_endpoint` applies

Progress file still **`nextIndex: 50`** until `finish_batch` runs after **all 50** lines in `.q/mcp-all.lines` succeed.

## Remaining (29 files)

Apply with `CallDynamicTool` → `user-docstar` → `update_endpoint` and **`arguments`** = full JSON from each file:

```
.q/tmp-args/2.json … 5.json, 8.json … 10.json, 12.json … 14.json,
20.json, 24.json … 26.json, 29.json, 35.json … 45.json
```

Helper: `node _docstar_param_mcp_reapply_apply_line.mjs <index>` prints args for line index 0–49.

## After all 50 MCP OK

```bash
cd docs/api/live-captures/giddh-automation-api-doc
node _docstar_param_mcp_reapply_batch.mjs prepare-results-from-batch
node _docstar_param_mcp_reapply_finish_batch.mjs   # expect nextIndex → 100
node _docstar_param_mcp_reapply_orchestrator.mjs loop-prepare 50
node _docstar_param_mcp_reapply_sync_batch_lines.mjs
# repeat MCP × batches until nextIndex >= 720
# publish: CallDynamicTool publish_pages with .docstar-publish-args.json
```

Shell SDK batch (`_docstar_param_mcp_reapply_sdk_batch.mjs`) needs `DOCSTAR_MCP_AUTHORIZATION=Bearer …`; Cursor OAuth does not propagate to shell.
