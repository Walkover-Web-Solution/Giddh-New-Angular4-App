#!/usr/bin/env node
/** Emit call_any_api_of_docstar PUT NDJSON from .docstar-param-mcp-batch-calls.json (same as update_endpoint). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const calls = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-mcp-batch-calls.json'), 'utf8'));
for (const a of calls) {
  const line = {
    url: `https://api.docstar.io/orgs/${a.orgId}/endpoints/${a.endpointId}`,
    method: 'PUT',
    headers: { Authorization: '', 'Content-Type': 'application/json', Accept: 'application/json' },
    body: { description: a.description, params: a.params ?? {} },
  };
  process.stdout.write(`${JSON.stringify(line)}\n`);
}
