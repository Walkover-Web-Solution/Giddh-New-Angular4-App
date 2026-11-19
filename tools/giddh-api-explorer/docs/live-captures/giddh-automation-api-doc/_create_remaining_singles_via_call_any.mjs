#!/usr/bin/env node
/**
 * NOT FOR AGENT USE — DocStar MCP create_page must be used from Cursor CallDynamicTool.
 * This file documents remaining paths only.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const ONE = path.join(ROOT, '.docstar-api-guides-singles-mcp-one');
const PROGRESS = path.join(ROOT, '.docstar-api-guides-singles-create-progress.jsonl');

const done = new Set();
if (fs.existsSync(PROGRESS)) {
  for (const line of fs.readFileSync(PROGRESS, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const o = JSON.parse(line);
      if (o.ok) done.add(o.urlName);
    } catch {
      /* ignore */
    }
  }
}

const todo = fs
  .readdirSync(ONE)
  .filter((f) => f.startsWith('all-0') && !f.startsWith('all-03') && !f.startsWith('all-04'))
  .sort()
  .map((f) => path.join(ONE, f))
  .filter((fp) => {
    const x = JSON.parse(fs.readFileSync(fp, 'utf8'));
    return !done.has(x.urlName);
  });

console.log(JSON.stringify({ todoCount: todo.length, files: todo.map((f) => path.basename(f)) }, null, 2));
