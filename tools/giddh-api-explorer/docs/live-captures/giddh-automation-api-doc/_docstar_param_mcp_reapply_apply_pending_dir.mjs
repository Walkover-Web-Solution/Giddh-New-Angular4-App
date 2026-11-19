#!/usr/bin/env node
/**
 * List .q/mcp-applied-pending/*.json for agent CallDynamicTool update_endpoint.
 * Usage: node _docstar_param_mcp_reapply_apply_pending_dir.mjs [start] [count]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const dir = path.join(ROOT, '.q/mcp-applied-pending');
const start = Number(process.argv[2] || 0);
const count = process.argv[3] != null ? Number(process.argv[3]) : undefined;
const files = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.json'))
  .sort((a, b) => Number(a) - Number(b))
  .slice(start, count != null ? start + count : undefined);
for (const f of files) {
  process.stdout.write(fs.readFileSync(path.join(dir, f), 'utf8') + '\n');
}
