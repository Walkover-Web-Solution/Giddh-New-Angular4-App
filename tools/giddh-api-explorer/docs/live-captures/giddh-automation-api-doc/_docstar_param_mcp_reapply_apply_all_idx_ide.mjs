#!/usr/bin/env node
/**
 * IDE helper: apply every .q/mcp-batch-idx/*.json via MCP update_endpoint.
 * Requires DOCSTAR_MCP_AUTHORIZATION or .docstar-mcp-bearer.local (one line: Bearer …).
 * Usage: node _docstar_param_mcp_reapply_apply_all_idx_ide.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const bearerFile = path.join(ROOT, '.docstar-mcp-bearer.local');
let auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth && fs.existsSync(bearerFile)) auth = fs.readFileSync(bearerFile, 'utf8').trim();
if (!auth) {
  console.error(
    JSON.stringify({
      error: 'Set DOCSTAR_MCP_AUTHORIZATION or create .docstar-mcp-bearer.local',
      ideFallback: 'MCP update_endpoint each file in .q/mcp-batch-idx/ via Cursor user-docstar',
    })
  );
  process.exit(1);
}

const dir = path.join(ROOT, '.q/mcp-batch-idx');
const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}\.json$/.test(f))
  .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)));

const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'apply-all-idx-ide', version: '1.0.0' });
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
console.log(JSON.stringify({ total: files.length, ok, failed: failed.length, failedSample: failed.slice(0, 8) }));
process.exit(failed.length ? 1 : 0);
