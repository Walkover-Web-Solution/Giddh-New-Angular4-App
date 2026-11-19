#!/usr/bin/env node
/** Print update_endpoint args JSON lines from .q/mcp-batch-idx/[start..start+count). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(ROOT, '.q/mcp-batch-idx');
const start = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 50);
for (let i = start; i < start + count; i++) {
  const fp = path.join(dir, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  process.stdout.write(`${fs.readFileSync(fp, 'utf8').trim()}\n`);
}
