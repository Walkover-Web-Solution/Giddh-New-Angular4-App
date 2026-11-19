#!/usr/bin/env node
/**
 * Emit batches for agent MCP update_endpoint apply.
 * node _docstar_param_mcp_apply_all.mjs prepare-batch [size]
 * node _docstar_param_mcp_apply_all.mjs prepare-missing-batch [size]
 * node _docstar_param_mcp_apply_all.mjs record-results /path/to/results.json
 * node _docstar_param_mcp_apply_all.mjs record-missing-results /path/to/results.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { buildUpdateArgs } from './_docstar_param_mcp_driver.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.mcp.json');
const PROGRESS_MIRROR = path.join(ROOT, '.docstar-param-run-progress.json');
const BATCH_OUT = path.join(ROOT, '.docstar-param-current-batch.json');
const PATCHES_FILE = path.join(ROOT, 'docstar-param-doc-patches.json');
const REAPPLY_PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

function loadPatches() {
  const doc = JSON.parse(fs.readFileSync(PATCHES_FILE, 'utf8'));
  return doc.patches ?? [];
}

function loadReapplyProgress() {
  if (!fs.existsSync(REAPPLY_PROGRESS)) {
    return { nextIndex: 0, total: 0, failed: [], note: 'production doc reapply v2' };
  }
  return JSON.parse(fs.readFileSync(REAPPLY_PROGRESS, 'utf8'));
}

function saveReapplyProgress(p) {
  fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(p, null, 2));
}

function loadItems() {
  return fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));
}

function loadProgress() {
  const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  progress.total = loadItems().length;
  progress.ok = (progress.updatedIds ?? []).length;
  return progress;
}

function saveProgress(p) {
  const body = JSON.stringify(p, null, 2);
  fs.writeFileSync(PROGRESS, body);
  fs.writeFileSync(PROGRESS_MIRROR, body);
}

const cmd = process.argv[2];

if (cmd === 'prepare-batch') {
  const size = Number(process.argv[3] || 25);
  const progress = loadProgress();
  const items = loadItems();
  progress.total = items.length;
  const start = progress.nextIndex ?? 0;
  if (start >= items.length) {
    saveProgress(progress);
    console.log(JSON.stringify({ done: true, ok: progress.ok, failed: progress.failed.length }));
    process.exit(0);
  }
  const slice = items.slice(start, start + size).map((item) => ({
    endpointId: item.endpointId,
    catalogKey: item.catalogKey,
    args: buildUpdateArgs(item),
  }));
  fs.writeFileSync(BATCH_OUT, JSON.stringify({ start, size: slice.length, items: slice }, null, 2));
  console.log(JSON.stringify({ done: false, start, batchSize: slice.length, total: items.length, out: BATCH_OUT }));
} else if (cmd === 'prepare-missing-batch') {
  const size = Number(process.argv[3] || 25);
  const progress = loadProgress();
  const items = loadItems();
  const have = new Set(progress.updatedIds ?? []);
  const missing = items.filter((item) => !have.has(item.endpointId));
  if (!missing.length) {
    saveProgress(progress);
    console.log(JSON.stringify({ done: true, ok: progress.ok, missing: 0 }));
    process.exit(0);
  }
  const slice = missing.slice(0, size).map((item) => ({
    endpointId: item.endpointId,
    catalogKey: item.catalogKey,
    args: buildUpdateArgs(item),
  }));
  fs.writeFileSync(
    BATCH_OUT,
    JSON.stringify({ mode: 'missing', missingRemaining: missing.length, size: slice.length, items: slice }, null, 2)
  );
  console.log(
    JSON.stringify({
      done: false,
      missingTotal: missing.length,
      batchSize: slice.length,
      out: BATCH_OUT,
    })
  );
} else if (cmd === 'record-missing-results') {
  const results = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const progress = loadProgress();
  const prevOk = progress.ok;
  for (const r of results) {
    if (r.ok) {
      if (!progress.updatedIds.includes(r.endpointId)) {
        progress.updatedIds.push(r.endpointId);
      }
    } else {
      progress.failed.push(r);
    }
  }
  progress.ok = progress.updatedIds.length;
  if (progress.ok % 25 === 0 || progress.ok >= progress.total) {
    progress.lastCheckpointAt = new Date().toISOString();
  }
  progress.note =
    'Use prepare-missing-batch + record-missing-results until ok === total; nextIndex is legacy cursor only.';
  saveProgress(progress);
  console.log(
    JSON.stringify({
      ok: progress.ok,
      failed: progress.failed.length,
      missing: progress.total - progress.ok,
      checkpoint: Math.floor(progress.ok / 25) > Math.floor(prevOk / 25),
    })
  );
} else if (cmd === 'record-results') {
  const results = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
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
  if (progress.nextIndex % 25 === 0 || progress.nextIndex >= progress.total) {
    progress.lastCheckpointAt = new Date().toISOString();
  }
  progress.ok = progress.updatedIds.length;
  saveProgress(progress);
  console.log(
    JSON.stringify({
      ok: progress.ok,
      failed: progress.failed.length,
      nextIndex: progress.nextIndex,
      checkpoint: Math.floor(progress.ok / 25) > Math.floor(prevOk / 25),
    })
  );
} else if (cmd === 'load-batch-args') {
  const loader = path.join(ROOT, '_docstar_param_load_batch_args.mjs');
  const out = execFileSync(process.execPath, [loader], { encoding: 'utf8' });
  fs.writeFileSync(path.join(ROOT, '.docstar-param-current-mcp-args.json'), out);
  console.log(JSON.stringify({ bytes: out.length }));
} else if (cmd === 'prepare-reapply-batch') {
  const size = Number(process.argv[3] || 25);
  const patches = loadPatches();
  const progress = loadReapplyProgress();
  progress.total = patches.length;
  const start = progress.nextIndex ?? 0;
  if (start >= patches.length) {
    saveReapplyProgress(progress);
    console.log(JSON.stringify({ done: true, nextIndex: start, total: patches.length }));
    process.exit(0);
  }
  const slice = patches.slice(start, start + size).map((item) => ({
    endpointId: item.endpointId,
    catalogKey: item.catalogKey,
    args: item.args,
  }));
  fs.writeFileSync(
    BATCH_OUT,
    JSON.stringify({ mode: 'reapply-v2', start, size: slice.length, items: slice }, null, 2)
  );
  saveReapplyProgress(progress);
  console.log(
    JSON.stringify({ done: false, start, batchSize: slice.length, total: patches.length, out: BATCH_OUT })
  );
} else if (cmd === 'record-reapply-results') {
  const results = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
  const progress = loadReapplyProgress();
  for (const r of results) {
    if (!r.ok) {
      progress.failed.push(r);
    }
  }
  progress.nextIndex = (progress.nextIndex ?? 0) + results.length;
  progress.lastCheckpointAt = new Date().toISOString();
  saveReapplyProgress(progress);
  console.log(
    JSON.stringify({
      nextIndex: progress.nextIndex,
      total: progress.total,
      failed: progress.failed.length,
      done: progress.nextIndex >= progress.total,
    })
  );
} else if (cmd === 'export-current-batch-slim') {
  const batch = JSON.parse(fs.readFileSync(BATCH_OUT, 'utf8'));
  const outDir = path.join(ROOT, '.docstar-param-mcp-out');
  const slim = (batch.items ?? []).map((item) => {
    const fp = path.join(outDir, `${item.endpointId}.json`);
    const a = fs.existsSync(fp)
      ? JSON.parse(fs.readFileSync(fp, 'utf8'))
      : item.args;
    return {
      endpointId: item.endpointId,
      args: {
        orgId: a.orgId,
        endpointId: a.endpointId,
        description: a.description,
        params: a.params,
        body: a.body,
        ...(a.bodyDescription != null && Object.keys(a.bodyDescription).length > 0
          ? { bodyDescription: a.bodyDescription }
          : {}),
      },
    };
  });
  console.log(JSON.stringify(slim));
} else if (cmd === 'summary') {
  const progress = loadProgress();
  saveProgress(progress);
  const summary = {
    completedAt: new Date().toISOString(),
    status: progress.ok >= progress.total ? 'complete' : 'in_progress',
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
  fs.writeFileSync(path.join(ROOT, 'docstar-param-doc-upload-summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} else {
  console.error(
    'prepare-batch | prepare-missing-batch | prepare-reapply-batch | export-current-batch-slim | record-results | record-missing-results | record-reapply-results | load-batch-args | summary'
  );
  process.exit(1);
}
