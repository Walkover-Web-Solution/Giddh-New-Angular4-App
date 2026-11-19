#!/usr/bin/env node
/**
 * Apply every JSON file in .q/tmp-args via DocStar MCP update_endpoint.
 * Requires DOCSTAR_MCP_AUTHORIZATION (Bearer) from signed-in DocStar MCP session.
 *
 * Usage:
 *   DOCSTAR_MCP_AUTHORIZATION='Bearer …' node _docstar_param_mcp_reapply_apply_tmp_dir.mjs
 *   DOCSTAR_MCP_AUTHORIZATION='Bearer …' node _docstar_param_mcp_reapply_apply_tmp_dir.mjs .q/mcp-wave
 */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const dir = path.resolve(ROOT, process.argv[2] || '.q/tmp-args');
const auth = process.env.DOCSTAR_MCP_AUTHORIZATION?.trim();
if (!auth) {
  console.error('Set DOCSTAR_MCP_AUTHORIZATION=Bearer … (from DocStar MCP sign-in)');
  process.exit(1);
}

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort((a, b) => Number(a) - Number(b));
const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'), {
  requestInit: { headers: { Authorization: auth } },
});
const client = new Client({ name: 'docstar-param-reapply-tmp', version: '1.0.0' });
await client.connect(transport);

const results = [];
for (const f of files) {
  const args = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
  try {
    const r = await client.callTool({ name: 'update_endpoint', arguments: args });
    const ok = r.isError !== true;
    results.push({ file: f, endpointId: args.endpointId, ok });
    process.stderr.write(ok ? '.' : 'x');
  } catch (e) {
    results.push({ file: f, endpointId: args.endpointId, ok: false, error: String(e) });
    process.stderr.write('X');
  }
}
await client.close();
process.stderr.write('\n');
const ok = results.filter((r) => r.ok).length;
console.log(JSON.stringify({ dir, total: results.length, ok, failed: results.length - ok, results }, null, 2));
