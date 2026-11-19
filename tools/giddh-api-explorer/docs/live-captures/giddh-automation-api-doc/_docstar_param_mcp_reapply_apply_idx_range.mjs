#!/usr/bin/env node
/** Print JSON array of update_endpoint args for idx range (IDE MCP helper). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(ROOT, '.q/mcp-batch-idx');
const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? 49);
const out = [];
for (let i = start; i <= end; i++) {
  const fp = path.join(dir, `${String(i).padStart(2, '0')}.json`);
  if (!fs.existsSync(fp)) break;
  out.push(JSON.parse(fs.readFileSync(fp, 'utf8')));
}
process.stdout.write(JSON.stringify(out));
