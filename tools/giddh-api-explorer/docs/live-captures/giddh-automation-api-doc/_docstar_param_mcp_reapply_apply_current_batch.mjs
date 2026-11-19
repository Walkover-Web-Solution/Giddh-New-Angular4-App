#!/usr/bin/env node
/**
 * Prepare current batch for agent MCP: rebuild .q/apply-queue from .docstar-param-mcp-out.
 * Usage: node _docstar_param_mcp_reapply_apply_current_batch.mjs [size=50]
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const Q = path.join(ROOT, '.q/apply-queue');

const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const items = batch.items ?? [];
fs.mkdirSync(Q, { recursive: true });
for (let i = 0; i < items.length; i++) {
  const id = items[i].endpointId;
  const src = path.join(OUT, `${id}.json`);
  const j = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(path.join(Q, `${String(i).padStart(2, '0')}.json`), j);
}
console.log(
  JSON.stringify({
    start: batch.start,
    count: items.length,
    queueDir: Q,
    hint: 'CallDynamicTool user-docstar update_endpoint per .q/apply-queue/NN.json',
  })
);
