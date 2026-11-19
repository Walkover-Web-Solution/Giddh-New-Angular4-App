#!/usr/bin/env node
/**
 * Apply .docstar-param-batches/batch-*.json to DocStar REST (params, body, bodyDescription).
 * DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token. Optional START, LIMIT, PUBLISH=1.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH_DIR = path.join(ROOT, '.docstar-param-batches');
const API = 'https://api.docstar.io';
const ORG = '83427';
const COLLECTION = '-Jey39dCAAyx';
const ROOT_PARENT = 'u9XDYe5Zc_ds';
const PACE_MS = 90;

const token =
  process.env.DOCSTAR_HM_TOKEN?.trim() ||
  (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');

if (!token) {
  console.error('No DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token');
  process.exit(2);
}
if (
  /YOUR_|ENTER_|placeholder/i.test(token) ||
  !token.startsWith('hm_') ||
  /^hm_[xX.]{6,}$/.test(token) ||
  token.includes('...')
) {
  console.error(
    'Invalid DocStar token: paste your real hm_… bearer from DocStar API settings (not hm_xxxxxxxx... from the docs).'
  );
  process.exit(2);
}

const items = fs
  .readdirSync(BATCH_DIR)
  .filter((f) => f.startsWith('batch-') && f.endsWith('.json'))
  .sort()
  .flatMap((f) => JSON.parse(fs.readFileSync(path.join(BATCH_DIR, f), 'utf8')));

const start = Number(process.env.START || 0);
const limit = process.env.LIMIT ? Number(process.env.LIMIT) : items.length;
const slice = items.slice(start, start + limit);

const progressPath = path.join(ROOT, '.docstar-param-run-progress.json');
let progress = fs.existsSync(progressPath)
  ? JSON.parse(fs.readFileSync(progressPath, 'utf8'))
  : { ok: 0, failed: [], updatedIds: [] };

function patchBody(item) {
  const args = item.args || {};
  const body = {};
  if (args.description != null) body.description = args.description;
  if (args.params != null) body.params = args.params;
  if (args.body != null) body.body = args.body;
  if (args.bodyDescription != null && Object.keys(args.bodyDescription).length > 0) {
    body.bodyDescription = args.bodyDescription;
  }
  return body;
}

async function putEndpoint(item) {
  const body = patchBody(item);
  const res = await fetch(`${API}/orgs/${ORG}/endpoints/${item.endpointId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 GiddhDocParamRunner',
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

let lastCheckpointOk = progress.ok;
for (let i = 0; i < slice.length; i++) {
  const item = slice[i];
  try {
    const result = await putEndpoint(item);
    if (result.ok) {
      progress.ok += 1;
      progress.updatedIds.push(item.endpointId);
      if (progress.ok - lastCheckpointOk >= 25) {
        fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
        console.log(`checkpoint ok=${progress.ok} fail=${progress.failed.length} idx=${start + i + 1}/${items.length}`);
        lastCheckpointOk = progress.ok;
      }
    } else {
      progress.failed.push({
        endpointId: item.endpointId,
        name: item.name,
        catalogKey: item.catalogKey,
        status: result.status,
        error: result.data,
      });
      fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
    }
  } catch (e) {
    progress.failed.push({ endpointId: item.endpointId, name: item.name, catalogKey: item.catalogKey, error: String(e) });
    fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
  }
  await sleep(PACE_MS);
}

fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));

if (process.env.PUBLISH === '1' && progress.updatedIds.length) {
  const unique = [...new Set([ROOT_PARENT, ...progress.updatedIds])];
  const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds: unique }),
  });
  progress.publish = { status: res.status, ok: res.ok };
  fs.writeFileSync(progressPath, JSON.stringify(progress, null, 2));
}

const summary = {
  orgId: ORG,
  collectionId: COLLECTION,
  rootParentId: ROOT_PARENT,
  total: items.length,
  updatedOk: progress.ok,
  failedCount: progress.failed.length,
  updateMethod: 'user-docstar update_endpoint (REST PUT equivalent)',
  completedAt: new Date().toISOString(),
};
fs.writeFileSync(
  path.join(ROOT, 'docstar-param-doc-upload-summary.json'),
  JSON.stringify({ summary, failed: progress.failed, updatedIds: progress.updatedIds, publish: progress.publish }, null, 2),
);
console.log(JSON.stringify(summary));
