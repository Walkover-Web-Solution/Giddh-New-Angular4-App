const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const specPath = path.join(
    __dirname,
    '../../tools/giddh-api-explorer/docs/live-captures/giddh-automation-api-doc/docstar-giddh-try-environment.json',
);

test('docstar-giddh-try-environment.json defines shared TRY variables', () => {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    const keys = spec.variables.map((v) => v.key);
    assert.deepEqual(keys, ['baseUrl', 'companyUniqueName', 'Auth-Key', 'Session-Id']);
    assert.equal(spec.type, 0);
    assert.equal(spec.variables.find((v) => v.key === 'Auth-Key').value, '');
});

test('docstar-auth-placeholders.json matches wire script expectations', () => {
    const placeholdersPath = path.join(path.dirname(specPath), 'docstar-auth-placeholders.json');
    const placeholders = JSON.parse(fs.readFileSync(placeholdersPath, 'utf8'));
    assert.match(placeholders.authKey, /^ENTER_YOUR_GIDDH_AUTH_KEY$/);
    assert.match(placeholders.sessionId, /^ENTER_YOUR_GIDDH_SESSION_ID$/);
});