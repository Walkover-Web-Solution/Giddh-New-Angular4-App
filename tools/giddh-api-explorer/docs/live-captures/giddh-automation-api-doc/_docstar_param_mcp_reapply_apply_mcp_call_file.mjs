#!/usr/bin/env node
/** Print one update_endpoint args JSON from .q/mcp-call/N.json or .q/tmp-args/name */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const arg = process.argv[2];
if (!arg) process.exit(1);
let fp;
if (/^\d{2}$/.test(arg)) fp = path.join(ROOT, '.q/mcp-batch-idx', `${arg}.json`);
else if (/^\d+$/.test(arg)) {
  const idx = path.join(ROOT, '.q/mcp-call-index', `${arg}.json`);
  fp = fs.existsSync(idx) ? idx : path.join(ROOT, '.q/mcp-call', `${arg}.json`);
}
else fp = path.join(ROOT, '.q/tmp-args', arg.endsWith('.json') ? arg : `${arg}.json`);
process.stdout.write(fs.readFileSync(fp, 'utf8'));
