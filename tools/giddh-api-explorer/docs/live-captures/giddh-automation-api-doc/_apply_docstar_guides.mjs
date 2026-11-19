#!/usr/bin/env node
/**
 * Print MCP payloads to update guide page markdown on DocStar.
 * node _apply_docstar_guides.mjs [--json]
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const ORG = '83427';
const guides = [
  { pageId: '0M0j2julTA_A', file: 'proforma.md' },
  { pageId: 'qpclmChA8TAL', file: 'estimation.md' },
];

const jsonOut = process.argv.includes('--json');
const payloads = guides.map(({ pageId, file }) => {
  const contents = fs.readFileSync(path.join(ROOT, 'docstar-guide-pages', file), 'utf8');
  return {
    tool: 'call_any_api_of_docstar',
    method: 'PUT',
    url: `https://api.docstar.io/orgs/${ORG}/pages/${pageId}`,
    body: { contents },
    then: 'publish_pages including pageId + root u9XDYe5Zc_ds',
  };
});

if (jsonOut) {
  console.log(JSON.stringify(payloads, null, 2));
} else {
  for (const p of payloads) {
    console.log(`${p.method} ${p.url} (${p.body.contents.length} chars markdown)`);
  }
  console.log('\nThen publish_pages org', ORG, 'collection -Jey39dCAAyx');
}
