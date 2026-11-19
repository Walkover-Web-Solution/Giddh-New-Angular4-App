#!/usr/bin/env node
/** Export next N items (from progress.nextIndex) to .q/0..N-1.json for MCP update_endpoint. */
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.mcp.json');
const QDIR = path.join(ROOT, '.q');

const n = Number(process.argv[2] || 20);
const items = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const start = progress.nextIndex ?? 0;
fs.mkdirSync(QDIR, { recursive: true });
for (let i = 0; i < n && start + i < items.length; i++) {
  const item = items[start + i];
  fs.writeFileSync(
    path.join(QDIR, `${i}.json`),
    JSON.stringify({ endpointId: item.endpointId, catalogKey: item.catalogKey, args: buildUpdateArgs(item) })
  );
}
console.log(JSON.stringify({ start, count: Math.min(n, items.length - start), total: items.length, ids: items.slice(start, start + n).map((x) => x.endpointId) }));
