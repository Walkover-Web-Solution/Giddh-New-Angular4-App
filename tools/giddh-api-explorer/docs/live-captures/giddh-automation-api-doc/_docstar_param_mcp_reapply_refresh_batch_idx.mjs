#!/usr/bin/env node
/** Copy .q/mcp-one/{endpointId}.json → .q/mcp-batch-idx/NN.json for current batch order. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const ONE = path.join(ROOT, '.q/mcp-one');
const IDX = path.join(ROOT, '.q/mcp-batch-idx');

const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const items = batch.items ?? [];
fs.mkdirSync(IDX, { recursive: true });
for (const f of fs.readdirSync(IDX)) {
  if (f.endsWith('.json')) fs.unlinkSync(path.join(IDX, f));
}
items.forEach((item, i) => {
  const src = path.join(ONE, `${item.endpointId}.json`);
  const dst = path.join(IDX, `${String(i).padStart(2, '0')}.json`);
  fs.writeFileSync(dst, fs.readFileSync(src));
});
console.log(JSON.stringify({ start: batch.start, count: items.length, dir: IDX }));
