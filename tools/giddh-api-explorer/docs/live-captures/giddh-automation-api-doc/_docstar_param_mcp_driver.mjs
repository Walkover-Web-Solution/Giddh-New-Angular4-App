#!/usr/bin/env node
/**
 * Prepare slices / apply MCP results for param batch upload.
 * Usage:
 *   node _docstar_param_mcp_driver.mjs slice [size] [offset]
 *   node _docstar_param_mcp_driver.mjs record <results.json>
 *   node _docstar_param_mcp_driver.mjs publish-ids
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');

function loadItems() {
  return fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));
}

export function buildUpdateArgs(item) {
  const a = item.args;
  const args = {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params,
    body: a.body,
  };
  if (a.bodyDescription != null && Object.keys(a.bodyDescription).length > 0) {
    args.bodyDescription = a.bodyDescription;
  }
  return args;
}

function loadProgress() {
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

if (isMain) {
const cmd = process.argv[2];

if (cmd === 'slice') {
  const size = Number(process.argv[3] || 10);
  const offset = process.argv[4] != null ? Number(process.argv[4]) : loadProgress().nextIndex ?? 0;
  const items = loadItems();
  const slice = items.slice(offset, offset + size);
  console.log(
    JSON.stringify({
      offset,
      total: items.length,
      slice: slice.map((item) => ({ endpointId: item.endpointId, args: buildUpdateArgs(item) })),
    })
  );
} else if (cmd === 'record') {
  const results = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const progress = loadProgress();
  const prevOk = progress.ok;
  for (const r of results) {
    if (r.ok) {
      progress.ok += 1;
      progress.updatedIds.push(r.endpointId);
    } else {
      progress.failed.push(r);
    }
  }
  progress.nextIndex = (progress.nextIndex ?? 0) + results.length;
  if (Math.floor(progress.ok / 25) > Math.floor(prevOk / 25)) {
    progress.lastCheckpointAt = new Date().toISOString();
  }
  saveProgress(progress);
  console.log(JSON.stringify({ ok: progress.ok, failed: progress.failed.length, nextIndex: progress.nextIndex }));
} else if (cmd === 'publish-ids') {
  const progress = loadProgress();
  const ids = [...new Set([...progress.updatedIds, 'u9XDYe5Zc_ds'])];
  console.log(JSON.stringify(ids));
} else if (cmd === 'all-args-lines') {
  const items = loadItems();
  for (const item of items) {
    console.log(JSON.stringify({ endpointId: item.endpointId, args: buildUpdateArgs(item) }));
  }
} else {
  console.error('slice | record | publish-ids | all-args-lines');
  process.exit(1);
}
}
