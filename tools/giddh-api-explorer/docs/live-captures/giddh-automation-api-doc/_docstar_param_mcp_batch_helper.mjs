#!/usr/bin/env node
/** Print next MCP update_endpoint batch from batch-*.json using progress.nextIndex */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');
const size = Number(process.argv[2] || 20);

const items = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const start = progress.nextIndex ?? 0;
const batch = items.slice(start, start + size);
console.log(JSON.stringify({ start, batchSize: batch.length, items: batch.map((i) => ({ endpointId: i.endpointId, args: i.args })) }));
