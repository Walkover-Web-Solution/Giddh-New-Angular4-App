#!/usr/bin/env node
/**
 * Bulk create API guide pages via DocStar REST POST /orgs/:orgId/pages/:pageId
 * DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token. Writes .docstar-api-guides-direct-results.jsonl
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CREATE_DIR = path.join(ROOT, '.docstar-param-mcp-out/api-guides-create');
const RESULTS = path.join(ROOT, '.docstar-api-guides-direct-results.jsonl');
const API = 'https://api.docstar.io';
const PARENT = 'meihjCKoWw2i';
const ORG = '83427';
const COLLECTION = '-Jey39dCAAyx';
const ROOT_PARENT = 'u9XDYe5Zc_ds';
const PACE_MS = Number(process.env.PACE_MS || 90);
const CONCURRENCY = Number(process.env.CONCURRENCY || 5);

const SKIP = new Set([
  'guide-branch',
  'guide-account',
  'guide-address',
  'guide-advance-receipt',
  'guide-audit',
  'guide-auth',
  'guide-banking',
  'getting-started',
]);

const token =
  process.env.DOCSTAR_HM_TOKEN?.trim() ||
  (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');

if (!token) {
  console.error('No DOCSTAR_HM_TOKEN or /tmp/docstar-hm-token');
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadDone() {
  const done = new Set();
  if (!fs.existsSync(RESULTS)) return done;
  for (const line of fs.readFileSync(RESULTS, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const o = JSON.parse(line);
      if (o.ok) done.add(o.urlName);
    } catch {
      /* ignore */
    }
  }
  return done;
}

function loadTodo() {
  const done = loadDone();
  const files = fs
    .readdirSync(CREATE_DIR)
    .filter((f) => /^[0-9].*\.json$/.test(f))
    .sort();
  const todo = [];
  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(path.join(CREATE_DIR, f), 'utf8'));
    if (SKIP.has(d.urlName) || done.has(d.urlName)) continue;
    todo.push(d);
  }
  return todo;
}

function appendResult(row) {
  fs.appendFileSync(RESULTS, `${JSON.stringify(row)}\n`);
}

async function createPage(item) {
  const body = {
    name: item.name,
    urlName: item.urlName,
    state: item.state,
    contents: item.contents,
  };
  const res = await fetch(`${API}/orgs/${ORG}/pages/${PARENT}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'Mozilla/5.0 GiddhApiGuidesRunner',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }
  const id = data?.page?.id ?? data?.id ?? null;
  return { urlName: item.urlName, id, ok: res.ok && Boolean(id), status: res.status, error: res.ok ? undefined : data };
}

async function runPool(items) {
  const createdIds = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map((item) => createPage(item)));
    for (const r of results) {
      appendResult({ urlName: r.urlName, id: r.id, ok: r.ok });
      if (r.ok && r.id) createdIds.push(r.id);
      else console.error('FAIL', r.urlName, r.status, JSON.stringify(r.error)?.slice(0, 200));
    }
    console.log(`progress ${Math.min(i + CONCURRENCY, items.length)}/${items.length}`);
    await sleep(PACE_MS);
  }
  return createdIds;
}

async function bulkPublish(pageIds) {
  const all = [...new Set([PARENT, ...pageIds])];
  const chunks = [];
  for (let i = 0; i < all.length; i += 40) {
    chunks.push(all.slice(i, i + 40));
  }
  for (const pageIdsChunk of chunks) {
    const res = await fetch(`${API}/orgs/${ORG}/collections/${COLLECTION}/bulkPublish`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0 GiddhApiGuidesRunner',
      },
      body: JSON.stringify({ rootParentId: ROOT_PARENT, pageIds: pageIdsChunk }),
    });
    const text = await res.text();
    console.log('publish chunk', pageIdsChunk.length, res.status, text.slice(0, 120));
    if (!res.ok) return { ok: false, status: res.status, body: text };
  }
  return { ok: true };
}

async function main() {
  const todo = loadTodo();
  console.log('todo', todo.length);
  let createdIds = [];
  if (todo.length > 0) {
    createdIds = await runPool(todo);
  }
  const lines = fs.existsSync(RESULTS)
    ? fs.readFileSync(RESULTS, 'utf8').trim().split('\n').filter(Boolean)
    : [];
  let ok = 0;
  let failed = 0;
  const allIds = [];
  for (const line of lines) {
    const o = JSON.parse(line);
    if (o.ok) {
      ok += 1;
      if (o.id) allIds.push(o.id);
    } else failed += 1;
  }
  const publish = await bulkPublish(allIds);
  console.log(JSON.stringify({ ok, failed, publishOk: publish.ok, createdThisRun: createdIds.length }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
