#!/usr/bin/env node
/**
 * Reapply all docstar-param-doc-patches.json to DocStar (production catalog refresh).
 * Same payload as MCP update_endpoint. DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token.
 * Optional START, LIMIT, PUBLISH=1.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PATCHES_FILE = path.join(ROOT, 'docstar-param-doc-patches.json');
const REAPPLY_PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');
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
  console.error('Invalid DocStar token (need real hm_ bearer from DocStar API settings).');
  process.exit(2);
}

const patches = JSON.parse(fs.readFileSync(PATCHES_FILE, 'utf8')).patches ?? [];

let progress = fs.existsSync(REAPPLY_PROGRESS)
  ? JSON.parse(fs.readFileSync(REAPPLY_PROGRESS, 'utf8'))
  : { nextIndex: 0, total: patches.length, failed: [], note: 'production v2 reapply' };
progress.total = patches.length;

const start = process.env.START != null ? Number(process.env.START) : (progress.nextIndex ?? 0);
const limit = process.env.LIMIT ? Number(process.env.LIMIT) : patches.length - start;
const slice = patches.slice(start, start + limit);

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
      'User-Agent': 'Mozilla/5.0 GiddhDocParamReapply',
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

let okInRun = 0;
for (let i = 0; i < slice.length; i++) {
  const item = slice[i];
  try {
    const result = await putEndpoint(item);
    if (result.ok) {
      okInRun += 1;
      progress.nextIndex = start + i + 1;
      if (okInRun % 25 === 0) {
        progress.lastCheckpointAt = new Date().toISOString();
        fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(progress, null, 2));
        console.log(`checkpoint nextIndex=${progress.nextIndex}/${patches.length} failed=${progress.failed.length}`);
      }
    } else {
      progress.failed.push({
        endpointId: item.endpointId,
        catalogKey: item.catalogKey,
        status: result.status,
        error: result.data,
      });
      progress.nextIndex = start + i + 1;
      fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(progress, null, 2));
    }
  } catch (e) {
    progress.failed.push({ endpointId: item.endpointId, catalogKey: item.catalogKey, error: String(e) });
    progress.nextIndex = start + i + 1;
    fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(progress, null, 2));
  }
  await sleep(PACE_MS);
}

progress.nextIndex = start + slice.length;
fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(progress, null, 2));

if (process.env.PUBLISH === '1' && progress.nextIndex >= patches.length && progress.failed.length === 0) {
  const pageIds = [...new Set([ROOT_PARENT, ...patches.map((p) => p.endpointId)])];
  const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds }),
  });
  progress.publish = { status: res.status, ok: res.ok };
  fs.writeFileSync(REAPPLY_PROGRESS, JSON.stringify(progress, null, 2));
}

const summary = {
  orgId: ORG,
  collectionId: COLLECTION,
  total: patches.length,
  nextIndex: progress.nextIndex,
  okThisRun: okInRun,
  failedCount: progress.failed.length,
  updateMethod: 'production reapply (REST PUT = update_endpoint)',
  completedAt: new Date().toISOString(),
  publish: progress.publish,
};
fs.writeFileSync(
  path.join(ROOT, 'docstar-param-reapply-summary.json'),
  JSON.stringify({ summary, failed: progress.failed }, null, 2),
);
console.log(JSON.stringify(summary));
