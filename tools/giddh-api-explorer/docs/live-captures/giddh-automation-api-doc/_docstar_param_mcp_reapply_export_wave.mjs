#!/usr/bin/env node
/** Export next MCP wave from agent-loop NDJSON to .q/mcp-wave/current.json */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const STATE = path.join(ROOT, '.docstar-param-reapply-agent-loop.json');
const NDJSON = path.join(ROOT, '.docstar-batch.ndjson');
const WAVE = path.join(ROOT, '.q/mcp-wave/current.json');
const n = Number(process.argv[2] || 15);

const s = JSON.parse(fs.readFileSync(STATE, 'utf8'));
const lines = fs.readFileSync(NDJSON, 'utf8').trim().split('\n').filter(Boolean);
const slice = lines.slice(s.lineOffset, s.lineOffset + n).map((l) => JSON.parse(l));
fs.mkdirSync(path.dirname(WAVE), { recursive: true });
fs.writeFileSync(WAVE, JSON.stringify(slice));
console.log(JSON.stringify({ count: slice.length, offset: s.lineOffset, ids: slice.map((a) => a.endpointId) }));
