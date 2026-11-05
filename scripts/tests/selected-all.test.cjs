const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const appRoot = path.resolve(__dirname, '../../apps/web-giddh/src/app');

function evaluateTypeScript(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false }
    });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}

// Load the actual public method without bootstrapping
// Angular. These tests cover request values and ownership, not service DI or UI.
const serviceSource = ts.createSourceFile('general.service.ts', readFileSync(path.join(appRoot, 'services/general.service.ts'), 'utf8'), ts.ScriptTarget.Latest, true);
const serviceClass = serviceSource.statements.find(statement => ts.isClassDeclaration(statement) && statement.name.text === 'GeneralService');
const methods = serviceClass.members.filter(member => ts.isMethodDeclaration(member) && member.name.getText(serviceSource) === 'replaceSelectedAllOptions');
const selectionHelperPath = path.join(appRoot, 'shared/helpers/selected-all.ts');
const selection = evaluateTypeScript(readFileSync(selectionHelperPath, 'utf8'));
const lodash = evaluateTypeScript(readFileSync(path.join(appRoot, 'lodash-optimized.ts'), 'utf8'));
const { SelectionService } = evaluateTypeScript(`export class SelectionService { ${methods.map(method => method.getText(serviceSource)).join('\n')} }`, { ...selection, cloneDeep: lodash.cloneDeep });
const service = new SelectionService();
const { SELECTED_ALL_OPTION: all, isSelectedAllOption } = selection;

test('only the single All sentinel means select all', () => {
    assert.equal(isSelectedAllOption([all]), true);
    for (const value of [null, undefined, all, [], ['all'], [all, 'account'], [0], {}]) {
        assert.equal(isSelectedAllOption(value), false);
    }
});

test('normalization keeps request identity and records selected fields', () => {
    const request = { accounts: [all], statuses: ['paid'], count: 0, enabled: false };
    assert.equal(service.replaceSelectedAllOptions(request), request);
    assert.deepEqual(request, { accounts: [], statuses: ['paid'], count: 0, enabled: false, selectAllFields: ['accounts'] });
});

test('nested fields are collected in traversal order, including duplicate leaf names', () => {
    const request = { first: { accounts: [all] }, branches: [all], second: { accounts: [all] } };
    service.replaceSelectedAllOptions(request);
    assert.deepEqual(request, { first: { accounts: [] }, branches: [], second: { accounts: [] }, selectAllFields: ['accounts', 'branches', 'accounts'] });
    assert.equal(Object.hasOwn(request.first, 'selectAllFields'), false);
});

test('array contents and mixed selections are left intact', () => {
    const rows = [{ accounts: [all] }];
    const request = { rows, accounts: [all, 'account-a'], empty: [], nested: null };
    service.replaceSelectedAllOptions(request);
    assert.equal(request.rows, rows);
    assert.deepEqual(request, { rows: [{ accounts: [all] }], accounts: [all, 'account-a'], empty: [], nested: null, selectAllFields: [] });
});

test('copy mode normalizes a separate nested request', () => {
    const request = { nested: { accounts: [all] }, statuses: ['paid'] };
    const result = service.replaceSelectedAllOptions(request, true);
    assert.notEqual(result, request);
    assert.notEqual(result.nested, request.nested);
    assert.notEqual(result.statuses, request.statuses);
    assert.deepEqual(request, { nested: { accounts: [all] }, statuses: ['paid'] });
    assert.deepEqual(result, { nested: { accounts: [] }, statuses: ['paid'], selectAllFields: ['accounts'] });
});

test('the existing clone adapter preserves its JSON fallback semantics', () => {
    const request = { date: new Date('2026-01-02T00:00:00.000Z'), omitted: undefined, accounts: [all] };
    const result = service.replaceSelectedAllOptions(request, true);
    assert.deepEqual(result, { date: '2026-01-02T00:00:00.000Z', accounts: [], selectAllFields: ['accounts'] });
    assert.ok(request.date instanceof Date);
    assert.equal(Object.hasOwn(request, 'omitted'), true);
});

test('old selectAllFields are replaced on every normalization', () => {
    const request = { accounts: [all], selectAllFields: ['stale'] };
    service.replaceSelectedAllOptions(request);
    assert.deepEqual(request.selectAllFields, ['accounts']);
    service.replaceSelectedAllOptions(request);
    assert.deepEqual(request.selectAllFields, []);
});

test('only own enumerable properties are traversed', () => {
    const request = Object.create({ inherited: [all] });
    request.accounts = [all];
    Object.defineProperty(request, 'hidden', { value: [all], enumerable: false });
    service.replaceSelectedAllOptions(request);
    assert.deepEqual(request.selectAllFields, ['accounts']);
    assert.deepEqual(request.inherited, [all]);
    assert.deepEqual(request.hidden, [all]);
});

test('primitive and nullish inputs pass through in mutation mode', () => {
    for (const value of [null, undefined, '', 'account', 0, 7, false, true]) {
        assert.equal(service.replaceSelectedAllOptions(value), value);
    }
});

test('a root array keeps its entries and receives root metadata', () => {
    const request = [{ accounts: [all] }];
    assert.equal(service.replaceSelectedAllOptions(request), request);
    assert.deepEqual(request[0], { accounts: [all] });
    assert.deepEqual(request.selectAllFields, []);
});

test('read-only requests fail visibly in mutation mode', () => {
    assert.throws(() => service.replaceSelectedAllOptions(Object.freeze({ accounts: [all] })), TypeError);
});
