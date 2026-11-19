#!/usr/bin/env node
/** Slim .docstar-param-mcp-batch-calls.json from mcp-out by endpointId (params-only). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const slim = (batch.items ?? []).map((item) => {
  const fp = path.join(OUT, `${item.endpointId}.json`);
  const a = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : item.args;
  return {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params ?? {},
  };
});
fs.writeFileSync(path.join(ROOT, '.docstar-param-mcp-batch-calls.json'), JSON.stringify(slim, null, 2));
console.log(JSON.stringify({ slimmed: slim.length, start: batch.start, first: slim[0]?.endpointId, last: slim.at(-1)?.endpointId }));
