#!/usr/bin/env node
/** Print update_endpoint args JSON for one .q/mcp-batch-idx/NN.json (for IDE MCP). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const idx = Number(process.argv[2]);
if (Number.isNaN(idx)) {
  console.error('usage: node _docstar_param_mcp_reapply_apply_idx_file.mjs <0-49>');
  process.exit(1);
}
const fp = path.join(ROOT, '.q/mcp-batch-idx', `${String(idx).padStart(2, '0')}.json`);
process.stdout.write(fs.readFileSync(fp, 'utf8'));
