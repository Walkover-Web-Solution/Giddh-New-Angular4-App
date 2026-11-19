#!/usr/bin/env node
/** One GET to verify /tmp/docstar-hm-token or DOCSTAR_HM_TOKEN works. */
import fs from 'node:fs';

const token =
  process.env.DOCSTAR_HM_TOKEN?.trim() ||
  (fs.existsSync('/tmp/docstar-hm-token') ? fs.readFileSync('/tmp/docstar-hm-token', 'utf8').trim() : '');

if (!token) {
  console.error('No token. Write hm_… to /tmp/docstar-hm-token');
  process.exit(2);
}

const res = await fetch('https://api.docstar.io/orgs/83427/collections/-Jey39dCAAyx/endpoints/xPdYugvoPz-k', {
  headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
});
const text = await res.text();
console.log(JSON.stringify({ status: res.status, ok: res.ok, hint: res.ok ? 'Token OK' : text.slice(0, 200) }));
