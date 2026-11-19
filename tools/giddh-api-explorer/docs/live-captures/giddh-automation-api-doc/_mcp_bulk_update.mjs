#!/usr/bin/env node
/** DEPRECATED: direct MCP HTTP lacks Cursor OAuth — all calls fail invalid_token. Use user-docstar update_endpoint via agent loop instead. */
import fs from 'node:fs';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const PROGRESS = path.join(ROOT, '.docstar-mcp-progress.json');
const RUNNER = path.join(ROOT, '_run_docstar_full_mcp.mjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function main() {
  const batchSize = Number(process.env.BATCH_SIZE || 5);
  const paceMs = Number(process.env.PACE_MS || 150);

  const transport = new StreamableHTTPClientTransport(new URL('https://mcp.docstar.io/mcp'));
  const client = new Client({ name: 'giddh-docstar-bulk', version: '1.0.0' });
  await client.connect(transport);

  const { classify } = await import(RUNNER);

  for (;;) {
    const sliceJson = await new Promise((resolve, reject) => {
      import('node:child_process').then(({ execFile }) => {
        execFile('node', [RUNNER, 'slice', String(batchSize)], (err, stdout) => {
          if (err) reject(err);
          else resolve(JSON.parse(stdout));
        });
      });
    });

    if (sliceJson.done || sliceJson.items.length === 0) break;

    const results = await Promise.all(
      sliceJson.items.map(async ({ endpointId, item, args }) => {
        try {
          const res = await client.callTool({ name: 'update_endpoint', arguments: args });
          const text = res.content?.find((c) => c.type === 'text')?.text;
          const data = text ? JSON.parse(text) : res.structuredContent ?? res;
          const status = classify({ item }, data) === 'skipped' ? 'skipped' : 'ok';
          return { endpointId, status };
        } catch (error) {
          return { endpointId, status: 'error', error: String(error) };
        }
      })
    );

    await new Promise((resolve, reject) => {
      import('node:child_process').then(({ execFile }) => {
        execFile(
          'node',
          [RUNNER, 'record', JSON.stringify({ results, nextIndex: sliceJson.nextIndex })],
          (err, stdout) => {
            if (err) reject(err);
            else {
              console.log(stdout.trim());
              resolve();
            }
          }
        );
      });
    });

    await sleep(paceMs);
  }

  const publishArgs = JSON.parse(
    await new Promise((resolve, reject) => {
      import('node:child_process').then(({ execFile }) => {
        execFile('node', [RUNNER, 'publish-args'], (err, stdout) => {
          if (err) reject(err);
          else resolve(stdout);
        });
      });
    })
  );

  const pub = await client.callTool({ name: 'publish_pages', arguments: publishArgs });
  const pubText = pub.content?.find((c) => c.type === 'text')?.text;
  const publish = pubText ? JSON.parse(pubText) : pub;

  const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  p.publish = publish;
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));

  await new Promise((resolve, reject) => {
    import('node:child_process').then(({ execFile }) => {
      execFile('node', [RUNNER, 'finalize'], (err, stdout) => {
        if (err) reject(err);
        else {
          console.log(stdout.trim());
          resolve();
        }
      });
    });
  });

  await client.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
