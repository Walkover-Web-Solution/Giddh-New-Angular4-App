#!/usr/bin/env node
/**
 * Bulk apply via DocStar REST using proxy_auth_token (same auth as user-docstar call_any_api).
 * Token: DOCSTAR_PROXY_AUTH_TOKEN env or .docstar-proxy-token (gitignored) one line.
 * Body matches update_endpoint MCP (description + optional sampleResponse).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const API = 'https://api.docstar.io';
const ORG = '83427';
const COLLECTION = '-Jey39dCAAyx';
const ROOT_PARENT = 'u9XDYe5Zc_ds';
const PACE_MS = 120;

const tokenPath = path.join(ROOT, '.docstar-proxy-token');
const token =
  process.env.DOCSTAR_PROXY_AUTH_TOKEN?.trim() ||
  (fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf8').trim() : '');

if (!token) {
  console.error(
    JSON.stringify({
      error: 'missing_token',
      hint: 'Set DOCSTAR_PROXY_AUTH_TOKEN or write token to .docstar-proxy-token',
    })
  );
  process.exit(2);
}

const work = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-mcp-work-full.json'), 'utf8')).work;
const progressPath = path.join(ROOT, '.docstar-mcp-run-progress.json');
const progress = fs.existsSync(progressPath)
  ? JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  : { ok: 0, failed: [], updatedIds: [], lastIndex: 0 };

const start = progress.lastIndex || 0;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function putEndpoint(item) {
  const body = { description: item.description };
  if (item.sampleResponse != null) body.sampleResponse = item.sampleResponse;
  const res = await fetch(`${API}/orgs/${ORG}/endpoints/${item.endpointId}`, {
    method: 'PUT',
    headers: {
      proxy_auth_token: token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 GiddhDocStarBulkApply',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text.slice(0, 400) };
  }
  return { status: res.status, ok: res.ok, data };
}

for (let i = start; i < work.length; i++) {
  const item = work[i];
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
      if (result.status === 401 || result.status === 403) {
        progress.lastIndex = i;
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
        console.error(JSON.stringify({ hardAuthFailure: true, at: i, status: result.status }));
        process.exit(3);
      }
    }
  } catch (e) {
    progress.failed.push({
      endpointId: item.endpointId,
      name: item.name,
      phase: item.phase,
      error: String(e),
    });
  }
  progress.lastIndex = i + 1;
  if ((i + 1) % 25 === 0 || i === work.length - 1) {
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
    console.log(`progress ${i + 1}/${work.length} ok=${progress.ok} failed=${progress.failed.length}`);
  }
  await sleep(PACE_MS);
}

async function publishChunks(pageIds) {
  const unique = [...new Set([ROOT_PARENT, ...pageIds])];
  const chunkSize = 200;
  const results = [];
  for (let i = 0; i < unique.length; i += chunkSize) {
    let chunk = unique.slice(i, i + chunkSize);
    if (!chunk.includes(ROOT_PARENT)) chunk = [ROOT_PARENT, ...chunk];
    const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
      method: 'PATCH',
      headers: {
        proxy_auth_token: token,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds: chunk }),
    });
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      data = { raw: text.slice(0, 400) };
    }
    results.push({ status: res.status, ok: res.ok, count: chunk.length, data });
    await sleep(PACE_MS);
  }
  return results;
}

const publishResults = await publishChunks(progress.updatedIds);
progress.publish = publishResults;
fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

const summary = {
  orgId: ORG,
  collectionId: COLLECTION,
  rootParentId: ROOT_PARENT,
  batchEndpointCount: work.filter((w) => w.phase === 'batch').length,
  missingSampleInMeta: work.filter((w) => w.phase === 'missing').length,
  totalWork: work.length,
  updatedOk: progress.ok,
  failedCount: progress.failed.length,
  publish: publishResults,
  completedAt: new Date().toISOString(),
  method: 'rest-proxy_auth_token-equivalent-to-update_endpoint',
};

fs.writeFileSync(
  path.join(ROOT, 'docstar-public-descriptions-summary.json'),
  JSON.stringify({ summary, failed: progress.failed }, null, 2)
);
console.log(JSON.stringify(summary));
