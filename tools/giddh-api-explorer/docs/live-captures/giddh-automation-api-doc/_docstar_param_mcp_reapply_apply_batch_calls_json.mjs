#!/usr/bin/env node
/** Apply .docstar-param-mcp-batch-calls.json or .q/mcp-batch-idx via MCP. Needs DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local */
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
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local required' }));
  process.exit(1);
}

const src = process.argv[2] || 'idx';
let calls = [];
if (src === 'calls') {
  calls = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-mcp-batch-calls.json'), 'utf8'));
} else {
  const dir = path.join(ROOT, '.q/mcp-batch-idx');
  calls = fs
    .readdirSync(dir)
    .filter((f) => /^\d{2}\.json$/.test(f))
    .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)))
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')));
}

const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'batch-calls-json', version: '1.0.0' });
await client.connect(transport);
let ok = 0;
const failed = [];
for (const args of calls) {
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    if (r.isError === true) failed.push({ endpointId: args.endpointId });
    else ok++;
  } catch (e) {
    failed.push({ endpointId: args.endpointId, error: String(e) });
  }
}
await client.close();
console.log(JSON.stringify({ total: calls.length, ok, failed: failed.length, failedSample: failed.slice(0, 8) }));
process.exit(failed.length ? 1 : 0);
