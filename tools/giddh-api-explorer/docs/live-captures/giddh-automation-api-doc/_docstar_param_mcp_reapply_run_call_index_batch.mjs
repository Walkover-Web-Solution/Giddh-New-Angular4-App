#!/usr/bin/env node
/**
 * One reapply batch: prepare → copy mcp-call-index → (agent MCP all) → record.
 * Usage:
 *   node _docstar_param_mcp_reapply_run_call_index_batch.mjs prepare [size=50]
 *   node _docstar_param_mcp_reapply_run_call_index_batch.mjs record
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const qDir = path.join(ROOT, '.q/mcp-call-index');

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

const cmd = process.argv[2] || 'prepare';
const size = process.argv[3] || '50';

if (cmd === 'prepare') {
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'prepare-reapply-batch', size));
  const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
  fs.mkdirSync(qDir, { recursive: true });
  batch.items.forEach((item, i) => {
    const src = path.join(OUT, `${item.endpointId}.json`);
    fs.copyFileSync(src, path.join(qDir, `${i}.json`));
  });
  console.log(JSON.stringify({ copied: batch.items.length, start: batch.start, qDir }));
} else if (cmd === 'record') {
  console.log(run('_docstar_param_mcp_reapply_batch.mjs', 'prepare-results-from-batch'));
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'record-reapply-results', '/tmp/docstar-param-reapply-results.json'));
  const p = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-reapply-v2.mcp.json'), 'utf8'));
  console.log(JSON.stringify({ nextIndex: p.nextIndex, total: p.total, failed: p.failed ?? [] }));
} else {
  console.error('prepare [size] | record');
  process.exit(1);
}
