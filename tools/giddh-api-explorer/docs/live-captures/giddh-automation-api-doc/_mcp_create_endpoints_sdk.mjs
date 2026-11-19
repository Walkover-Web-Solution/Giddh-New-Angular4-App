#!/usr/bin/env node
/**
 * Create DocStar endpoints via MCP create_endpoint (Streamable HTTP to mcp.docstar.io).
 * Requires Cursor MCP OAuth session (run from environment where docstar MCP is connected).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const MCP_URL = 'https://mcp.docstar.io/mcp';
const SOURCE = path.join(ROOT, 'docstar-missing-business-docstar-creates.json');
const PROGRESS = path.join(ROOT, '.docstar-missing-business-create-progress.json');
const ARGS_DIR = path.join(ROOT, '.docstar-missing-create-args');
const PACE_MS = 100;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const { items } = JSON.parse(fs.readFileSync(SOURCE, 'utf8'));
let progress = fs.existsSync(PROGRESS) ? JSON.parse(fs.readFileSync(PROGRESS, 'utf8')) : [];
const doneIndex = new Set(progress.filter((p) => p.endpointId).map((p) => p.index));

const transport = new StreamableHTTPClientTransport(new URL(MCP_URL));
const client = new Client({ name: 'giddh-docstar-create', version: '1.0.0' }, { capabilities: {} });

try {
  await client.connect(transport);
} catch (e) {
  console.error(JSON.stringify({ error: 'MCP connect failed', detail: String(e) }));
  process.exit(1);
}

const created = [];
const failed = [];

for (let index = 0; index < items.length; index++) {
  if (doneIndex.has(index)) continue;
  const createArgs = JSON.parse(fs.readFileSync(path.join(ARGS_DIR, `${index}.json`), 'utf8'));
  try {
    const result = await client.callTool({ name: 'create_endpoint', arguments: createArgs });
    let endpointId = null;
    const text = result.content?.find((c) => c.type === 'text')?.text;
    if (text) {
      const parsed = JSON.parse(text);
      endpointId = parsed.id ?? null;
    }
    const row = { index, catalogKey: items[index].catalogKey, endpointId, status: endpointId ? 'created' : 'unknown', raw: text?.slice(0, 200) };
    if (endpointId) {
      progress.push(row);
      created.push(row);
    } else {
      failed.push(row);
    }
    fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
  } catch (e) {
    failed.push({ index, catalogKey: items[index].catalogKey, error: String(e) });
  }
  await sleep(PACE_MS);
}

await client.close();
console.log(JSON.stringify({ created: created.length, failed: failed.length, failedSample: failed.slice(0, 3) }));
process.exit(failed.length ? 1 : 0);
