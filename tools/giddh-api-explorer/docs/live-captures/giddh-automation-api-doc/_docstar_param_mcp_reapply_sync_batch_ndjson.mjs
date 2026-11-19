#!/usr/bin/env node
/** Regenerate .docstar-batch.ndjson from .q/mcp-batch-idx/*.json (fixes stale NDJSON). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(ROOT, '.q/mcp-batch-idx');
const out = path.join(ROOT, '.docstar-batch.ndjson');
const files = fs
  .readdirSync(dir)
  .filter((f) => /^\d{2}\.json$/.test(f))
  .sort((a, b) => Number(a.slice(0, 2)) - Number(b.slice(0, 2)));
const lines = files.map((f) => fs.readFileSync(path.join(dir, f), 'utf8').trim());
fs.writeFileSync(out, `${lines.join('\n')}\n`);
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
const state = {
  lineOffset: 0,
  batchLineCount: lines.length,
  batchStart: batch.start,
};
fs.writeFileSync(path.join(ROOT, '.docstar-param-reapply-agent-loop.json'), JSON.stringify(state, null, 2));
console.log(JSON.stringify({ count: lines.length, batchStart: batch.start, out }));
