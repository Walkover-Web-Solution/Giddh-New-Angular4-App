const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const source = readFileSync(path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/helpers/middleware-experiments.ts'), 'utf8');
const EVENTS_URL = 'https://cursor-slack-bot.embarko.app/repos/giddh-panel-angular/events';

// Each load gets fresh module state (visitor id cache and the stop-after-failure flag).
function load({ storage = new Map(), navigator = {}, fetch = () => Promise.resolve() } = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
    });
    const localStorage = { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) };
    const exports = {};
    new Function('exports', 'localStorage', 'navigator', 'fetch', outputText)(exports, localStorage, navigator, fetch);
    return exports;
}

const flush = () => new Promise(resolve => setImmediate(resolve));

test('assignment is local, stable per visitor and follows weights', () => {
    const storage = new Map();
    const first = load({ storage });
    const variants = [['control', 50], ['b', 50]];
    const variant = first.mwVariant('hero-cta', variants);
    assert.ok(['control', 'b'].includes(variant));
    assert.match(storage.get('mw_visitor'), /^[0-9a-f]{32}$/);
    assert.equal(load({ storage }).mwVariant('hero-cta', variants), variant);
    assert.equal(first.mwVariant('hero-cta', [['control', 0], ['b', 1]]), 'b');
});

test('assignment falls back to the control, or undefined without variants', () => {
    const { mwVariant } = load({ storage: { get() { throw new Error('blocked'); }, set() { throw new Error('blocked'); } } });
    assert.ok(['control', 'b'].includes(mwVariant('hero-cta', [['control', 50], ['b', 50]])));
    assert.equal(mwVariant('hero-cta', [['control', 0]]), 'control');
    assert.equal(mwVariant('hero-cta', []), undefined);
    assert.equal(mwVariant('hero-cta', undefined), undefined);
});

test('events go by beacon with the publishable key and visitor id', () => {
    const sent = [];
    const { mwSend } = load({ navigator: { sendBeacon: (url, body) => sent.push({ url, body: JSON.parse(body) }) } });
    assert.equal(mwSend({ event: 'exposure', experiment: 'hero-cta', variant: 'b' }), undefined);
    assert.equal(sent.length, 1);
    assert.equal(sent[0].url, EVENTS_URL);
    const { key, visitor_id, ...event } = sent[0].body;
    assert.equal(key, 'pk_139844e870310e463bbafd87148482c5');
    assert.match(visitor_id, /^[0-9a-f]{32}$/);
    assert.deepEqual(event, { event: 'exposure', experiment: 'hero-cta', variant: 'b' });
});

test('fetch fallback is fire-and-forget and stops after a failure', async () => {
    const calls = [];
    const { mwSend } = load({
        navigator: { sendBeacon: () => false },
        fetch: (url, options) => { calls.push({ url, options }); return Promise.reject(new Error('down')); }
    });
    mwSend({ event: 'conversion', experiment: 'hero-cta', variant: 'b', goal: 'signup' });
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, EVENTS_URL);
    assert.equal(calls[0].options.credentials, 'omit');
    assert.equal(calls[0].options.keepalive, true);
    assert.ok(calls[0].options.signal);
    await flush();
    mwSend({ event: 'conversion', experiment: 'hero-cta', variant: 'b', goal: 'signup' });
    assert.equal(calls.length, 1);
});

test('sending never throws when the browser APIs do', () => {
    const { mwSend } = load({ navigator: { get sendBeacon() { throw new Error('blocked'); } } });
    assert.doesNotThrow(() => mwSend({ event: 'exposure', experiment: 'hero-cta', variant: 'control' }));
});
