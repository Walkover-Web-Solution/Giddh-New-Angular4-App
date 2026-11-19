#!/usr/bin/env node
/** Merge .q/batch-0..N-1.json into .q/merged-batch.json array of args objects. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const Q = path.join(ROOT, '.q');
const n = Number(process.argv[2] || 25);
const out = [];
for (let i = 0; i < n; i++) {
  const fp = path.join(Q, `batch-${i}.json`);
  if (!fs.existsSync(fp)) break;
  out.push(JSON.parse(fs.readFileSync(fp, 'utf8')));
}
fs.writeFileSync(path.join(Q, 'merged-batch.json'), JSON.stringify(out));
console.log(JSON.stringify({ count: out.length, ids: out.map((a) => a.endpointId) }));
