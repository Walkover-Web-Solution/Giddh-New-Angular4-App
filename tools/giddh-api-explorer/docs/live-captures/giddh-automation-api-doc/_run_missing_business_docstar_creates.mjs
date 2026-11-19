#!/usr/bin/env node
/**
 * DocStar REST create for missing business/batch endpoints (same as MCP create_endpoint).
 * Auth: DOCSTAR_MCP_AUTHORIZATION, .docstar-mcp-bearer.local, or DOCSTAR_HM_TOKEN / /tmp/docstar-hm-token
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.docstar.io';
const SOURCE = path.join(ROOT, 'docstar-missing-business-docstar-creates.json');
const PROGRESS = path.join(ROOT, '.docstar-missing-business-create-progress.json');
const PACE_MS = 80;

const bearerFile = path.join(ROOT, '.docstar-mcp-bearer.local');
let auth =
  process.env.DOCSTAR_MCP_AUTHORIZATION?.trim() ||
  (fs.existsSync(bearerFile) ? fs.readFileSync(bearerFile, 'utf8').trim() : '');
if (!auth) {
  const hm =
    process.env.DOCSTAR_HM_TOKEN?.trim() ||
    (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');
  if (hm) auth = hm.startsWith('Bearer ') ? hm : `Bearer ${hm}`;
}
if (!auth) {
  console.error(JSON.stringify({ error: 'No DocStar bearer token' }));
  process.exit(1);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { items } = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
let progress = [];
if (fs.existsSync(PROGRESS)) {
  progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}
const doneIndex = new Set(progress.filter((p) => p.endpointId).map((p) => p.index));

const created = [];
const failed = [];

for (let index = 0; index < items.length; index++) {
  if (doneIndex.has(index)) continue;
  const { catalogKey, createArgs } = items[index];
  const { orgId, pageId, ...body } = createArgs;
  const url = `${API}/orgs/${orgId}/pages/${pageId}/endpoints`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 GiddhMissingBusinessDocStar',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    const row = { index, catalogKey, status: res.status };
    if (res.ok && data?.id) {
      row.endpointId = data.id;
      row.status = 'created';
      progress.push(row);
      created.push(row);
    } else {
      row.error = data;
      failed.push(row);
    }
    fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
  } catch (e) {
    failed.push({ index, catalogKey, error: String(e) });
  }
  await sleep(PACE_MS);
}

console.log(JSON.stringify({ created: created.length, failed: failed.length, failedSample: failed.slice(0, 3), endpointIds: created.map((c) => c.endpointId) }));
process.exit(failed.length ? 1 : 0);
