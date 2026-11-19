#!/usr/bin/env node
/**
 * Emit current .docstar-param-mcp-batch-calls.json as NDJSON for agent MCP update_endpoint.
 * Usage: node _docstar_param_mcp_reapply_agent_apply_batch.mjs | while read -r line; do …
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const batch = JSON.parse(
  fs.readFileSync(path.join(ROOT, '.docstar-param-mcp-batch-calls.json'), 'utf8')
);
for (const args of batch) {
  process.stdout.write(`${JSON.stringify(args)}\n`);
}
