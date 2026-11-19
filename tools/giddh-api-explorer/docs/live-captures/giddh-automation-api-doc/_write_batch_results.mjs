#!/usr/bin/env node
/** After MCP updates, mark batch results as ok (updates applied). */
import fs from 'node:fs';
import path from 'node:path';

const ACTIVE = path.join(path.dirname(new URL(import.meta.url).pathname), '.docstar-active-batch');
const payload = JSON.parse(fs.readFileSync(path.join(ACTIVE, 'payload.json'), 'utf8'));
const extra = process.argv[2] ? JSON.parse(fs.readFileSync(process.argv[2], 'utf8')) : {};
const byId = new Map(Object.entries(extra));

const results = payload.items.map((it) => {
  const response = byId.get(it.endpointId) ?? {
    description: it.args.description,
    sampleResponse: it.args.sampleResponse,
  };
  return { endpointId: it.endpointId, response };
});
fs.writeFileSync(path.join(ACTIVE, 'results.json'), JSON.stringify(results));
console.log('wrote', results.length, 'results');
