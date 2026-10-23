const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const { Subject, finalize } = require('rxjs');
const headersModule = import('@angular/compiler').then(() => import('@angular/common/http'));

async function harness() {
    const { HttpHeaders } = await headersModule;
    const file = path.resolve(__dirname, '../../apps/web-giddh/src/app/services/http-wrapper.service.ts');
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(ts.isClassDeclaration);
    const body = declaration.members.map(member => member.getText(source)).join('\n');
    const output = ts.transpileModule(`export class HttpWrapperService { ${body} }`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false } }).outputText;
    const exports = {};
    new Function('exports', 'HttpHeaders', 'finalize', output)(exports, HttpHeaders, finalize);
    const events = [], calls = [], response = new Subject();
    const http = Object.fromEntries(['get', 'post', 'put', 'patch', 'delete'].map(method => [method, (...args) => { calls.push({ method, args }); return response; }]));
    const loader = { show() { events.push('show'); }, hide() { events.push('hide'); } };
    return { service: new exports.HttpWrapperService(http, loader, { sessionId: 'test-session' }), events, calls, response };
}
for (const method of ['get', 'post', 'put', 'patch', 'delete', 'deleteWithBody']) {
    test(`${method} preserves payload/headers and releases loader on complete, error and unsubscribe`, async () => {
        for (const ending of ['complete', 'error', 'unsubscribe']) {
            const h = await harness(), body = { nested: ['one', 'two'] };
            const result = h.service[method]('/test', body);
            assert.deepEqual(h.events, ['show']);
            const actual = h.calls[0], options = actual.args[actual.args.length - 1];
            assert.equal(actual.method, method === 'deleteWithBody' ? 'delete' : method);
            assert.equal(actual.args[0], '/test');
            assert.equal(options.headers.get('Session-Id'), 'test-session');
            assert.equal(options.headers.get('Content-Type'), 'application/json');
            if (method === 'get') assert.equal(options.params, body);
            else if (method === 'delete') assert.equal(options.search, 'nested=["one","two"]');
            else if (method === 'deleteWithBody') assert.equal(options.body, body);
            else assert.equal(actual.args[1], body);
            const seen = [], errors = [];
            const subscription = result.subscribe({ next: value => seen.push(value), error: error => errors.push(error) });
            const value = { status: 'success' }, error = new Error('HTTP failure');
            h.response.next(value);
            assert.equal(seen[0], value);
            assert.deepEqual(h.events, ['show']);
            if (ending === 'unsubscribe') subscription.unsubscribe();
            else if (ending === 'error') h.response.error(error);
            else h.response.complete();
            assert.deepEqual(h.events, ['show', 'hide']);
            assert.deepEqual(errors, ending === 'error' ? [error] : []);
        }
    });
}
test('hidden loader, multipart and URL-encoded options retain distinct header behavior', async () => {
    const h = await harness();
    h.service.post('/upload', {}, { loader: 'hide', headers: { 'Content-Type': 'multipart/form-data' } }).subscribe();
    assert.deepEqual(h.events, []);
    assert.equal(h.calls[0].args[2].headers.has('Content-Type'), false);
    assert.equal(h.calls[0].args[2].headers.get('Session-Id'), 'test-session');
    h.response.complete();
    assert.deepEqual(h.events, ['hide']);
    const encoded = await harness();
    encoded.service.post('/token', 'code=a', { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).subscribe();
    const headers = encoded.calls[0].args[2].headers;
    assert.equal(headers.has('Session-Id'), false);
    assert.equal(headers.has('cache-control'), false);
    assert.equal(headers.has('Accept'), false);
});
