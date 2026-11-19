#!/usr/bin/env node
/** Merge .q/batch-*.json from manifest into .q/current-batch-args.json */
import fs from 'node:fs';
import path from 'node:path';

const Q = path.join(path.dirname(new URL(import.meta.url).pathname), '.q');
const manifest = JSON.parse(fs.readFileSync(path.join(Q, 'manifest.json'), 'utf8'));
const arr = manifest.manifest.map((x) =>
  JSON.parse(fs.readFileSync(path.join(Q, `batch-${x.index}.json`), 'utf8')),
);
fs.writeFileSync(path.join(Q, 'current-batch-args.json'), JSON.stringify(arr));
console.log(JSON.stringify({ start: manifest.start, count: arr.length, endpointIds: arr.map((a) => a.endpointId) }));
