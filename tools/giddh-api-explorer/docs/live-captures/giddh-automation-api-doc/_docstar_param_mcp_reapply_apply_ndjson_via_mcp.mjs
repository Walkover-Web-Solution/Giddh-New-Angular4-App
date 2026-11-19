#!/usr/bin/env node
/**
 * Apply NDJSON update_endpoint args via DocStar MCP (Streamable HTTP).
 * Auth: DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local
 * Usage: node _docstar_param_mcp_reapply_apply_ndjson_via_mcp.mjs <ndjson-path> [concurrency]
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
  console.error(JSON.stringify({ error: 'DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local required' }));
  process.exit(1);
}

const ndjsonPath = process.argv[2];
if (!ndjsonPath) {
  console.error('Usage: node _docstar_param_mcp_reapply_apply_ndjson_via_mcp.mjs <ndjson-path>');
  process.exit(1);
}
const calls = fs
  .readFileSync(ndjsonPath, 'utf8')
  .trim()
  .split('\n')
  .filter(Boolean)
  .map((line) => JSON.parse(line));

const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'reapply-ndjson-mcp', version: '1.0.0' });
await client.connect(transport);
let ok = 0;
const failed = [];
for (const args of calls) {
  if (args.params) {
    for (const k of Object.keys(args.params)) {
      if (!('required' in args.params[k])) args.params[k].required = 'false';
    }
  }
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    if (r.isError === true) failed.push({ endpointId: args.endpointId, error: r.content });
    else ok++;
  } catch (e) {
    failed.push({ endpointId: args.endpointId, error: String(e) });
  }
}
await client.close();
console.log(JSON.stringify({ total: calls.length, ok, failed }));
process.exit(failed.length ? 1 : 0);
