#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const ACTIVE = path.join(path.dirname(new URL(import.meta.url).pathname), '.docstar-active-batch');
const i = Number(process.argv[2] || 0);
console.log(fs.readFileSync(path.join(ACTIVE, `arg-${i}.json`), 'utf8'));
