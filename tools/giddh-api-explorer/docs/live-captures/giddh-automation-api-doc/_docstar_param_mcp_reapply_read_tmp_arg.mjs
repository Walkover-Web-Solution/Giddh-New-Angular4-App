#!/usr/bin/env node
/** stdout: full update_endpoint args from .q/tmp-args/<name> */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.dirname(new URL(import.meta.url).pathname);
const name = process.argv[2];
if (!name) process.exit(1);
const fp = path.join(ROOT, '.q/tmp-args', name);
process.stdout.write(fs.readFileSync(fp, 'utf8'));
