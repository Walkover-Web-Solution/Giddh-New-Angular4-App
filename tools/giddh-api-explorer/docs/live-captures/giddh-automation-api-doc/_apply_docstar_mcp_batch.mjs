#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { classify } from './_run_docstar_full_mcp.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const ACTIVE = path.join(ROOT, '.docstar-active-batch');
const PROGRESS = path.join(ROOT, '.docstar-mcp-progress.json');
const RUNNER = path.join(ROOT, '_run_docstar_full_mcp.mjs');

const cmd = process.argv[2];

if (cmd === 'prepare') {
  const size = Number(process.argv[3] || 5);
  const slice = JSON.parse(execFileSync('node', [RUNNER, 'slice', String(size)], { encoding: 'utf8' }));
  fs.mkdirSync(ACTIVE, { recursive: true });
  fs.writeFileSync(
    path.join(ACTIVE, 'payload.json'),
    JSON.stringify(
      {
        nextIndex: slice.nextIndex,
        done: slice.done,
        items: slice.items.map((x) => ({
          endpointId: x.endpointId,
          name: x.item.name,
          args: x.args,
        })),
      },
      null,
      2
    )
  );
  console.log(JSON.stringify({ count: slice.items.length, done: slice.done, nextIndex: slice.nextIndex }));
} else if (cmd === 'commit-ok') {
  const payload = JSON.parse(fs.readFileSync(path.join(ACTIVE, 'payload.json'), 'utf8'));
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  p.workIndex = payload.nextIndex;
  p.ok = (p.ok || 0) + payload.items.length;
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
  console.log(JSON.stringify(p));
} else if (cmd === 'commit') {
  const resultsPath = process.argv[3] || path.join(ACTIVE, 'results.json');
  const payload = JSON.parse(fs.readFileSync(path.join(ACTIVE, 'payload.json'), 'utf8'));
  const resultsIn = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
  const byId = new Map(payload.items.map((x) => [x.endpointId, x]));
  const results = resultsIn.map((r) => {
    if (r.error) return { endpointId: r.endpointId, status: 'error', error: r.error };
    const item = byId.get(r.endpointId);
    const status =
      item &&
      classify(
        {
          item: {
            description: item.args.description,
            sampleResponse: item.args.sampleResponse,
          },
        },
        r.response
      ) === 'skipped'
        ? 'skipped'
        : 'ok';
    return { endpointId: r.endpointId, status };
  });
  const p = JSON.parse(
    execFileSync('node', [RUNNER, 'record', JSON.stringify({ results, nextIndex: payload.nextIndex })], {
      encoding: 'utf8',
    })
  );
  console.log(JSON.stringify(p));
} else {
  console.error('Usage: prepare [n] | commit [results.json]');
  process.exit(1);
}
