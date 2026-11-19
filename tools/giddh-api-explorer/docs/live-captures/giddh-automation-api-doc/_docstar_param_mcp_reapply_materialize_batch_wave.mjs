#!/usr/bin/env node
/**
 * After loop-prepare: prepare-mcp-one → refresh batch idx → copy to .q/_wave (batch only).
 * Usage: node _docstar_param_mcp_reapply_materialize_batch_wave.mjs
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const node = process.execPath;

execFileSync(node, [path.join(ROOT, '_docstar_param_mcp_reapply_apply_all_batches.mjs'), 'prepare-mcp-one'], {
  stdio: 'inherit',
});
execFileSync(node, [path.join(ROOT, '_docstar_param_mcp_reapply_refresh_batch_idx.mjs')], { stdio: 'inherit' });

const idx = path.join(ROOT, '.q/mcp-batch-idx');
const wave = path.join(ROOT, '.q/_wave');
fs.mkdirSync(wave, { recursive: true });
for (const f of fs.readdirSync(wave)) {
  if (f.endsWith('.json')) fs.unlinkSync(path.join(wave, f));
}
for (const f of fs
  .readdirSync(idx)
  .filter((x) => x.endsWith('.json'))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))) {
  fs.copyFileSync(path.join(idx, f), path.join(wave, f));
}
console.log(JSON.stringify({ waveDir: wave, count: fs.readdirSync(wave).filter((x) => x.endsWith('.json')).length }));
