#!/usr/bin/env node
/**
 * Slice / record for MCP update_endpoint param batch run.
 * node _docstar_param_mcp_run_loop.mjs next [size]
 * node _docstar_param_mcp_run_loop.mjs record '<json array of {endpointId, ok, error?}>'
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.mcp.json');
const PROGRESS_MIRROR = path.join(ROOT, '.docstar-param-run-progress.json');

function loadItems() {
  return fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));
}

function loadProgress() {
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

function saveProgress(p) {
  const body = JSON.stringify(p, null, 2);
  fs.writeFileSync(PROGRESS, body);
  fs.writeFileSync(PROGRESS_MIRROR, body);
}

const cmd = process.argv[2];

if (cmd === 'next') {
  const size = Number(process.argv[3] || 10);
  const progress = loadProgress();
  const items = loadItems();
  const start = progress.nextIndex ?? 0;
  if (start >= items.length) {
    console.log(JSON.stringify({ done: true, ok: progress.ok, failed: progress.failed.length }));
    process.exit(0);
  }
  const slice = items.slice(start, start + size);
  console.log(
    JSON.stringify({
      done: false,
      start,
      total: items.length,
      items: slice.map((item) => ({
        endpointId: item.endpointId,
        catalogKey: item.catalogKey,
        args: buildUpdateArgs(item),
      })),
    })
  );
} else if (cmd === 'record') {
  const results = JSON.parse(process.argv[3]);
  const progress = loadProgress();
  const prevOk = progress.ok;
  for (const r of results) {
    if (r.ok) {
      progress.ok += 1;
      if (!progress.updatedIds.includes(r.endpointId)) {
        progress.updatedIds.push(r.endpointId);
      }
    } else {
      progress.failed.push(r);
    }
  }
  progress.nextIndex = (progress.nextIndex ?? 0) + results.length;
  if (Math.floor(progress.ok / 25) > Math.floor(prevOk / 25)) {
    progress.lastCheckpointAt = new Date().toISOString();
  }
  saveProgress(progress);
  console.log(
    JSON.stringify({
      ok: progress.ok,
      failed: progress.failed.length,
      nextIndex: progress.nextIndex,
      total: progress.total,
    })
  );
} else if (cmd === 'summary') {
  const progress = loadProgress();
  const summary = {
    completedAt: new Date().toISOString(),
    status: progress.nextIndex >= progress.total ? 'complete' : 'in_progress',
    updateMethod: 'user-docstar MCP update_endpoint',
    orgId: '83427',
    collectionId: '-Jey39dCAAyx',
    rootParentId: 'u9XDYe5Zc_ds',
    total: progress.total,
    ok: progress.ok,
    failedCount: progress.failed.length,
    failed: progress.failed,
    updatedIds: progress.updatedIds,
    nextIndex: progress.nextIndex,
  };
  const out = path.join(ROOT, 'docstar-param-doc-upload-summary.json');
  fs.writeFileSync(out, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ written: out, ok: progress.ok, failed: progress.failed.length }));
} else {
  console.error('next | record | summary');
  process.exit(1);
}
