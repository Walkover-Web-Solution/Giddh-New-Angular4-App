#!/usr/bin/env node
/** Print create_endpoint MCP argument JSON for pending indices (stdout, one object per line). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const items = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'docstar-missing-business-docstar-creates.json'), 'utf8'),
).items;
const progressPath = path.join(ROOT, '.docstar-missing-business-create-progress.json');
const progress = fs.existsSync(progressPath) ? JSON.parse(fs.readFileSync(progressPath, 'utf8')) : [];
const done = new Set(progress.filter((p) => p.endpointId).map((p) => p.index));
const argsDir = path.join(ROOT, '.docstar-missing-create-args');

const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? items.length - 1);

for (let index = start; index <= end && index < items.length; index++) {
  if (done.has(index)) continue;
  const createArgs = JSON.parse(fs.readFileSync(path.join(argsDir, `${index}.json`), 'utf8'));
  console.log(JSON.stringify({ index, catalogKey: items[index].catalogKey, createArgs }));
}
