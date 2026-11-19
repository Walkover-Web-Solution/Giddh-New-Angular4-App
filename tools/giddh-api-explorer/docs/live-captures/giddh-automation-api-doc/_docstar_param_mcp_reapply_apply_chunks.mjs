#!/usr/bin/env node
/**
 * Print current-batch MCP update_endpoint args as NDJSON (one object per line).
 * Agent: CallDynamicTool user-docstar update_endpoint per line.
 * node _docstar_param_mcp_reapply_apply_chunks.mjs [chunkSize=5]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const chunkSize = Number(process.argv[2] || 5);

const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
for (const item of batch.items ?? []) {
  const fp = path.join(OUT, `${item.endpointId}.json`);
  const a = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : item.args;
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
