#!/usr/bin/env node
/** Sync docstar-param-reapply-summary.json from .docstar-param-reapply-v2.mcp.json */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SUMMARY = path.join(ROOT, 'docstar-param-reapply-summary.json');
const PROGRESS = path.join(ROOT, '.docstar-param-reapply-v2.mcp.json');

const r = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
const p = fs.existsSync(SUMMARY)
  ? JSON.parse(fs.readFileSync(SUMMARY, 'utf8'))
  : {
      updateMethod: 'user-docstar MCP update_endpoint',
      orgId: '83427',
      collectionId: '-Jey39dCAAyx',
      rootParentId: 'u9XDYe5Zc_ds',
      total: 720,
    };

p.completedAt = new Date().toISOString();
p.nextIndex = r.nextIndex ?? 0;
p.recordedOk = r.nextIndex ?? 0;
p.total = r.total ?? 720;
p.failedCount = (r.failed ?? []).length;
p.failed = r.failed ?? [];
p.status = p.nextIndex >= p.total ? 'complete' : 'in_progress';
p.note =
  p.status === 'complete'
    ? 'production v2 reapply complete — publish_pages org 83427 collection -Jey39dCAAyx root u9XDYe5Zc_ds + all patch endpointIds'
    : 'production v2 reapply — continue prepare-reapply-batch 25 until nextIndex >= 720, then publish_pages';

fs.writeFileSync(SUMMARY, `${JSON.stringify(p, null, 2)}\n`);
console.log(JSON.stringify({ recordedOk: p.recordedOk, nextIndex: p.nextIndex, status: p.status }));
