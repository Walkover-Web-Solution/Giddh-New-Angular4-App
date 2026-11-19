#!/usr/bin/env node
/** Print args for single item at progress.nextIndex (for agent update_endpoint). */
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.mcp.json');

const items = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const i = progress.nextIndex ?? 0;
if (i >= items.length) {
  console.log(JSON.stringify({ done: true, ok: progress.ok, nextIndex: i }));
  process.exit(0);
}
const item = items[i];
console.log(
  JSON.stringify({
    done: false,
    index: i,
    total: items.length,
    endpointId: item.endpointId,
    catalogKey: item.catalogKey,
    args: buildUpdateArgs(item),
  })
);
