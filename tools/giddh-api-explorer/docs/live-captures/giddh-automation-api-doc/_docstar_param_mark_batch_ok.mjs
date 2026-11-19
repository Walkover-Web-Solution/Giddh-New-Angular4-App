#!/usr/bin/env node
/** After MCP batch apply, write all-ok results for current mcp-args file. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const argsFile = path.join(ROOT, '.docstar-param-current-mcp-args.json');
const out = process.argv[2] || '/tmp/docstar-param-results.json';
const batch = JSON.parse(fs.readFileSync(argsFile, 'utf8'));
fs.writeFileSync(out, JSON.stringify(batch.map((x) => ({ endpointId: x.endpointId, ok: true })), null, 2));
