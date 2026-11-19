#!/usr/bin/env node
/**
 * Print one line per pending MCP apply: { "endpointId", "args" } from .q/mcp-pending/NN.json
 * Agent: CallDynamicTool user-docstar update_endpoint with args for each line.
 * Usage: node _docstar_param_mcp_reapply_mcp_from_pending.mjs [start] [count]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const P = path.join(ROOT, '.q/mcp-pending');
const start = Number(process.argv[2] || 0);
const count = Number(process.argv[3] || 50);

for (let i = start; i < start + count; i++) {
  const fp = path.join(P, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  const args = JSON.parse(fs.readFileSync(fp, 'utf8'));
  process.stdout.write(`${JSON.stringify({ endpointId: args.endpointId, args })}\n`);
}
