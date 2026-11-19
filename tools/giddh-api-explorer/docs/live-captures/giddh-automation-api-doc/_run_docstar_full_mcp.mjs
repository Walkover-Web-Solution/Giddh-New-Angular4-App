#!/usr/bin/env node
/**
 * Flatten queue + missing into work list; drive .docstar-mcp-progress.json batchIndex/itemOffset.
 * Agent calls: node _run_docstar_full_mcp.mjs slice 5
 * then update_endpoint for each args; then node _run_docstar_full_mcp.mjs record '<json>'
 */
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
    return { workIndex: 0, ok: 0, skipped: 0, failed: [], phase: 'queue' };
  }
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

function buildWorkList() {
  const batches = fs
    .readdirSync(BATCH_DIR)
    .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
    .sort()
    .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

  const queueItems = batches.map((item) => ({
    kind: 'queue',
    endpointId: item.endpointId,
    item,
    args: {
      orgId: '83427',
      endpointId: item.endpointId,
      description: item.description,
      ...(item.sampleResponse != null ? { sampleResponse: item.sampleResponse } : {}),
    },
  }));

  const doc = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const queueIds = new Set(doc.queue.map((x) => x.endpointId));
  const missing = (doc.missingSample || [])
    .filter((m) => !queueIds.has(m.id))
    .map((m) => {
      const description = `${m.name}. Part of the Giddh API. Requires Auth-Key or Session-Id.`;
      return {
        kind: 'missing',
        endpointId: m.id,
        item: { endpointId: m.id, name: m.name, description },
        args: { orgId: '83427', endpointId: m.id, description },
      };
    });

  return [...queueItems, ...missing];
}

function normDesc(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function normSamples(samples) {
  if (!Array.isArray(samples)) return '';
  return JSON.stringify(samples);
}

export function classify(item, response) {
  const patch = item.item;
  const descOk = normDesc(response?.description) === normDesc(patch.description);
  const samplesOk =
    patch.sampleResponse == null ||
    normSamples(response?.sampleResponse) === normSamples(patch.sampleResponse);
  return descOk && samplesOk ? 'skipped' : 'ok';
}

const isMain =
  process.argv[1] &&
  path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);

const cmd = process.argv[2];

if (!isMain) {
  // imported as module
} else if (cmd === 'slice') {
  const size = Number(process.argv[3] || 5);
  const p = loadProgress();
  const work = buildWorkList();
  const start = p.workIndex || 0;
  const slice = [];
  for (let i = start; i < work.length && slice.length < size; i++) {
    const w = work[i];
    if (PRE_DONE.has(w.endpointId)) continue;
    slice.push({ workIndex: i, ...w });
  }
  const nextIndex = slice.length ? slice[slice.length - 1].workIndex + 1 : start;
  console.log(
    JSON.stringify({
      total: work.length,
      start,
      nextIndex,
      done: nextIndex >= work.length && slice.length === 0,
      items: slice,
    })
  );
} else if (cmd === 'record') {
  const payload = JSON.parse(process.argv[3] || fs.readFileSync(0, 'utf8'));
  const p = loadProgress();
  for (const r of payload.results) {
    if (r.status === 'error') p.failed.push({ endpointId: r.endpointId, error: r.error });
    else if (r.status === 'skipped') p.skipped += 1;
    else p.ok += 1;
  }
  p.workIndex = payload.nextIndex ?? p.workIndex;
  saveProgress(p);
  console.log(JSON.stringify(p));
} else if (cmd === 'publish-args') {
  const doc = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const pageIds = [...new Set([...doc.queue.map((x) => x.endpointId), 'u9XDYe5Zc_ds'])];
  console.log(JSON.stringify({ orgId: '83427', collectionId: '-Jey39dCAAyx', rootParentId: 'u9XDYe5Zc_ds', pageIds }));
} else if (cmd === 'finalize') {
  const p = loadProgress();
  const summary = {
    orgId: '83427',
    collectionId: '-Jey39dCAAyx',
    queueTotal: JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8')).queue.length,
    workTotal: buildWorkList().length,
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
} else if (cmd === 'stats') {
  const work = buildWorkList();
  console.log(JSON.stringify({ workTotal: work.length, progress: loadProgress() }));
} else if (isMain) {
  console.error('Usage: slice [n] | record | publish-args | finalize | stats');
  process.exit(1);
}
