# DocStar reapply progress note (2026-10-29)

- Status: **BLOCKED / PARTIAL** — nextIndex 8 / total 787
- ok: 8 (indices 0-7), failed: 0
- Updated ids: -Rj3XPHsTqNZ, Iy6v2hw7RpRi, JaAOUKUHgsKS, JLo_r5vVasxB, O0IE0-iUWC8N, tbQ_i1_1j-48, BkTH4tumVM-a, 9ydRTt2g-NIH
- publish_pages: NOT run (reapply incomplete)

## Findings
- MCP `update_endpoint` works; params `required` booleans persist correctly.
- `bodyDescription` is NOT in the MCP tool schema; it is accepted but the response always returns `bodyDescription: {}` (not persisted via this tool).
- Each endpoint requires one manual MCP call (~2KB args + ~2KB response). 779 remaining calls (~1.5MB of payload) exceed what a single agent session can carry; resume in fresh sessions with `node _docstar_param_mcp_reapply_orchestrator.mjs loop-prepare 25` (next start = 8).
- Caution: `finish_batch` counts whole batch as ok; partial progress was recorded manually via record-reapply-results.

## Follow-up (2026-10-29 afternoon)

Merged slice agent results → **~224+** updated before next waves.

Findings confirmed across agents:
- MCP `update_endpoint` does **not** persist `bodyDescription` (schema omits it; responses return `{}`).
- `call_any_api_of_docstar` PUT with `proxy_auth_token` **does** persist `bodyDescription` (verified by [DocStar apply slice 150-300](973cb039-1fe9-429d-ad35-ba4869c81938)).
- Parallel batches >~10–13 often drop the MCP session; use 8–10 max.

Remaining queue: `.docstar-audit-remaining-queue.json` (~563 after merge; shrinks as waves complete).
