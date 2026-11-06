const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');

function loadEditorHelpers() {
    const source = readFileSync(
        path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/template-froala/utility/template-froala.editor.ts'),
        'utf8'
    );
    const script = source
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/export interface EditorHtmlApi \{[\s\S]*?\n\}/g, '')
        .replace(/export /g, '')
        .replace(/\?:/g, ':')
        .replace(/: EditorHtmlApi|: \(\) => boolean|: void|: boolean|: number|: string/g, '');
    return new Function(`${script}
        return { guardEditorHtmlApi, tributeHandlesEditorKey, normalizeEmailTemplateHtml, EDITOR_ENTER_KEY, EDITOR_BACKSPACE_KEY };
    `)();
}

const helpers = loadEditorHelpers();

test('html.get skips page-stylesheet inlining unless the caller opts in', () => {
    const calls = [];
    const htmlApi = {
        get(cleanMarkers, skipClassInlining) {
            calls.push([cleanMarkers, skipClassInlining]);
            return '<p>Dear {CUSTOMER_NAME}</p>';
        },
        set() {
            throw new Error('set should not run');
        }
    };
    helpers.guardEditorHtmlApi(htmlApi, () => false);
    assert.equal(htmlApi.get(), '<p>Dear {CUSTOMER_NAME}</p>');
    assert.equal(htmlApi.get(true), '<p>Dear {CUSTOMER_NAME}</p>');
    htmlApi.get(false, false);
    assert.deepEqual(calls, [
        [undefined, true],
        [true, true],
        [false, false]
    ]);
});

test('html.set is ignored while the editor is syncing a keystroke back to the form', () => {
    let sets = 0;
    const htmlApi = {
        get() {
            return '';
        },
        set() {
            sets += 1;
        }
    };
    let ignore = false;
    helpers.guardEditorHtmlApi(htmlApi, () => ignore);
    ignore = true;
    htmlApi.set('<p>reset</p>');
    assert.equal(sets, 0);
    ignore = false;
    htmlApi.set('<p>loaded</p>');
    assert.equal(sets, 1);
    helpers.guardEditorHtmlApi(htmlApi, () => true);
    htmlApi.set('<p>still loaded</p>');
    assert.equal(sets, 2);
});

test('tribute consumes Enter and Backspace only while its menu is open', () => {
    assert.equal(helpers.tributeHandlesEditorKey(helpers.EDITOR_BACKSPACE_KEY, true), true);
    assert.equal(helpers.tributeHandlesEditorKey(helpers.EDITOR_ENTER_KEY, true), true);
    assert.equal(helpers.tributeHandlesEditorKey(helpers.EDITOR_BACKSPACE_KEY, false), false);
    assert.equal(helpers.tributeHandlesEditorKey(46, true), false);
});

test('paste marker is removed without dropping the email copy', () => {
    const source = '<p><meta charset="utf-8" id="isPasted"></p><p id="isPasted" style="color:rgb(32, 32, 32);">Dear {CUSTOMER_NAME}</p>';
    const normalized = helpers.normalizeEmailTemplateHtml(source);
    assert.equal(normalized.includes('isPasted'), false);
    assert.equal(normalized.includes('<meta'), false);
    assert.equal(normalized.includes('Dear {CUSTOMER_NAME}'), true);
    assert.equal(normalized.includes('color:rgb(32, 32, 32)'), true);
});

test('default trigger template has no paste marker', () => {
    const source = readFileSync(
        path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/template-froala/utility/template-froala.const.ts'),
        'utf8'
    );
    const match = source.match(/DEFAULT_TRIGGER_TEMPLATE = `([\s\S]*?)`;/);
    assert.ok(match, 'DEFAULT_TRIGGER_TEMPLATE missing');
    const template = match[1];
    assert.equal(template.includes('isPasted'), false);
    assert.equal(/<meta\b/i.test(template), false);
    assert.equal(template.includes('{CUSTOMER_NAME}'), true);
    assert.equal(template.includes('Voucher Number'), true);
});
