#!/usr/bin/env node
/**
 * Build PUT bodies from .docstar-param-mcp-out for MCP update_endpoint / REST PUT.
 * Usage:
 *   node _docstar_param_mcp_reapply_put_from_out.mjs slice <start> <count>
 *   node _docstar_param_mcp_reapply_put_from_out.mjs current-batch
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const OUT = path.join(ROOT, '.docstar-param-mcp-out');
const PATCHES = path.join(ROOT, 'docstar-param-doc-patches.json');
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

function putBodyFromOut(endpointId, fallbackArgs) {
  const fp = path.join(OUT, `${endpointId}.json`);
  const a = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : fallbackArgs;
  const body = {
    orgId: a.orgId,
    endpointId: a.endpointId,
    description: a.description,
    params: a.params,
    body: a.body,
  };
  if (a.bodyDescription != null && Object.keys(a.bodyDescription).length > 0) {
    body.bodyDescription = a.bodyDescription;
  }
  return body;
}

const cmd = process.argv[2];

if (cmd === 'slice') {
  const patches = JSON.parse(fs.readFileSync(PATCHES, 'utf8')).patches ?? [];
  const start = Number(process.argv[3] || 0);
  const count = Number(process.argv[4] || 50);
  const slice = patches.slice(start, start + count);
  console.log(
    JSON.stringify(
      slice.map((item) => putBodyFromOut(item.endpointId, item.args)),
      null,
      0
    )
  );
} else if (cmd === 'current-batch') {
  const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
  console.log(
    JSON.stringify(
      (batch.items ?? []).map((item) => putBodyFromOut(item.endpointId, item.args)),
      null,
      0
    )
  );
} else if (cmd === 'status') {
  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  console.log(JSON.stringify({ nextIndex: p.nextIndex, total: p.total, failed: p.failed?.length ?? 0 }));
} else {
  console.error('slice <start> <count> | current-batch | status');
  process.exit(1);
}
