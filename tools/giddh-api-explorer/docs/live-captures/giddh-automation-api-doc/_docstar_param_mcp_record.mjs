#!/usr/bin/env node
/** Record MCP batch results into progress (argv: path to results json) */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PROGRESS = path.join(ROOT, '.docstar-param-run-progress.json');
const results = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const progress = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));

for (const r of results) {
  if (r.ok) {
    progress.ok += 1;
    progress.updatedIds.push(r.endpointId);
  } else {
    progress.failed.push(r);
  }
}
progress.nextIndex = (progress.nextIndex ?? 0) + results.length;

const lastOk = progress.ok;
if (lastOk > 0 && lastOk % 25 < results.filter((x) => x.ok).length) {
  // checkpoint handled below when crossing 25 boundary
}
const prevOk = progress.ok - results.filter((x) => x.ok).length;
if (Math.floor(progress.ok / 25) > Math.floor(prevOk / 25)) {
  progress.lastCheckpointAt = new Date().toISOString();
}

fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
console.log(JSON.stringify({ ok: progress.ok, failed: progress.failed.length, nextIndex: progress.nextIndex }));
