#!/usr/bin/env node
/** Print payload summary for agent MCP round. */
import fs from 'node:fs';
import path from 'node:path';
const ACTIVE = path.join(path.dirname(new URL(import.meta.url).pathname), '.docstar-active-batch');
const p = JSON.parse(fs.readFileSync(path.join(ACTIVE, 'payload.json'), 'utf8'));
for (let i = 0; i < p.items.length; i++) {
  fs.writeFileSync(path.join(ACTIVE, `arg-${i}.json`), JSON.stringify(p.items[i].args));
}
console.log(JSON.stringify({ nextIndex: p.nextIndex, done: p.done, items: p.items.map((x) => ({ i: p.items.indexOf(x), id: x.endpointId, name: x.name })) }));
