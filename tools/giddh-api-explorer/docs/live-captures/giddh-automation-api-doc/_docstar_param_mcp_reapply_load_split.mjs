#!/usr/bin/env node
/** Print one split JSON file path args for MCP. Usage: node _docstar_param_mcp_reapply_load_split.mjs <dir> <index> */
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const index = process.argv[3];
const fp = path.join(dir, `${String(Number(index)).padStart(2, '0')}.json`);
process.stdout.write(fs.readFileSync(fp, 'utf8'));
