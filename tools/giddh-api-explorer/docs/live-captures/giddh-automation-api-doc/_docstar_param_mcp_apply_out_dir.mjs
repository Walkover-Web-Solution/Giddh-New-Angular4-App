#!/usr/bin/env node
/**
 * Emit update_endpoint args from .docstar-param-mcp-out/{endpointId}.json (one line JSON).
 * Agent: CallDynamicTool user-docstar update_endpoint with parsed stdout per item.
 * Usage: node _docstar_param_mcp_apply_out_dir.mjs [endpointId]
 *        node _docstar_param_mcp_apply_out_dir.mjs --list
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');

const arg = process.argv[2];
if (arg === '--list') {
  const ids = fs
    .readdirSync(OUT)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''))
    .sort();
  console.log(JSON.stringify(ids));
  process.exit(0);
}
if (!arg) {
  console.error('Usage: node _docstar_param_mcp_apply_out_dir.mjs <endpointId|--list>');
  process.exit(1);
}
const fp = path.join(OUT, `${arg}.json`);
const sentFp = path.join(OUT, `.sent-${arg}.json`);
const readFrom = fs.existsSync(fp) ? fp : sentFp;
if (!fs.existsSync(readFrom)) {
  console.error(JSON.stringify({ error: 'not_found', endpointId: arg, path: fp }));
  process.exit(2);
}
process.stdout.write(fs.readFileSync(readFrom, 'utf8'));
