#!/usr/bin/env node
/** Print JSON array of { endpointId, arguments } for current batch (.q preferred). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
const qDir = path.join(ROOT, '.q');
const out = batch.items.map((item) => {
  const qPath = path.join(qDir, `mcp-${item.endpointId}.json`);
  const arguments_ = fs.existsSync(qPath)
    ? JSON.parse(fs.readFileSync(qPath, 'utf8')).arguments
    : item.args;
  return { endpointId: item.endpointId, arguments: arguments_ };
});
process.stdout.write(JSON.stringify(out));
