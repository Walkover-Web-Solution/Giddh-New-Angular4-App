#!/usr/bin/env node
/**
 * Apply all remaining reapply batches via MCP update_endpoint using Cursor-injected auth.
 * Requires running inside Cursor agent with access to CallDynamicTool — this script
 * prints batch slices for the agent; mechanical finish uses orchestrator scripts.
 *
 * Mechanical loop (agent must MCP each slice before finish):
 *   node _docstar_param_mcp_reapply_apply_all_batches.mjs status
 *   node _docstar_param_mcp_reapply_apply_all_batches.mjs prepare-mcp-one
 *   node _docstar_param_mcp_reapply_apply_all_batches.mjs finish-batch
 *   node _docstar_param_mcp_reapply_apply_all_batches.mjs next-batch
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const node = process.execPath;
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');
const MCP_ONE = path.join(ROOT, '.q/mcp-one');

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

const cmd = process.argv[2] || 'status';

if (cmd === 'status') {
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  console.log(
    JSON.stringify({
      nextIndex: p.nextIndex,
      total: p.total,
      failed: p.failed?.length ?? 0,
      remaining: p.total - p.nextIndex,
    })
  );
} else if (cmd === 'prepare-mcp-one') {
  const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
  fs.mkdirSync(MCP_ONE, { recursive: true });
  for (const item of batch.items ?? []) {
    const fp = path.join(OUT, `${item.endpointId}.json`);
    const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
    fs.writeFileSync(path.join(MCP_ONE, `${item.endpointId}.json`), JSON.stringify(a));
  }
  console.log(
    JSON.stringify({
      start: batch.start,
      count: batch.items?.length ?? 0,
      ids: (batch.items ?? []).map((i) => i.endpointId),
      dir: MCP_ONE,
    })
  );
} else if (cmd === 'finish-batch') {
  console.log(run('_docstar_param_mcp_reapply_batch.mjs', 'prepare-results-from-batch'));
  console.log(run('_docstar_param_mcp_reapply_finish_batch.mjs'));
} else if (cmd === 'next-batch') {
  console.log(run('_docstar_param_mcp_reapply_orchestrator.mjs', 'loop-prepare', '50'));
} else {
  console.error('status | prepare-mcp-one | finish-batch | next-batch');
  process.exit(1);
}
