#!/usr/bin/env node
/** Print args[] slice from current batch for agent MCP update_endpoint. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const offset = Number(process.argv[2] || 0);
const count = Number(process.argv[3] || 10);
const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const slice = (batch.items ?? []).slice(offset, offset + count);
const args = slice.map((item) =>
  JSON.parse(fs.readFileSync(path.join(OUT, `${item.endpointId}.json`), 'utf8'))
);
console.log(JSON.stringify(args));
