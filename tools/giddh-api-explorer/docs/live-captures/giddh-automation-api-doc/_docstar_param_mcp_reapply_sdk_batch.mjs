#!/usr/bin/env node
/**
 * Apply current reapply batch via DocStar MCP update_endpoint (stdio/HTTP MCP).
 * Requires authenticated MCP session (Bearer in DOCSTAR_MCP_AUTHORIZATION or OAuth).
 * Usage: DOCSTAR_MCP_AUTHORIZATION='Bearer …' node _docstar_param_mcp_reapply_sdk_batch.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const MCP_URL = 'https://mcp.docstar.io/mcp';

const auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const results = [];

function loadArgs(endpointId, fallback) {
  const fp = path.join(OUT, `${endpointId}.json`);
  if (fs.existsSync(fp)) return JSON.parse(fs.readFileSync(fp, 'utf8'));
  return fallback;
}

const transport = new StreamableHTTPClientTransport(new URL(MCP_URL), {
  requestInit: auth ? { headers: { Authorization: auth } } : undefined,
});
const client = new Client({ name: 'docstar-param-reapply', version: '1.0.0' });
await client.connect(transport);

for (const item of batch.items ?? []) {
  const args = loadArgs(item.endpointId, item.args);
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    const err = r.isError === true;
    results.push({ endpointId: item.endpointId, ok: !err, error: err ? r.content : undefined });
    if (!err) process.stderr.write('.');
    else process.stderr.write('x');
  } catch (e) {
    results.push({ endpointId: item.endpointId, ok: false, error: String(e) });
    process.stderr.write('X');
  }
}
await client.close();
process.stderr.write('\n');
const outPath = process.argv[2] || '/tmp/docstar-param-reapply-results.json';
fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
const ok = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ ok, failed: results.length - ok, outPath }));
