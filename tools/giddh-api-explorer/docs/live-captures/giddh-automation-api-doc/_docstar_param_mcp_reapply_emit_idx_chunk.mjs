#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(ROOT, '.q/mcp-batch-idx');
const start = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 10);
const out = [];
for (let i = start; i < start + count; i++) {
  const fp = path.join(dir, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  out.push(JSON.parse(fs.readFileSync(fp, 'utf8')));
}
const dest = path.join(ROOT, '.q/_mcp-chunk.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.log(JSON.stringify({ start, count: out.length, dest }));
