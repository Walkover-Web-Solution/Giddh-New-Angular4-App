#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-batches');
const OUT = path.join(ROOT, '.docstar-mcp-work-full.json');

const batchItems = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const meta = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, 'meta.json'), 'utf8'));
const batchIds = new Set(batchItems.map((x) => x.endpointId));

const missingItems = (meta.missingSample || []).map((m) => ({
  endpointId: m.id,
  name: m.name,
  description: `${m.name}. Part of the Giddh API. Requires Auth-Key or Session-Id.`,
}));

const batchWork = batchItems.map((item) => ({
  phase: 'batch',
  endpointId: item.endpointId,
  name: item.name,
  description: item.description,
  ...(item.sampleResponse != null ? { sampleResponse: item.sampleResponse } : {}),
}));

const missingWork = missingItems.map((m) => ({ phase: 'missing', ...m }));

const work = [...batchWork, ...missingWork];

fs.writeFileSync(OUT, JSON.stringify({ total: work.length, work }, null, 0));
console.log(JSON.stringify({ total: work.length, batch: batchItems.length, missingExtra: work.length - batchItems.length, out: OUT }));
