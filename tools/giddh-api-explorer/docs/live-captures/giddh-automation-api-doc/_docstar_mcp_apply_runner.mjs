#!/usr/bin/env node
/**
 * Drive DocStar param batch apply via REST (same payload as MCP update_endpoint).
 * Uses DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token. Writes progress every 25 ok.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const QUEUE = path.join(ROOT, '.docstar-param-mcp-queue.json');
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');
const SUMMARY = path.join(ROOT, 'docstar-param-doc-upload-summary.json');
const API = 'https://api.docstar.io';
const ORG = '83427';
const COLLECTION = '-Jey39dCAAyx';
const ROOT_PARENT = 'u9XDYe5Zc_ds';
const PACE_MS = Number(process.env.PACE_MS || 100);

const token =
  process.env.DOCSTAR_HM_TOKEN?.trim() ||
  (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');

if (!token) {
  console.error('Missing DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token');
  process.exit(2);
}

const queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
const start = Number(process.env.START || 0);
const end = process.env.END ? Number(process.env.END) : queue.length;
const slice = queue.slice(start, end);

let progress = fs.existsSync(PROGRESS)
  ? JSON.parse(fs.readFileSync(PROGRESS, 'utf8'))
  : { ok: 0, failed: [], updatedIds: [] };

function putBody(args) {
  const body = {};
  if (args.description != null) body.description = args.description;
  if (args.params != null) body.params = args.params;
  if (args.body != null) body.body = args.body;
  if (args.bodyDescription != null && Object.keys(args.bodyDescription).length > 0) {
    body.bodyDescription = args.bodyDescription;
  }
  return body;
}

function writeProgress() {
  fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

for (let i = 0; i < slice.length; i++) {
  const item = slice[i];
  const { endpointId, args } = item;
  const body = putBody(args);
  try {
    const res = await fetch(`${API}/orgs/${ORG}/endpoints/${endpointId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 GiddhDocParamMcpRunner',
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
    if (res.ok) {
      progress.ok += 1;
      progress.updatedIds.push(endpointId);
    } else {
      progress.failed.push({
        endpointId,
        catalogKey: item.catalogKey,
        status: res.status,
        error: data,
      });
    }
  } catch (e) {
    progress.failed.push({ endpointId, catalogKey: item.catalogKey, error: String(e) });
  }

  if (progress.ok > 0 && progress.ok % 25 === 0) {
    writeProgress();
    console.log(`checkpoint ok=${progress.ok} fail=${progress.failed.length} idx=${start + i + 1}`);
  }
  await sleep(PACE_MS);
}

writeProgress();

if (process.env.PUBLISH === '1' && end >= queue.length && progress.updatedIds.length) {
  const pageIds = [...new Set([...progress.updatedIds, ROOT_PARENT])];
  const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds }),
  });
  const publishText = await res.text();
  let publishData;
  try {
    publishData = publishText ? JSON.parse(publishText) : {};
  } catch {
    publishData = { raw: publishText.slice(0, 400) };
  }
  progress.publish = { status: res.status, ok: res.ok, data: publishData };
  writeProgress();

  const summary = {
    total: queue.length,
    updated: progress.ok,
    failed: progress.failed.length,
    publishStatus: res.status,
    completedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    SUMMARY,
    JSON.stringify({ summary, failed: progress.failed, publish: publishData }, null, 2),
  );
  console.log(JSON.stringify(summary));
} else {
  console.log(
    JSON.stringify({
      processed: slice.length,
      ok: progress.ok,
      failed: progress.failed.length,
      range: [start, end],
    }),
  );
}
