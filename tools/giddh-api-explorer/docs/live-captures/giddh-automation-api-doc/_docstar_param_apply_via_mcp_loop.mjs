#!/usr/bin/env node
/**
 * Record batch MCP results + checkpoint every 50 ok.
 * Usage: node _docstar_param_apply_via_mcp_loop.mjs record '<json array>'
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');
const SUMMARY = path.join(ROOT, 'docstar-param-doc-upload-summary.json');

function loadProgress() {
  if (!fs.existsSync(PROGRESS)) {
    return { ok: 0, failed: [], updatedIds: [], nextIndex: 0, total: 720 };
  }
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

const cmd = process.argv[2];

if (cmd === 'record') {
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
  if (Math.floor(progress.ok / 50) > Math.floor(prevOk / 50)) {
    progress.lastCheckpointAt = new Date().toISOString();
  }
  saveProgress(progress);
  console.log(JSON.stringify({ ok: progress.ok, failed: progress.failed.length, nextIndex: progress.nextIndex }));
} else if (cmd === 'summary') {
  const progress = loadProgress();
  const summary = {
    completedAt: new Date().toISOString(),
    updateMethod: 'user-docstar MCP update_endpoint',
    orgId: '83427',
    collectionId: '-Jey39dCAAyx',
    rootParentId: 'u9XDYe5Zc_ds',
    total: progress.total ?? 720,
    ok: progress.ok,
    failedCount: progress.failed.length,
    failed: progress.failed,
    updatedIds: progress.updatedIds,
    nextIndex: progress.nextIndex,
  };
  fs.writeFileSync(SUMMARY, JSON.stringify(summary, null, 2));
  console.log(JSON.stringify({ written: SUMMARY, ok: progress.ok, failed: progress.failed.length }));
} else if (cmd === 'publish-ids') {
  const progress = loadProgress();
  const pageIds = [...new Set([...progress.updatedIds, 'u9XDYe5Zc_ds'])];
  console.log(JSON.stringify(pageIds));
} else {
  console.error('record | summary | publish-ids');
  process.exit(1);
}
