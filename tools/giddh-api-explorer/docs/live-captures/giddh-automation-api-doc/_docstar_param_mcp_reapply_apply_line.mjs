#!/usr/bin/env node
/** Print full update_endpoint args for one mcp-all.lines index (0-based). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const i = Number(process.argv[2]);
const lines = fs.readFileSync(path.join(ROOT, '.q/mcp-all.lines'), 'utf8').trim().split('\n');
const line = lines[i];
if (!line) {
  console.error('no line at index', i);
  process.exit(1);
}
const { args } = JSON.parse(line);
process.stdout.write(JSON.stringify(args));
