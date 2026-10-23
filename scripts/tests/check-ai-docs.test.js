const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { checkDocuments } = require('../check-ai-docs');

test('accepts relative file links, headings, and external links without fetching', t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'giddh-docs-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.mkdirSync(path.join(root, 'docs'));
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Entry\n[Flow](docs/flow.md#save-invoice)\n[External](https://example.invalid)\n');
    fs.writeFileSync(path.join(root, 'docs/flow.md'), '# Save invoice\n[Entry](../AGENTS.md#entry)\n```md\n[Example](missing.md)\n```\n');
    assert.deepEqual(checkDocuments(root, ['AGENTS.md', 'docs/flow.md']), []);
});

test('reports missing documents, broken files, heading drift, and template residue', t => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'giddh-docs-'));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    fs.writeFileSync(path.join(root, 'AGENTS.md'), '# Entry\n[Lost](lost.md)\n[Old](#old)\n{{PROJECT_NAME}}\n');
    const errors = checkDocuments(root, ['AGENTS.md', 'missing.md']);
    assert.equal(errors.length, 4);
    assert.ok(errors.some(error => error.includes('missing document')));
    assert.ok(errors.some(error => error.includes('missing link lost.md')));
    assert.ok(errors.some(error => error.includes('missing heading #old')));
    assert.ok(errors.some(error => error.includes('unfinished template')));
});
