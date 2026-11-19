#!/usr/bin/env node
/** Write .docstar-param-mcp-batch-calls.json from current reapply batch (slim update_endpoint args). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const CALLS = path.join(ROOT, '.docstar-param-mcp-batch-calls.json');

const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
const calls = (batch.items ?? []).map((item) => {
  const fp = path.join(OUT, `${item.endpointId}.json`);
  const a = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : item.args;
  return {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params,
    body: a.body,
    ...(a.bodyDescription != null && Object.keys(a.bodyDescription).length > 0
      ? { bodyDescription: a.bodyDescription }
      : {}),
  };
});
fs.writeFileSync(CALLS, JSON.stringify(calls, null, 2));
console.log(JSON.stringify({ count: calls.length, out: CALLS, ids: calls.map((c) => c.endpointId) }));
