#!/usr/bin/env node
/** Write .q/current-wave/{i}.json from .docstar-batch.ndjson slice. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const NDJSON = path.join(ROOT, '.docstar-batch.ndjson');
const WAVE = path.join(ROOT, '.q/current-wave');
const offset = Number(process.argv[2] ?? 0);
const size = Number(process.argv[3] ?? 15);

const lines = fs.readFileSync(NDJSON, 'utf8').trim().split('\n').filter(Boolean);
fs.mkdirSync(WAVE, { recursive: true });
for (const f of fs.readdirSync(WAVE)) fs.unlinkSync(path.join(WAVE, f));

let n = 0;
for (let i = 0; i < size && offset + i < lines.length; i++) {
  fs.writeFileSync(path.join(WAVE, `${i}.json`), lines[offset + i]);
  n++;
}
console.log(JSON.stringify({ offset, count: n, totalLines: lines.length }));
