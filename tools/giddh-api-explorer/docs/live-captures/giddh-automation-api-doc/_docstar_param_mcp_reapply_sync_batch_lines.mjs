#!/usr/bin/env node
/** After loop-prepare: rebuild .q/mcp-pending, .q/mcp-all.lines from current batch + mcp-out. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const PENDING = path.join(ROOT, '.q/mcp-pending');
const LINES = path.join(ROOT, '.q/mcp-all.lines');

const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const items = batch.items ?? [];
fs.mkdirSync(PENDING, { recursive: true });
const outLines = [];
for (let i = 0; i < items.length; i++) {
  const id = items[i].endpointId;
  const args = JSON.parse(fs.readFileSync(path.join(OUT, `${id}.json`), 'utf8'));
  fs.writeFileSync(path.join(PENDING, `${String(i).padStart(2, '0')}.json`), JSON.stringify(args));
  outLines.push(JSON.stringify({ endpointId: id, args }));
}
fs.writeFileSync(LINES, `${outLines.join('\n')}\n`);
console.log(JSON.stringify({ start: batch.start, count: items.length, lines: LINES }));
