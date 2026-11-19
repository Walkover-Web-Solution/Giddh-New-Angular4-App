#!/usr/bin/env node
/** Emit NDJSON update_endpoint args from .q/_wave-all-args.json slice [start, end). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const start = Number(process.argv[2] || 0);
const end = Number(process.argv[3] || start + 1);
const arr = JSON.parse(fs.readFileSync(path.join(ROOT, '.q/_wave-all-args.json'), 'utf8'));
for (let i = start; i < end && i < arr.length; i++) {
  const { file, ...args } = arr[i];
  process.stdout.write(`${JSON.stringify(args)}\n`);
}
