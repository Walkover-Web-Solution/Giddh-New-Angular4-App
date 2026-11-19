#!/usr/bin/env node
/**
 * Print endpointIds + args paths for the current reapply batch (agent MCP loop).
 * node _docstar_param_mcp_apply_current_batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
for (const item of batch.items ?? []) {
  const argsPath = path.join(OUT, `${item.endpointId}.json`);
  const args = fs.existsSync(argsPath)
    ? JSON.parse(fs.readFileSync(argsPath, 'utf8'))
    : item.args;
  console.log(JSON.stringify({ endpointId: item.endpointId, catalogKey: item.catalogKey, args }));
}
