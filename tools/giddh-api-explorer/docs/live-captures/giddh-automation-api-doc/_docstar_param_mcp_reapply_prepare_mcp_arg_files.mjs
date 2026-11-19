#!/usr/bin/env node
/** Split .docstar-param-mcp-batch-calls.json into .q/_mcp-args/NN.json for IDE MCP apply. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const calls = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-mcp-batch-calls.json'), 'utf8'));
const outDir = path.join(ROOT, '.q/_mcp-args');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) {
  if (/^\d{2}\.json$/.test(f)) fs.unlinkSync(path.join(outDir, f));
}
calls.forEach((a, i) => {
  const slim = {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params,
  };
  fs.writeFileSync(path.join(outDir, `${String(i).padStart(2, '0')}.json`), JSON.stringify(slim));
});
console.log(JSON.stringify({ count: calls.length, start: JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8')).start }));
