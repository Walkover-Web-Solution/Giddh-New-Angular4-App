#!/usr/bin/env node
/**
 * Bulk create API guide pages via DocStar MCP create_page (Streamable HTTP).
 * Writes .docstar-api-guides-direct-results.jsonl and returns created page ids.
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const CREATE_DIR = path.join(ROOT, '.docstar-param-mcp-out/api-guides-create');
const RESULTS = path.join(ROOT, '.docstar-api-guides-direct-results.jsonl');
const MCP_URL = process.env.DOCSTAR_MCP_URL || 'https://mcp.docstar.io/mcp';
const PARENT = 'meihjCKoWw2i';
const ORG = '83427';
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
const PACE_MS = Number(process.env.PACE_MS || 80);
const CONCURRENCY = Number(process.env.CONCURRENCY || 5);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadTodo() {
  const files = fs
    .readdirSync(CREATE_DIR)
    .filter((f) => /^[0-9].*\.json$/.test(f))
    .sort();
  const done = new Set();
  if (fs.existsSync(RESULTS)) {
    for (const line of fs.readFileSync(RESULTS, 'utf8').split('\n')) {
      if (!line.trim()) continue;
      try {
        const o = JSON.parse(line);
        if (o.ok) done.add(o.urlName);
      } catch {
        /* ignore */
      }
    }
  }
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

async function createOne(client, item) {
  const args = {
    orgId: ORG,
    pageId: PARENT,
    name: item.name,
    urlName: item.urlName,
    state: item.state,
    contents: item.contents,
  };
  const res = await client.callTool({ name: 'create_page', arguments: args });
  const text = res.content?.find((c) => c.type === 'text')?.text;
  if (res.isError) {
    return { urlName: item.urlName, id: null, ok: false, error: text || res };
  }
  let data;
  try {
    data = text ? JSON.parse(text) : res.structuredContent;
  } catch {
    data = null;
  }
  const id = data?.page?.id ?? data?.id ?? null;
  const ok = Boolean(id);
  return { urlName: item.urlName, id, ok, error: ok ? undefined : data };
}

async function runPool(client, items) {
  const created = [];
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const chunk = items.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map((item) => createOne(client, item)));
    for (const r of results) {
      appendResult({ urlName: r.urlName, id: r.id, ok: r.ok });
      if (r.ok && r.id) created.push(r.id);
      else console.error('FAIL', r.urlName, r.error);
    }
    console.log(`progress ${Math.min(i + CONCURRENCY, items.length)}/${items.length}`);
    await sleep(PACE_MS);
  }
  return created;
}

async function main() {
  const todo = loadTodo();
  console.log('todo', todo.length);
  if (todo.length === 0) {
    console.log(JSON.stringify({ ok: 0, failed: 0, createdIds: [] }));
    return;
  }
  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));
  const client = new Client({ name: 'giddh-api-guides-bulk', version: '1.0.0' });
  await client.connect(transport);
  const createdIds = await runPool(client, todo);
  const lines = fs.existsSync(RESULTS)
    ? fs.readFileSync(RESULTS, 'utf8').trim().split('\n').filter(Boolean)
    : [];
  let ok = 0;
  let failed = 0;
  for (const line of lines) {
    const o = JSON.parse(line);
    if (o.ok) ok += 1;
    else failed += 1;
  }
  console.log(JSON.stringify({ ok, failed, createdIdsCount: createdIds.length }));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
