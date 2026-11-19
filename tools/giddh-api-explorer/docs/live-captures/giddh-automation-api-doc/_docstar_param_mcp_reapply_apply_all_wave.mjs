#!/usr/bin/env node
/**
 * Apply every .q/_wave/*.json via MCP update_endpoint (full args in each file).
 * Requires DOCSTAR_MCP_AUTHORIZATION=Bearer …
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
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
const client = new Client({ name: 'docstar-wave-all', version: '1.0.0' });
await client.connect(transport);
const results = [];
for (const f of files) {
  const args = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    results.push({ file: f, endpointId: args.endpointId, ok: r.isError !== true });
  } catch (e) {
    results.push({ file: f, endpointId: args.endpointId, ok: false, error: String(e) });
  }
}
await client.close();
const ok = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ total: results.length, ok, failed: results.length - ok }));
