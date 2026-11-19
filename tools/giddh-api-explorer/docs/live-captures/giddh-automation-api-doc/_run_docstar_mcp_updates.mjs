#!/usr/bin/env node
/**
 * Apply all batch + missing updates via DocStar REST (same body as update_endpoint MCP).
 * Requires DOCSTAR_HM_TOKEN env or /tmp/docstar-hm-token (hm_ bearer).
 * MCP path: agent calls update_endpoint per item when no token is available.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const API = 'https://api.docstar.io';
const ORG = '83427';
const COLLECTION = '-Jey39dCAAyx';
const ROOT_PARENT = 'u9XDYe5Zc_ds';
const PACE_MS = 120;

const token =
  process.env.DOCSTAR_HM_TOKEN?.trim() ||
  (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');

if (!token) {
  console.error('No DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token');
  process.exit(2);
}

const work = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-mcp-work-full.json'), 'utf8')).work;
const start = Number(process.env.START || 0);
const limit = process.env.LIMIT ? Number(process.env.LIMIT) : work.length;

const slice = work.slice(start, start + limit);
const progressPath = path.join(ROOT, '.docstar-mcp-run-progress.json');
let progress = fs.existsSync(progressPath)
  ? JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  : { ok: 0, failed: [], updatedIds: [] };

async function putEndpoint(item) {
  const body = { description: item.description };
  if (item.sampleResponse != null) body.sampleResponse = item.sampleResponse;
  const res = await fetch(`${API}/orgs/${ORG}/endpoints/${item.endpointId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 GiddhDocStarMcpRunner',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 300) };
  }
  return { status: res.status, ok: res.ok, data };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

for (let i = 0; i < slice.length; i++) {
  const item = slice[i];
  try {
    const result = await putEndpoint(item);
    if (result.ok) {
      progress.ok += 1;
      progress.updatedIds.push(item.endpointId);
    } else {
      progress.failed.push({
        endpointId: item.endpointId,
        name: item.name,
        phase: item.phase,
        status: result.status,
        error: result.data,
      });
    }
  } catch (e) {
    progress.failed.push({
      endpointId: item.endpointId,
      name: item.name,
      phase: item.phase,
      error: String(e),
    });
  }
  if ((i + 1) % 25 === 0) {
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
    console.log(`progress ${start + i + 1}/${work.length} ok=${progress.ok} failed=${progress.failed.length}`);
  }
  await sleep(PACE_MS);
}

fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

async function publishChunks(pageIds) {
  const unique = [...new Set([ROOT_PARENT, ...pageIds])];
  const chunkSize = 200;
  const results = [];
  for (let i = 0; i < unique.length; i += chunkSize) {
    const chunk = unique.slice(i, i + chunkSize);
    if (!chunk.includes(ROOT_PARENT)) chunk.unshift(ROOT_PARENT);
    const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds: chunk }),
    });
    const data = await res.json().catch(() => ({}));
    results.push({ status: res.status, ok: res.ok, count: chunk.length, data });
    await sleep(PACE_MS);
  }
  return results;
}

if (process.env.PUBLISH === '1' && progress.updatedIds.length) {
  progress.publish = await publishChunks(progress.updatedIds);
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

const summary = {
  orgId: ORG,
  collectionId: COLLECTION,
  batchEndpointCount: work.filter((w) => w.phase === 'batch').length,
  missingSampleCount: work.filter((w) => w.phase === 'missing').length,
  totalWork: work.length,
  updatedOk: progress.ok,
  failedCount: progress.failed.length,
  publish: progress.publish ?? null,
  completedAt: new Date().toISOString(),
  via: 'rest-hm-token',
};

fs.writeFileSync(
  path.join(ROOT, 'docstar-public-descriptions-summary.json'),
  JSON.stringify({ summary, failed: progress.failed }, null, 2)
);
console.log(JSON.stringify(summary));
