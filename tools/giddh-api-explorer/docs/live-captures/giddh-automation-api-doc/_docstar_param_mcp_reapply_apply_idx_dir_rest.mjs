#!/usr/bin/env node
/**
 * Apply .q/mcp-batch-idx/*.json via DocStar REST PUT (same payload as update_endpoint).
 * Auth: DOCSTAR_MCP_AUTHORIZATION, .docstar-mcp-bearer.local, or DOCSTAR_HM_TOKEN / /tmp/docstar-hm-token
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const API = 'https://api.docstar.io';
const ORG = '83427';
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
  console.error(JSON.stringify({ error: 'No DocStar bearer (DOCSTAR_MCP_AUTHORIZATION, .docstar-mcp-bearer.local, or DOCSTAR_HM_TOKEN)' }));
  process.exit(1);
}

const dir = path.join(ROOT, '.q/mcp-batch-idx');
const startIdx = Number(process.argv[2] ?? 0);
const endIdx = Number(process.argv[3] ?? 49);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let ok = 0;
const failed = [];

for (let i = startIdx; i <= endIdx; i++) {
  const fp = path.join(dir, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  const args = JSON.parse(fs.readFileSync(fp, 'utf8'));
  const { orgId = ORG, endpointId, ...body } = args;
  const url = `${API}/orgs/${orgId}/endpoints/${endpointId}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: { Authorization: auth, 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) failed.push({ i, endpointId, status: res.status, message: data.message ?? data.error });
    else ok++;
  } catch (e) {
    failed.push({ i, endpointId, error: String(e) });
  }
  await sleep(PACE_MS);
}

console.log(JSON.stringify({ ok, failed: failed.length, failedSample: failed.slice(0, 5) }));
process.exit(failed.length ? 1 : 0);
