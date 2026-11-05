const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const featureRoot = path.resolve(__dirname, '../../apps/web-giddh/src/app/financial-reports');

function evaluate(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
    });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}

// Extract the actual grid methods, without Angular/DOM bootstrapping. The same
// characterization suite runs before and after moving their shared traversal.
const helperPath = path.join(featureRoot, 'report-selection.ts');
const helper = existsSync(helperPath) ? evaluate(readFileSync(helperPath, 'utf8')) : {};
for (const report of ['balance-sheet', 'profit-loss', 'trial-balance']) {
    const filename = path.join(featureRoot, `components/${report}/components/${report}-grid/${report}-grid.component.ts`);
    const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
    const component = source.statements.find(ts.isClassDeclaration);
    const names = new Set(['extractCheckedAccountsGroups', 'uncheckAll']);
    const methods = component.members.filter(member => ts.isMethodDeclaration(member) && names.has(member.name.getText(source)));
    assert.equal(methods.length, 2, `${report}: both request-building methods must be covered`);
    let scheduled;
    const reportType = { BALANCE_SHEET: 'bs', PROFIT_LOSS: 'pl', TRIAL_BALANCE: 'tb' };
    const { Grid } = evaluate(`export class Grid { ${methods.map(method => method.getText(source)).join('\n')} }`, {
        ...helper,
        ReportType: reportType,
        setTimeout: (callback, delay) => { scheduled = { callback, delay }; }
    });
    function grid() {
        const instance = new Grid();
        instance.listOfCheckGroupsAccounts = [];
        return instance;
    }
    const unchecked = (uniqueName, entityType) => ({ uniqueName, entityType, checked: false });

    test(`${report}: keeps depth-first group/account order, duplicates and input state`, () => {
        const input = [
            { uniqueName: 'root', checked: true, childGroups: [
                { uniqueName: 'nested', checked: false, accounts: [{ uniqueName: 'same', checked: true }] }
            ], accounts: [{ uniqueName: 'same', checked: true }, { uniqueName: 'ignored', checked: false }] },
            { uniqueName: 'last', checked: true }
        ];
        const original = structuredClone(input);
        const instance = grid();
        const selected = instance.listOfCheckGroupsAccounts;
        instance.extractCheckedAccountsGroups(input, 'group');
        assert.equal(instance.listOfCheckGroupsAccounts, selected);
        assert.deepEqual(selected, [unchecked('root', 'group'), unchecked('same', 'account'), unchecked('same', 'account'), unchecked('last', 'group')]);
        assert.deepEqual(input, original);
    });

    test(`${report}: appends to the existing request and keeps explicit root entity type`, () => {
        const instance = grid();
        const old = unchecked('already-selected', 'group');
        instance.listOfCheckGroupsAccounts.push(old);
        instance.extractCheckedAccountsGroups([{ uniqueName: 'root', checked: true, childGroups: [{ uniqueName: 'child', checked: true }] }], 'account');
        assert.equal(instance.listOfCheckGroupsAccounts[0], old);
        assert.deepEqual(instance.listOfCheckGroupsAccounts, [old, unchecked('root', 'account'), unchecked('child', 'group')]);
    });

    test(`${report}: ignores non-array collections and retains existing truthiness semantics`, () => {
        const instance = grid();
        for (const value of [undefined, null, {}, 'abc', { length: 1, 0: { checked: true } }]) {
            instance.extractCheckedAccountsGroups(value, 'group');
        }
        instance.extractCheckedAccountsGroups([{ uniqueName: 'truthy', checked: 1, childGroups: 'abc', accounts: { length: 1 } }], 'group');
        assert.deepEqual(instance.listOfCheckGroupsAccounts, [unchecked('truthy', 'group')]);
    });

    test(`${report}: preserves visible failures and already-collected entries for invalid members`, () => {
        const instance = grid();
        assert.throws(() => instance.extractCheckedAccountsGroups([{ uniqueName: 'valid', checked: true }, null], 'group'), TypeError);
        assert.deepEqual(instance.listOfCheckGroupsAccounts, [unchecked('valid', 'group')]);
    });

    test(`${report}: uncheck request retains scope, dates, report type and existing delay`, () => {
        const instance = grid();
        const first = [{ uniqueName: 'first', checked: true }];
        const second = [{ uniqueName: 'second', checked: true }];
        instance.bsData = { liabilities: first, assets: second };
        instance.plData = { incArr: first, expArr: second };
        instance.data$ = { groupDetails: [...first, ...second] };
        instance.from = '01-01-2026';
        instance.to = '31-01-2026';
        instance.generalService = { currentBranchUniqueName: 'branch-1' };
        const requests = [];
        instance.financialReportsComponentStore = { tailedReportAccountGroup: request => requests.push(request) };
        instance.uncheckAll();
        assert.equal(requests.length, 0);
        assert.equal(scheduled.delay, 400);
        scheduled.callback();
        assert.deepEqual(requests, [{ request: {
            reportType: { 'balance-sheet': 'bs', 'profit-loss': 'pl', 'trial-balance': 'tb' }[report],
            from: '01-01-2026', to: '31-01-2026', branchUniqueName: 'branch-1'
        }, payload: [unchecked('first', 'group'), unchecked('second', 'group')] }]);
        assert.equal(requests[0].payload, instance.listOfCheckGroupsAccounts);
    });

    test(`${report}: no checked nodes produces no request`, () => {
        const instance = grid();
        instance.bsData = { liabilities: [], assets: [] };
        instance.plData = { incArr: [], expArr: [] };
        instance.data$ = { groupDetails: [] };
        instance.financialReportsComponentStore = { tailedReportAccountGroup: () => assert.fail('Unexpected request') };
        instance.uncheckAll();
        scheduled.callback();
    });
}
