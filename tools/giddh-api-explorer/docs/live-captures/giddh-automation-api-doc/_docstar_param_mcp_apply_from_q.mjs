#!/usr/bin/env node
/**
 * Queue helpers for agent MCP update_endpoint (reads .q/batch-*.json from manifest).
 * node _docstar_param_mcp_apply_from_q.mjs list-batch
 * node _docstar_param_mcp_apply_from_q.mjs args <index>
 * node _docstar_param_mcp_apply_from_q.mjs sync-apply-from-batch
 * node _docstar_param_mcp_apply_from_q.mjs record-manifest-ok
 * node _docstar_param_mcp_apply_from_q.mjs apply-count
 * node _docstar_param_mcp_apply_from_q.mjs write-mcp-files  — copy apply-i → mcp-{endpointId}.json
 * node _docstar_param_mcp_apply_from_q.mjs pending-ids       — JSON array of endpointIds in current manifest
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const QDIR = path.join(ROOT, '.q');
const MANIFEST = path.join(QDIR, 'manifest.json');

function loadManifest() {
  return JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
}

const cmd = process.argv[2];

if (cmd === 'list-batch') {
  const m = loadManifest();
  console.log(JSON.stringify({ start: m.start, count: m.count, ids: m.manifest.map((x) => x.endpointId) }));
} else if (cmd === 'args') {
  const i = Number(process.argv[3]);
  const m = loadManifest();
  const row = m.manifest.find((x) => x.index === i);
  if (!row) {
    console.error('No manifest row for index', i);
    process.exit(1);
  }
  const args = JSON.parse(fs.readFileSync(row.argsFile, 'utf8'));
  process.stdout.write(JSON.stringify(args));
} else if (cmd === 'sync-apply-from-batch') {
  const m = loadManifest();
  for (const row of m.manifest) {
    const src = row.argsFile;
    const dst = path.join(QDIR, `apply-${row.index}.json`);
    fs.copyFileSync(src, dst);
  }
  console.log(JSON.stringify({ synced: m.count, start: m.start }));
} else if (cmd === 'write-mcp-files') {
  const m = loadManifest();
  for (let i = 0; i < m.count; i++) {
    const a = JSON.parse(fs.readFileSync(path.join(QDIR, `apply-${i}.json`), 'utf8'));
    fs.writeFileSync(path.join(QDIR, `mcp-${a.endpointId}.json`), JSON.stringify(a));
  }
  console.log(JSON.stringify({ wrote: m.count, start: m.start }));
} else if (cmd === 'pending-ids') {
  const m = loadManifest();
  console.log(JSON.stringify(m.manifest.map((x) => x.endpointId)));
} else if (cmd === 'record-manifest-ok') {
  const m = loadManifest();
  const results = m.manifest.map((row) => ({ endpointId: row.endpointId, ok: true }));
  execFileSync('node', ['_docstar_param_mcp_apply_remaining.mjs', 'record-results', JSON.stringify(results)], {
    cwd: ROOT,
    stdio: 'inherit',
  });
} else if (cmd === 'apply-count') {
  const m = loadManifest();
  console.log(JSON.stringify({ start: m.start, count: m.count }));
} else {
  console.error(
    'list-batch | args <index> | sync-apply-from-batch | write-mcp-files | pending-ids | record-manifest-ok | apply-count',
  );
  process.exit(1);
}
