#!/usr/bin/env node
/**
 * Helper for DocStar MCP bulk updates: slice queue/manifest, normalize match, write progress.
 * MCP update_endpoint calls are made by the agent (this script only prepares batches & records results).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const QUEUE_PATH = path.join(ROOT, 'docstar-description-update-queue.json');
const MANIFEST_PATH = path.join(ROOT, '.docstar-batches/manifest.json');
const PROGRESS_PATH = path.join(ROOT, '.docstar-mcp-progress.json');
const ORG = '83427';

const PRE_DONE = new Set([
  'cID-ACZxWiQG',
  'EmEnTqeX3sxv',
  'joqNLkayh9hj',
  'mX4ZZTedcbQP',
  'D_v7qcWSuXqE',
  'JHcSRhSJEpBo',
]);

function normDesc(v) {
  return typeof v === 'string' ? v.trim() : '';
}

function normSamples(samples) {
  if (!Array.isArray(samples)) return '';
  return JSON.stringify(samples, Object.keys(samples).sort());
}

function patchFromItem(item) {
  const patch = { description: item.description };
  if (item.sampleResponse != null) patch.sampleResponse = item.sampleResponse;
  return patch;
}

export function matchesCurrent(current, patch) {
  if (normDesc(current?.description) !== normDesc(patch.description)) return false;
  if ('sampleResponse' in patch) {
    return normSamples(current?.sampleResponse) === normSamples(patch.sampleResponse);
  }
  return true;
}

function loadProgress() {
  if (!fs.existsSync(PROGRESS_PATH)) {
    return { phase: 'queue', nextIndex: 0, ok: 0, skipped: 0, failed: [] };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2));
}

function buildWorkItems() {
  const doc = JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8'));
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
  const queue = doc.queue;
  const queueItems = queue.map((item, i) => ({
    kind: 'queue',
    index: i,
    endpointId: item.endpointId,
    name: item.name,
    args: {
      orgId: ORG,
      endpointId: item.endpointId,
      description: item.description,
      ...(item.sampleResponse != null ? { sampleResponse: item.sampleResponse } : {}),
    },
    patch: patchFromItem(item),
  }));

  const queueIds = new Set(queue.map((x) => x.endpointId));
  const missing = (doc.missingSample || []).filter((m) => !queueIds.has(m.id));
  const missingItems = missing.map((m) => ({
    kind: 'missing',
    endpointId: m.id,
    name: m.name,
    args: {
      orgId: ORG,
      endpointId: m.id,
      description: `${m.name}. Part of the Giddh API. Requires Auth-Key or Session-Id.`,
    },
    patch: {
      description: `${m.name}. Part of the Giddh API. Requires Auth-Key or Session-Id.`,
    },
  }));

  return { queueItems, missingItems, missingCount: doc.missingCount, doc };
}

function recordResults(results) {
  const p = loadProgress();
  for (const r of results) {
    if (r.error) {
      p.failed.push({ endpointId: r.endpointId, error: String(r.error).slice(0, 500) });
    } else if (r.skipped) p.skipped += 1;
    else p.ok += 1;
  }
  if (typeof results.nextIndex === 'number') p.nextIndex = results.nextIndex;
  if (results.phase) p.phase = results.phase;
  saveProgress(p);
  return p;
}

const cmd = process.argv[2];

if (cmd === 'stats') {
  const { queueItems, missingItems } = buildWorkItems();
  const p = loadProgress();
  console.log(
    JSON.stringify({
      queueTotal: queueItems.length,
      missingInSample: missingItems.length,
      progress: p,
      preDone: [...PRE_DONE],
    })
  );
} else if (cmd === 'batch') {
  const size = Number(process.argv[3] || 5);
  const start = Number(process.argv[4] ?? loadProgress().nextIndex ?? 0);
  const phase = process.argv[5] || loadProgress().phase || 'queue';
  const { queueItems, missingItems } = buildWorkItems();
  const list = phase === 'missing' ? missingItems : queueItems;
  const slice = list.slice(start, start + size);
  console.log(JSON.stringify({ phase, start, nextStart: start + slice.length, size: slice.length, items: slice }));
} else if (cmd === 'record') {
  const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  const p = recordResults(payload);
  console.log(JSON.stringify(p));
} else if (cmd === 'publish-ids') {
  const { queueItems } = buildWorkItems();
  const ids = [...new Set([...queueItems.map((x) => x.endpointId), 'u9XDYe5Zc_ds'])];
  console.log(JSON.stringify({ orgId: ORG, collectionId: '-Jey39dCAAyx', rootParentId: 'u9XDYe5Zc_ds', pageIds: ids }));
} else if (cmd === 'finalize') {
  const p = loadProgress();
  const summary = {
    orgId: ORG,
    collectionId: '-Jey39dCAAyx',
    queueTotal: JSON.parse(fs.readFileSync(QUEUE_PATH, 'utf8')).queue.length,
    updatedOk: p.ok,
    skippedIdentical: p.skipped,
    failedCount: p.failed.length,
    publish: p.publish || null,
  };
  fs.writeFileSync(
    path.join(ROOT, 'docstar-public-descriptions-summary.json'),
    JSON.stringify({ summary, failed: p.failed, progress: p }, null, 2)
  );
  console.log(JSON.stringify(summary));
} else {
  console.error('Usage: batch|record|publish-ids|finalize|stats');
  process.exit(1);
}
