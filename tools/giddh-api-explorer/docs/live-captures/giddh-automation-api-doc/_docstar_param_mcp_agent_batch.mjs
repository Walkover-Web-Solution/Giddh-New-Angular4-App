#!/usr/bin/env node
/** Emit one endpoint args JSON per line from nextIndex (for agent MCP loop). */
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');

const items = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => {
    if (!f.startsWith('batch-') || !f.endsWith('.json')) return false;
    const num = Number(f.slice('batch-'.length, 'batch-'.length + 3));
    return num <= 27;
  })
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const start = progress.nextIndex ?? 0;
const end = process.argv[2] ? start + Number(process.argv[2]) : items.length;

for (let i = start; i < end && i < items.length; i++) {
  const item = items[i];
  console.log(
    JSON.stringify({
      index: i,
      endpointId: item.endpointId,
      args: buildUpdateArgs(item),
    })
  );
}
