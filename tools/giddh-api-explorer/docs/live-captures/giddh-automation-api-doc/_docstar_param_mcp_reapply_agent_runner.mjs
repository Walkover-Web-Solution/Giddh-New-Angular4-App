#!/usr/bin/env node
/**
 * Emit NDJSON update_endpoint args for agent CallDynamicTool (full .docstar-param-mcp-out payload).
 * Usage:
 *   node _docstar_param_mcp_reapply_agent_runner.mjs batch     # current .docstar-param-current-batch.json
 *   node _docstar_param_mcp_reapply_agent_runner.mjs all       # all patches from progress.nextIndex
 *   node _docstar_param_mcp_reapply_agent_runner.mjs range 0 50
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const PATCHES = path.join(ROOT, 'docstar-param-doc-patches.json');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');

function loadArgs(endpointId, fallback) {
  const fp = path.join(OUT, `${endpointId}.json`);
  if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, 'utf8'));
  return fallback;
}

function emitArgs(a) {
  const args = {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params,
    body: a.body,
    ...(a.bodyDescription != null && Object.keys(a.bodyDescription).length > 0
      ? { bodyDescription: a.bodyDescription }
      : {}),
  };
  process.stdout.write(`${JSON.stringify(args)}\n`);
}

const cmd = process.argv[2] || 'batch';

if (cmd === 'batch') {
  const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
  for (const item of batch.items ?? []) {
    emitArgs(loadArgs(item.endpointId, item.args));
  }
} else if (cmd === 'all') {
  const patches = JSON.parse(fs.readFileSync(PATCHES, 'utf8')).patches ?? [];
  const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  const start = progress.nextIndex ?? 0;
  for (const item of patches.slice(start)) {
    emitArgs(loadArgs(item.endpointId, item.args));
  }
} else if (cmd === 'range') {
  const patches = JSON.parse(fs.readFileSync(PATCHES, 'utf8')).patches ?? [];
  const start = Number(process.argv[3] || 0);
  const end = Number(process.argv[4] || patches.length);
  for (const item of patches.slice(start, end)) {
    emitArgs(loadArgs(item.endpointId, item.args));
  }
} else {
  console.error('batch | all | range <start> <end>');
  process.exit(1);
}
