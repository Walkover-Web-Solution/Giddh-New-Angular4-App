#!/usr/bin/env node
/**
 * Apply current batch by shelling to cursor agent MCP is not available offline.
 * This script reads .docstar-param-current-mcp-args.json and prints curl-equivalent
 * payloads for agent CallDynamicTool (stdout one JSON per line: endpointId + arguments).
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const argsFile = path.join(ROOT, '.docstar-param-current-mcp-args.json');
const batch = JSON.parse(fs.readFileSync(argsFile, 'utf8'));
for (const { endpointId, arguments: args } of batch) {
  process.stdout.write(JSON.stringify({ endpointId, arguments: args }) + '\n');
}
