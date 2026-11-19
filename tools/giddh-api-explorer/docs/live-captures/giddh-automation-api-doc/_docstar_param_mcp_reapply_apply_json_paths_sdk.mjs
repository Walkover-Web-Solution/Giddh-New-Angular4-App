#!/usr/bin/env node
/**
 * Apply update_endpoint via DocStar MCP for each JSON file path (full args object).
 * Requires DOCSTAR_MCP_AUTHORIZATION=Bearer …
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth) {
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION required' }));
  process.exit(1);
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node _docstar_param_mcp_reapply_apply_json_paths_sdk.mjs <file.json>…');
  process.exit(1);
}

const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'docstar-apply-paths', version: '1.0.0' });
await client.connect(transport);
const results = [];
for (const fp of files) {
  const args = JSON.parse(fs.readFileSync(fp, 'utf8'));
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    results.push({ file: fp, endpointId: args.endpointId, ok: r.isError !== true });
  } catch (e) {
    results.push({ file: fp, endpointId: args.endpointId, ok: false, error: String(e) });
  }
}
await client.close();
const ok = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ total: results.length, ok, failed: results.length - ok, results }));
