#!/usr/bin/env node
/**
 * Agent helper: emit next MCP args slice; advance after MCP; finish batches.
 * Usage:
 *   node _docstar_param_mcp_reapply_agent_loop.mjs ensure-batch
 *   node _docstar_param_mcp_reapply_agent_loop.mjs next-args [n=15]
 *   node _docstar_param_mcp_reapply_agent_loop.mjs advance [n=15]
 *   node _docstar_param_mcp_reapply_agent_loop.mjs finish-batch-if-ready
 *   node _docstar_param_mcp_reapply_agent_loop.mjs status
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const node = process.execPath;
const STATE = path.join(ROOT, '.docstar-param-reapply-agent-loop.json');
const NDJSON = path.join(ROOT, '.docstar-batch.ndjson');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

function run(script, ...args) {
  return execFileSync(node, [path.join(ROOT, script), ...args], { encoding: 'utf8' }).trim();
}

function loadState() {
  if (!fs.existsSync(STATE)) {
    return { lineOffset: 0, batchLineCount: 0, batchStart: null };
  }
  return JSON.parse(fs.readFileSync(STATE, 'utf8'));
}

function saveState(s) {
  fs.writeFileSync(STATE, JSON.stringify(s, null, 2));
}

function loadProgress() {
  return JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
}

const cmd = process.argv[2] || 'status';

if (cmd === 'status') {
  const p = loadProgress();
  const s = loadState();
  console.log(
    JSON.stringify({
      nextIndex: p.nextIndex,
      total: p.total,
      failed: p.failed ?? [],
      lineOffset: s.lineOffset,
      batchLineCount: s.batchLineCount,
      remaining: p.total - p.nextIndex,
    })
  );
} else if (cmd === 'ensure-batch') {
  const p = loadProgress();
  if (p.nextIndex >= p.total) {
    console.log(JSON.stringify({ done: true, nextIndex: p.nextIndex }));
    process.exit(0);
  }
  let s = loadState();
  if (s.batchLineCount > 0 && s.lineOffset < s.batchLineCount) {
    console.log(JSON.stringify({ ready: true, batchStart: s.batchStart, batchLineCount: s.batchLineCount }));
    process.exit(0);
  }
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'prepare-reapply-batch', '50'));
  const nd = run('_docstar_param_mcp_reapply_apply_chunks.mjs');
  fs.writeFileSync(NDJSON, nd.endsWith('\n') ? nd : `${nd}\n`);
  const lines = fs.readFileSync(NDJSON, 'utf8').trim().split('\n').filter(Boolean);
  const batch = JSON.parse(fs.readFileSync(path.join(ROOT, '.docstar-param-current-batch.json'), 'utf8'));
  s = { lineOffset: 0, batchLineCount: lines.length, batchStart: batch.start };
  saveState(s);
  console.log(JSON.stringify({ ready: true, batchStart: s.batchStart, batchLineCount: s.batchLineCount }));
} else if (cmd === 'next-args') {
  const n = Number(process.argv[3] || 15);
  const s = loadState();
  const lines = fs.readFileSync(NDJSON, 'utf8').trim().split('\n').filter(Boolean);
  const slice = lines.slice(s.lineOffset, s.lineOffset + n);
  console.log(JSON.stringify({ offset: s.lineOffset, count: slice.length, args: slice.map((l) => JSON.parse(l)) }));
} else if (cmd === 'advance') {
  const n = Number(process.argv[3] || 15);
  const s = loadState();
  s.lineOffset += n;
  saveState(s);
  console.log(JSON.stringify({ lineOffset: s.lineOffset, batchLineCount: s.batchLineCount }));
} else if (cmd === 'finish-batch-if-ready') {
  const s = loadState();
  if (s.lineOffset < s.batchLineCount) {
    console.log(JSON.stringify({ finished: false, lineOffset: s.lineOffset, batchLineCount: s.batchLineCount }));
    process.exit(0);
  }
  console.log(run('_docstar_param_mcp_reapply_batch.mjs', 'prepare-results-from-batch'));
  console.log(run('_docstar_param_mcp_apply_all.mjs', 'record-reapply-results', '/tmp/docstar-param-reapply-results.json'));
  saveState({ lineOffset: 0, batchLineCount: 0, batchStart: null });
  const p = loadProgress();
  console.log(JSON.stringify({ finished: true, nextIndex: p.nextIndex, done: p.nextIndex >= p.total }));
} else {
  console.error('status | ensure-batch | next-args | advance | finish-batch-if-ready');
  process.exit(1);
}
