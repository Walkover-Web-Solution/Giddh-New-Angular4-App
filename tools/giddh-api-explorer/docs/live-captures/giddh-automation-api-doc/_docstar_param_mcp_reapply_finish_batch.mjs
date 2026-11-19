#!/usr/bin/env node
/** After MCP apply: prepare-results, record-reapply, sync summary. */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const node = process.execPath;

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

const prep = JSON.parse(run('_docstar_param_mcp_reapply_batch.mjs', 'prepare-results-from-batch'));
const rec = JSON.parse(
  run('_docstar_param_mcp_apply_all.mjs', 'record-reapply-results', '/tmp/docstar-param-reapply-results.json')
);
const sync = JSON.parse(run('_docstar_param_sync_reapply_summary.mjs'));
console.log(JSON.stringify({ prepare: prep, record: rec, sync }));
