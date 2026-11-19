# DocStar reapply v2 — resume

| Field | Value |
|-------|--------|
| **nextIndex** | **190** / 720 |
| **failed** | **0** |
| **publish** | **not run** |
| **Open batch** | none (last finished start **140**, size 50) |

## Closed this session

- Batch **65–89** (25) + **90–139** (50) + **140–189** (50) — all MCP `update_endpoint` params-only + `finish_batch`.

## Loop (190 → 720)

Per batch (prefer size **50**):

```bash
node _docstar_param_mcp_reapply_orchestrator.mjs loop-prepare 50
node _docstar_param_mcp_reapply_slim_current_batch.mjs   # mcp-out by endpointId — NOT params-only-queue index
# MCP update_endpoint each item in .docstar-param-mcp-batch-calls.json (orgId, endpointId, description, params only)
node _docstar_param_mcp_reapply_finish_batch.mjs
```

**Do not** slim from `.docstar-param-params-only-queue/NNNN-*.json` by batch index — queue order ≠ reapply batch order.

Fast path (Bearer, same MCP `update_endpoint`):

```bash
export DOCSTAR_MCP_AUTHORIZATION='Bearer …'   # or .docstar-mcp-bearer.local
node _docstar_param_mcp_reapply_apply_via_node_mcp.mjs calls
node _docstar_param_mcp_reapply_finish_batch.mjs
# repeat prepare → apply → finish until nextIndex >= 720
```

At **nextIndex ≥ 720**: `publish_pages` from `.docstar-publish-args.json` (chunks ~100).
