#!/usr/bin/env node
/** Apply all .q/_wave/*.json via MCP update_endpoint. Requires DOCSTAR_MCP_AUTHORIZATION. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(ROOT, '.q/_wave');
const auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth) {
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION required' }));
  process.exit(1);
}
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort((a, b) => {
  const key = (x) => (x.startsWith('tmp-') ? 1000 + parseInt(x.replace(/\D/g, ''), 10) : parseInt(x, 10));
  return key(a) - key(b);
});
const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'wave-batch', version: '1.0.0' });
await client.connect(transport);
let ok = 0;
const failed = [];
for (const f of files) {
  const args = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    if (r.isError === true) failed.push({ f, endpointId: args.endpointId });
    else ok++;
  } catch (e) {
    failed.push({ f, endpointId: args.endpointId, error: String(e) });
  }
}
await client.close();
console.log(JSON.stringify({ total: files.length, ok, failed: failed.length, failedSample: failed.slice(0, 5) }));
process.exit(failed.length ? 1 : 0);
