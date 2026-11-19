#!/usr/bin/env node
/**
 * Emit update_endpoint args from .q/apply-queue for agent MCP (one JSON line per index).
 * Usage: node _docstar_param_mcp_reapply_apply_queue.mjs [start] [count]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const Q = path.join(ROOT, '.q/apply-queue');
const start = Number(process.argv[2] || 0);
const count = Number(process.argv[3] || 50);

for (let i = start; i < start + count; i++) {
  const fp = path.join(Q, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  process.stdout.write(`${fs.readFileSync(fp, 'utf8').trim()}\n`);
}
