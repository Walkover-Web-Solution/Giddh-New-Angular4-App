#!/usr/bin/env node
/**
 * Apply all remaining reapply batches via MCP (Bearer). Requires DOCSTAR_MCP_AUTHORIZATION.
 * Usage: DOCSTAR_MCP_AUTHORIZATION='Bearer …' node _docstar_param_mcp_reapply_run_bearer_until_done.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const node = process.execPath;
const progressPath = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

if (!process.env.DOCSTAR_MCP_AUTHORIZATION?.trim()) {
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION required' }));
  process.exit(1);
}

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

function loadProgress() {
  return JSON.parse(fs.readFileSync(progressPath, 'utf8'));
}

let batches = 0;
while (true) {
  const p = loadProgress();
  if (p.nextIndex >= p.total) {
    console.log(JSON.stringify({ done: true, nextIndex: p.nextIndex, batches }));
    break;
  }
  if (!fs.existsSync(path.join(ROOT, '.q/mcp-batch-idx/00.json'))) {
    run('_docstar_param_mcp_reapply_orchestrator.mjs', 'loop-prepare', '50');
    run('_docstar_param_mcp_reapply_materialize_batch_wave.mjs');
  }
  run('_docstar_param_mcp_reapply_apply_batch_idx_dir.mjs');
  run('_docstar_param_mcp_reapply_batch.mjs', 'prepare-results-from-batch');
  run('_docstar_param_mcp_reapply_finish_batch.mjs');
  batches++;
  console.log(JSON.stringify({ batch: batches, ...loadProgress() }));
}
