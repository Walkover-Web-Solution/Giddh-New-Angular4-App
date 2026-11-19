#!/usr/bin/env node
/** Coerce params[].required to real booleans on batch-calls + .q/_mcp-args (v5 DocStar UI). */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(fileURLToPath(import.meta.url));

function normalizeParams(params) {
  const out = {};
  for (const [name, raw] of Object.entries(params || {})) {
    if (!raw || typeof raw !== 'object') continue;
    const entry = { ...raw };
    const req = entry.required;
    if (req === undefined || req === null || req === '' || req === 'None') {
      const desc = String(entry.description || '').toLowerCase();
      entry.required = desc.includes('mandatory') && !desc.includes('not mandatory');
    } else if (typeof req === 'boolean') {
      entry.required = req;
    } else {
      entry.required = ['true', '1', 'yes'].includes(String(req).toLowerCase());
    }
    out[name] = entry;
  }
  return out;
}

function coerceFile(fp) {
  const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (j.params) j.params = normalizeParams(j.params);
  fs.writeFileSync(fp, JSON.stringify(j));
  return fp;
}

const callsPath = path.join(ROOT, '.docstar-param-mcp-batch-calls.json');
if (fs.existsSync(callsPath)) coerceFile(callsPath);

const argDir = path.join(ROOT, '.q/_mcp-args');
let n = 0;
if (fs.existsSync(argDir)) {
  for (const f of fs.readdirSync(argDir)) {
    if (/^\d{2}\.json$/.test(f)) {
      coerceFile(path.join(argDir, f));
      n++;
    }
  }
}
console.log(JSON.stringify({ coerced: n, calls: fs.existsSync(callsPath) }));
