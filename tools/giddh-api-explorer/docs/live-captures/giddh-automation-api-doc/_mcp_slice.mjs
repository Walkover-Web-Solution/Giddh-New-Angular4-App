#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const work = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-mcp-work-full.json'), 'utf8')).work;
const start = Number(process.argv[2] || 0);
const n = Number(process.argv[3] || 10);
console.log(JSON.stringify(work.slice(start, start + n)));
