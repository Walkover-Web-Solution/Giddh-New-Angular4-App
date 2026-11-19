#!/usr/bin/env node
/**
 * Create API guide pages from .docstar-api-guides-singles-mcp-remaining.json
 * via DocStar MCP create_page. Appends .docstar-api-guides-singles-create-progress.jsonl
 * Auth: DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local (Bearer …)
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const TODO = path.join(ROOT, '.docstar-api-guides-singles-mcp-remaining.json');
const PROGRESS = path.join(ROOT, '.docstar-api-guides-singles-create-progress.jsonl');
const MCP_URL = process.env.DOCSTAR_MCP_URL || 'https://mcp.docstar.io/mcp';
const PACE_MS = Number(process.env.PACE_MS || 100);

let auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth) {
  const bearerPath = path.join(ROOT, '.docstar-mcp-bearer.local');
  if (fs.existsSync(bearerPath)) auth = fs.readFileSync(bearerPath, 'utf8').trim();
}
if (!auth) {
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local required' }));
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function loadDone() {
  const done = new Set();
  if (!fs.existsSync(PROGRESS)) return done;
  for (const line of fs.readFileSync(PROGRESS, 'utf8').split('\n')) {
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

function append(row) {
  fs.appendFileSync(PROGRESS, `${JSON.stringify(row)}\n`);
}

async function main() {
  const done = loadDone();
  const items = JSON.parse(fs.readFileSync(TODO, 'utf8')).filter((x) => !done.has(x.urlName));
  if (!items.length) {
    console.log(JSON.stringify({ ok: true, created: 0, message: 'nothing to do' }));
    return;
  }

  const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
    requestInit: { headers: { Authorization: auth } },
  });
  const client = new Client({ name: 'giddh-singles-create', version: '1.0.0' }, { capabilities: {} });
  await client.connect(transport);

  let ok = 0;
  let fail = 0;
  for (const args of items) {
    await sleep(PACE_MS);
    try {
      const res = await client.callTool({ name: 'create_page', arguments: args });
      const text = res.content?.find((c) => c.type === 'text')?.text;
      if (res.isError) {
        append({ urlName: args.urlName, id: null, ok: false, error: text || res });
        fail++;
        continue;
      }
      const data = text ? JSON.parse(text) : res.structuredContent;
      const id = data?.page?.id ?? data?.id ?? null;
      append({ urlName: args.urlName, id, ok: Boolean(id) });
      if (id) ok++;
      else fail++;
    } catch (e) {
      append({ urlName: args.urlName, id: null, ok: false, error: String(e) });
      fail++;
    }
  }

  await client.close();
  console.log(JSON.stringify({ ok: fail === 0, created: ok, failed: fail }));
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
