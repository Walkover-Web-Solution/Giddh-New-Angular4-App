#!/usr/bin/env node
/** Slice batch files / queue for DocStar MCP update_endpoint runs; classify responses. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PROGRESS = path.join(ROOT, '.docstar-mcp-progress.json');
const QUEUE_PATH = path.join(ROOT, 'docstar-description-update-queue.json');
const BATCH_DIR = path.join(ROOT, '.docstar-batches');

const PRE_DONE = new Set([
  'cID-ACZxWiQG',
  'EmEnTqeX3sxv',
  'joqNLkayh9hj',
  'mX4ZZTedcbQP',
  'D_v7qcWSuXqE',
  'JHcSRhSJEpBo',
]);

function loadProgress() {
  if (!fs.existsSync(PROGRESS)) {
    return {
      phase: 'queue',
      batchIndex: 0,
      itemOffset: 0,
      ok: 0,
      skipped: 0,
      failed: [],
    };
  }
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

function normDesc(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function normSamples(samples) {
  if (!Array.isArray(samples)) return '';
  return JSON.stringify(samples);
}

export function classifyResponse(item, response) {
  const patch = {
    description: item.description,
    ...(item.sampleResponse != null ? { sampleResponse: item.sampleResponse } : {}),
  };
  const matched =
    normDesc(response?.description) === normDesc(patch.description) &&
    (!('sampleResponse' in patch) ||
      normSamples(response?.sampleResponse) === normSamples(patch.sampleResponse));
  return matched ? 'skipped' : 'ok';
}

function allBatchFiles() {
  return fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort();
}

function itemToArgs(item) {
  const args = {
    orgId: '83427',
    endpointId: item.endpointId,
    description: item.description,
  };
  if (item.sampleResponse != null) args.sampleResponse = item.sampleResponse;
  return args;
}

function loadMissingWork() {
  const doc = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const queueIds = new Set(doc.queue.map((x) => x.endpointId));
  const items = [];
  for (const m of doc.missingSample || []) {
    if (queueIds.has(m.id)) continue;
    items.push({
      endpointId: m.id,
      name: m.name,
      description: `${m.name}. Part of the Giddh API. Requires Auth-Key or Session-Id.`,
    });
  }
  return { items, missingCount: doc.missingCount };
}

const cmd = process.argv[2];

if (cmd === 'next') {
  const size = Number(process.argv[3] || 5);
  const p = loadProgress();
  if (p.phase === 'missing') {
    const { items } = loadMissingWork();
    const slice = items.slice(p.itemOffset || 0, (p.itemOffset || 0) + size);
    console.log(
      JSON.stringify({
        phase: 'missing',
        batchIndex: p.batchIndex,
        itemOffset: p.itemOffset || 0,
        items: slice.map((item) => ({ item, args: itemToArgs(item) })),
        done: slice.length === 0,
      })
    );
    process.exit(0);
  }
  const batches = allBatchFiles();
  let bi = p.batchIndex || 0;
  let off = p.itemOffset || 0;
  const out = [];
  while (out.length < size && bi < batches.length) {
    const batch = JSON.parse(fs.readFileSync(path.join(BATCH_DIR, batches[bi]), 'utf8'));
    while (off < batch.length && out.length < size) {
      const item = batch[off];
      off += 1;
      if (PRE_DONE.has(item.endpointId)) continue;
      out.push({ item, args: itemToArgs(item), batchFile: batches[bi] });
    }
    if (off >= batch.length) {
      bi += 1;
      off = 0;
    }
  }
  const done = bi >= batches.length && out.length === 0;
  console.log(
    JSON.stringify({
      phase: 'queue',
      batchIndex: bi,
      itemOffset: off,
      items: out,
      done,
      nextProgress: done ? { phase: 'missing', batchIndex: 0, itemOffset: 0 } : { batchIndex: bi, itemOffset: off },
    })
  );
} else if (cmd === 'advance') {
  const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  const p = loadProgress();
  for (const r of payload.results || []) {
    if (r.status === 'error') p.failed.push({ endpointId: r.endpointId, error: r.error });
    else if (r.status === 'skipped') p.skipped += 1;
    else p.ok += 1;
  }
  if (payload.nextProgress) {
    Object.assign(p, payload.nextProgress);
    if (payload.nextProgress.phase) p.phase = payload.nextProgress.phase;
  }
  if (payload.phaseComplete === 'queue') {
    p.phase = 'missing';
    p.batchIndex = 0;
    p.itemOffset = 0;
  }
  saveProgress(p);
  console.log(JSON.stringify(p));
} else if (cmd === 'publish-args') {
  const doc = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const pageIds = [...new Set([...doc.queue.map((x) => x.endpointId), 'u9XDYe5Zc_ds'])];
  console.log(
    JSON.stringify({
      orgId: '83427',
      collectionId: '-Jey39dCAAyx',
      rootParentId: 'u9XDYe5Zc_ds',
      pageIds,
    })
  );
} else if (cmd === 'finalize') {
  const p = loadProgress();
  const summary = {
    orgId: '83427',
    collectionId: '-Jey39dCAAyx',
    queueTotal: JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8')).queue.length,
    updatedOk: p.ok,
    skippedIdentical: p.skipped,
    failedCount: p.failed.length,
    publish: p.publish ?? null,
  };
  fs.writeFileSync(
    path.join(ROOT, 'docstar-public-descriptions-summary.json'),
    JSON.stringify({ summary, failed: p.failed, progress: p }, null, 2)
  );
  console.log(JSON.stringify(summary));
} else {
  console.error('Usage: next [size] | advance (stdin) | publish-args | finalize');
  process.exit(1);
}
