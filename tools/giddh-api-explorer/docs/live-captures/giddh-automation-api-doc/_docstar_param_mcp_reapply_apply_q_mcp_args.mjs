#!/usr/bin/env node
/**
 * Apply .q/_mcp-args/{NN}.json via DocStar MCP update_endpoint (HTTP MCP).
 * Auth: DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local
 * Cursor IDE without bearer: CallDynamicTool user-docstar update_endpoint per file.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const bearerFile = path.join(ROOT, '.docstar-mcp-bearer.local');
let auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth && fs.existsSync(bearerFile)) {
  auth = fs.readFileSync(bearerFile, 'utf8').trim();
}
if (!auth) {
  console.error(
    JSON.stringify({
      error: 'DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local required',
      ideFallback: 'CallDynamicTool user-docstar update_endpoint per .q/_mcp-args/NN.json (25/turn)',
    }),
  );
  process.exit(1);
}

const dir = path.join(ROOT, '.q/_mcp-args');
const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? 49);

const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}\.json$/.test(f))
  .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)))
  .filter((f) => {
    const n = Number(f.slice(0, 2));
    return n >= start && n <= end;
  });

const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'apply-q-mcp-args', version: '1.0.0' });
await client.connect(transport);
let ok = 0;
const failed = [];
for (const f of files) {
  const args = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    if (r.isError === true) {
      failed.push({ f, endpointId: args.endpointId, error: r.content });
    } else {
      ok++;
    }
  } catch (e) {
    failed.push({ f, endpointId: args.endpointId, error: String(e) });
  }
}
await client.close();
console.log(JSON.stringify({ total: files.length, ok, failed }));
process.exit(failed.length ? 1 : 0);
