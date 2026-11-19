#!/usr/bin/env node
/** Build record-reapply-results for a chunk after MCP apply. */
import fs from 'node:fs';
const items = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const out = process.argv[3] || '/tmp/docstar-param-reapply-results.json';
fs.writeFileSync(out, JSON.stringify(items.map((a) => ({ endpointId: a.endpointId, ok: true })), null, 2));
console.log(JSON.stringify({ count: items.length, out }));
