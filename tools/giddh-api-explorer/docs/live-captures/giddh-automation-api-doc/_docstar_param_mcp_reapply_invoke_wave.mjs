#!/usr/bin/env node
/**
 * Emit one NDJSON line per MCP update_endpoint args (full .docstar-param-mcp-out payload).
 * Usage: node _docstar_param_mcp_reapply_invoke_wave.mjs [offset] [count]
 * Default: current batch, all items.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');

const offset = Number(process.argv[2] || 0);
const countArg = process.argv[3];
const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const items = batch.items ?? [];
const slice =
  countArg != null
    ? items.slice(offset, offset + Number(countArg))
    : items.slice(offset);

for (const item of slice) {
  const fp = path.join(OUT, `${item.endpointId}.json`);
  const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
  process.stdout.write(`${JSON.stringify(a)}\n`);
}
