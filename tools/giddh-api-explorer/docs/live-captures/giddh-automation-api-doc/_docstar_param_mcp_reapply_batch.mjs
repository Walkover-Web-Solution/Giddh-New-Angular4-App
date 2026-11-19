#!/usr/bin/env node
/**
 * Apply one reapply batch via DocStar MCP update_endpoint (stdio to Cursor user-docstar).
 * Requires: DOCSTAR_MCP_APPLY=1 and Cursor MCP bridge — use agent CallDynamicTool instead.
 *
 * This script prepares /tmp/docstar-param-reapply-results.json from .docstar-param-mcp-out
 * after the agent has confirmed MCP updates (writes .docstar-param-mcp-out/.sent-{id}.json).
 *
 * Usage (agent helper):
 *   node _docstar_param_mcp_reapply_batch.mjs prepare-results-from-batch
 *   node _docstar_param_mcp_reapply_batch.mjs next-batch-ids
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const BATCH = path.join(ROOT, '.docstar-param-current-batch.json');
const OUT = path.join(ROOT, '.docstar-param-mcp-out');

const cmd = process.argv[2];

if (cmd === 'prepare-results-from-batch') {
  const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
  const results = (batch.items ?? []).map((item) => ({
    endpointId: item.endpointId,
    ok: true,
  }));
  const outPath = process.argv[3] || '/tmp/docstar-param-reapply-results.json';
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ count: results.length, outPath }));
} else if (cmd === 'next-batch-ids') {
  const batch = JSON.parse(fs.readFileSync(BATCH, 'utf8'));
  const ids = (batch.items ?? []).map((i) => i.endpointId);
  console.log(JSON.stringify(ids));
} else if (cmd === 'mark-sent') {
  const id = process.argv[3];
  if (!id) process.exit(1);
  const src = path.join(OUT, `${id}.json`);
  const dst = path.join(OUT, `.sent-${id}.json`);
  if (fs.existsSync(src)) fs.copyFileSync(src, dst);
  console.log(JSON.stringify({ endpointId: id, sent: true }));
} else {
  console.error('prepare-results-from-batch | next-batch-ids | mark-sent <endpointId>');
  process.exit(1);
}
