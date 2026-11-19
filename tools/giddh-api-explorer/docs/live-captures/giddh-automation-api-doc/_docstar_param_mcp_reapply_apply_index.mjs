#!/usr/bin/env node
/** Print update_endpoint args JSON for batch line index. Usage: node _docstar_param_mcp_reapply_apply_index.mjs <index> */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const i = Number(process.argv[2]);
const fp = path.join(ROOT, '.q/mcp-args-only', `${String(i).padStart(2, '0')}.json`);
if (!fs.existsSync(fp)) {
  const lines = fs.readFileSync(path.join(ROOT, '.q/mcp-all.lines'), 'utf8').trim().split('\n');
  const row = JSON.parse(lines[i]);
  process.stdout.write(JSON.stringify(row.args));
} else {
  process.stdout.write(fs.readFileSync(fp, 'utf8'));
}
