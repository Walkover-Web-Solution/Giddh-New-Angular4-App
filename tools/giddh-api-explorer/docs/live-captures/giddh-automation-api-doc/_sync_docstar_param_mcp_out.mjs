#!/usr/bin/env node
/** Write .docstar-param-mcp-out/{endpointId}.json from docstar-param-doc-patches.json */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
function normalizeParams(params) {
  // DocStar UI treats string "false" as truthy — always emit real booleans.
  const out = {};
  for (const [name, raw] of Object.entries(params || {})) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = { ...raw };
    const req = entry.required;
    if (req === undefined || req === null || req === '' || req === 'None') {
      const desc = String(entry.description || '').toLowerCase();
      const mandatory = desc.includes('mandatory') && !desc.includes('not mandatory');
      entry.required = Boolean(mandatory);
    } else if (typeof req === 'boolean') {
      entry.required = req;
    } else {
      entry.required = ['true', '1', 'yes'].includes(String(req).toLowerCase());
    }
    out[name] = entry;
  }
  return out;
}

const patches = JSON.parse(fs.readFileSync(path.join(ROOT, 'docstar-param-doc-patches.json'), 'utf8')).patches ?? [];
fs.mkdirSync(OUT, { recursive: true });
for (const p of patches) {
  const args = { ...(p.args || {}) };
  args.params = normalizeParams(args.params);
  fs.writeFileSync(path.join(OUT, `${p.endpointId}.json`), JSON.stringify(args));
}
console.log(JSON.stringify({ synced: patches.length, out: OUT }));
