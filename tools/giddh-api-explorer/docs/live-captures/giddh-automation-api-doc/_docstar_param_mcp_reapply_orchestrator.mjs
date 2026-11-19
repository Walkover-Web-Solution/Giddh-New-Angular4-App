#!/usr/bin/env node
/**
 * Reapply v2 orchestrator (mechanical steps only).
 * prepare | emit | finish | status | loop-prepare
 *
 * Agent loop: loop-prepare → MCP update_endpoint each (.docstar-param-mcp-batch-calls.json or NDJSON from apply_chunks) → finish
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const node = process.execPath;
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

const cmd = process.argv[2] || 'status';

if (cmd === 'status') {
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  console.log(JSON.stringify({ nextIndex: p.nextIndex, total: p.total, failed: p.failed?.length ?? 0, remaining: p.total - p.nextIndex }));
} else if (cmd === 'prepare') {
  const size = process.argv[3] || '25';
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'prepare-reapply-batch', size));
} else if (cmd === 'emit') {
  console.log(run('_docstar_param_mcp_reapply_emit_batch.mjs'));
} else if (cmd === 'finish') {
  console.log(run('_docstar_param_mcp_reapply_finish_batch.mjs'));
} else if (cmd === 'loop-prepare') {
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  if (p.nextIndex >= p.total) {
    console.log(JSON.stringify({ done: true, nextIndex: p.nextIndex }));
    process.exit(0);
  }
  const size = process.argv[3] || '25';
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'prepare-reapply-batch', size));
  console.log(run('_docstar_param_mcp_reapply_emit_batch.mjs'));
  const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
  console.log(
    JSON.stringify({
      action: 'MCP_UPDATE_ENDPOINT_EACH',
      start: batch.start,
      count: batch.size,
      endpointIds: (batch.items ?? []).map((i) => i.endpointId),
    })
  );
} else {
  console.error('status | prepare | emit | finish | loop-prepare');
  process.exit(1);
}
