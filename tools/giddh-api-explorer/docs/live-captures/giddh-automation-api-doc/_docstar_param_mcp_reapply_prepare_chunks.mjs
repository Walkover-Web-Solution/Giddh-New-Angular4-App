#!/usr/bin/env node
/** Chunk remaining patches (from progress.nextIndex) into .q/mcp-chunks/NN.json (5 args each). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');
const PATCHES = JSON.parse(fs.readFileSync(path.join(ROOT, 'docstar-param-doc-patches.json'), 'utf8')).patches ?? [];
const CHUNK = Number(process.argv[2] || 5);
const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const start = progress.nextIndex ?? 0;
const slice = PATCHES.slice(start);
const dir = path.join(ROOT, '.q/mcp-chunks');
fs.mkdirSync(dir, { recursive: true });
for (const f of fs.readdirSync(dir)) {
  if (f.endsWith('.json')) fs.unlinkSync(path.join(dir, f));
}
let idx = 0;
for (let i = 0; i < slice.length; i += CHUNK) {
  const items = slice.slice(i, i + CHUNK).map((p) => {
    const fp = path.join(OUT, `${p.endpointId}.json`);
    return JSON.parse(fs.readFileSync(fp, 'utf8'));
  });
  fs.writeFileSync(path.join(dir, `${String(idx).padStart(4, '0')}.json`), JSON.stringify(items));
  idx++;
}
console.log(JSON.stringify({ start, total: slice.length, chunks: idx, chunkSize: CHUNK, dir }));
