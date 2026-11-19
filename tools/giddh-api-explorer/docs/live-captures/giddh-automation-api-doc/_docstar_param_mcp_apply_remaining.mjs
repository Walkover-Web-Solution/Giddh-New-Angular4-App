#!/usr/bin/env node
/**
 * Prepare + record helper for agent MCP loop (does NOT call DocStar HTTP).
 * node _docstar_param_mcp_apply_remaining.mjs prepare [size]
 * node _docstar_param_mcp_apply_remaining.mjs record-results '<json array {endpointId, ok, error?}>'
 */
import fs from 'node:fs';
import path from 'node:path';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.mcp.json');
const PROGRESS_MIRROR = path.join(ROOT, '.docstar-param-run-progress.json');
const QDIR = path.join(ROOT, '.q');

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

if (cmd === 'prepare') {
  const size = Number(process.argv[3] || 25);
  const progress = loadProgress();
  const items = loadItems();
  const start = progress.nextIndex ?? 0;
  const total = progress.total ?? items.length;
  const end = Math.min(start + size, total, items.length);
  if (start >= end || start >= total) {
    console.log(JSON.stringify({ done: true, nextIndex: start, total }));
    process.exit(0);
  }
  fs.mkdirSync(QDIR, { recursive: true });
  const slice = items.slice(start, end);
  const manifest = [];
  for (let i = 0; i < slice.length; i++) {
    const item = slice[i];
    const args = buildUpdateArgs(item);
    const fp = path.join(QDIR, `batch-${i}.json`);
    fs.writeFileSync(fp, JSON.stringify(args));
    manifest.push({ index: i, endpointId: item.endpointId, catalogKey: item.catalogKey, argsFile: fp });
  }
  fs.writeFileSync(path.join(QDIR, 'manifest.json'), JSON.stringify({ start, count: slice.length, manifest }, null, 2));
  console.log(JSON.stringify({ done: false, start, count: slice.length, endpointIds: slice.map((x) => x.endpointId) }));
} else if (cmd === 'record-results') {
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
  console.log(JSON.stringify({ ok: progress.ok, failed: progress.failed.length, nextIndex: progress.nextIndex, total: progress.total }));
} else if (cmd === 'status') {
  const p = loadProgress();
  console.log(JSON.stringify({ ok: p.ok, nextIndex: p.nextIndex, total: p.total, failed: p.failed?.length ?? 0 }));
} else {
  console.error('prepare | record-results | status');
  process.exit(1);
}
