const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const appRoot = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/template-froala');
const componentPath = path.join(appRoot, 'template-froala.component.ts');
const constPath = path.join(appRoot, 'utility/template-froala.const.ts');

test('default trigger email template documents Froala paste marker id', () => {
    const src = fs.readFileSync(constPath, 'utf8');
    assert.match(src, /DEFAULT_TRIGGER_TEMPLATE/);
    assert.match(src, /id="isPasted"/);
});

test('froala backspace is suppressed while tribute autocomplete is active', () => {
    const src = fs.readFileSync(componentPath, 'utf8');
    assert.match(src, /FroalaEditor\.KEYCODE\.BACKSPACE/);
    assert.match(src, /froalaTribute\?\.isActive/);
});