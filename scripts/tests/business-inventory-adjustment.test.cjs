const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const dayjs = require('dayjs');

const filename = path.resolve(__dirname, '../../apps/web-giddh/src/app/new-inventory/component/adjust-inventory/adjust-inventory.component.ts');
const source = ts.createSourceFile(filename, readFileSync(filename, 'utf8'), ts.ScriptTarget.Latest, true);
const component = source.statements.find(statement => ts.isClassDeclaration(statement) && statement.name.text === 'AdjustInventoryComponent');
const names = new Set(['createInventoryAdjustment', 'updateInventoryAdjustment', 'prepareInventoryAdjustmentRequest', 'cleanObject']);
const methods = component.members.filter(member => ts.isMethodDeclaration(member) && names.has(member.name.getText(source)));
const { outputText } = ts.transpileModule(`export class Adjustment { ${methods.map(method => method.getText(source)).join('\n')} }`, {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
});
const exportsObject = {};
new Function('exports', 'dayjs', 'GIDDH_DATE_FORMAT', outputText)(exportsObject, dayjs, 'DD-MM-YYYY');
const { Adjustment } = exportsObject;

function instance(date) {
    const value = {
        date, refNo: 'adjust-1', warehouseUniqueName: 'warehouse-2', reasonUniqueName: 'reason-3',
        variantUniqueNames: ['old'], adjustmentMethodName: 'display', expenseAccountName: 'display',
        reasonName: 'display', warehouseName: 'display', items: ['business-only'], description: '', changeValue: 0
    };
    const model = new Adjustment();
    model.isFormSubmitted = true;
    model.apiCallInProgress = false;
    model.adjustInventoryCreateEditForm = { invalid: false, value, get: key => ({ value: value[key] }) };
    model.selection = { selected: [{ variant: { uniqueName: 'variant-b' } }, { variant: { uniqueName: 'variant-a' } }, { variant: { uniqueName: 'variant-b' } }] };
    model.generalService = { currentBranchUniqueName: 'branch-4' };
    model.requests = [];
    model.componentStore = {
        createInventoryAdjustment: request => model.requests.push({ action: 'create', request }),
        updateInventoryAdjustment: request => model.requests.push({ action: 'update', request })
    };
    model.markFormInvalidAndFocus = () => { model.invalidMarked = true; };
    model.createBusinessDocumentInventoryAdjustment = () => { model.businessDocumentCalled = true; };
    return model;
}

for (const action of ['create', 'update']) {
    const invoke = model => model[`${action}InventoryAdjustment`]();
    test(`${action} adjustment: payload values, order, branch and mutation stay unchanged`, () => {
        const model = instance('23-10-2026');
        const original = model.adjustInventoryCreateEditForm.value;
        invoke(model);
        assert.deepEqual(model.requests, [{ action, request: {
            formValue: { date: '23-10-2026', refNo: 'adjust-1', warehouseUniqueName: 'warehouse-2', reasonUniqueName: 'reason-3',
                variantUniqueNames: ['variant-b', 'variant-a', 'variant-b'], description: '', changeValue: 0 },
            branchUniqueName: 'branch-4'
        } }]);
        assert.equal(model.requests[0].request.formValue, original);
        assert.equal(model.apiCallInProgress, true);
        assert.equal(model.isFormSubmitted, false);
    });
    test(`${action} adjustment: object dates keep the existing date formatting`, () => {
        const model = instance(new Date(2026, 9, 23, 12));
        invoke(model);
        assert.equal(model.requests[0].request.formValue.date, '23-10-2026');
    });
    test(`${action} adjustment: invalid form stops before payload mutation or dispatch`, () => {
        const model = instance('23-10-2026');
        model.adjustInventoryCreateEditForm.invalid = true;
        const value = structuredClone(model.adjustInventoryCreateEditForm.value);
        invoke(model);
        assert.equal(model.invalidMarked, true);
        assert.equal(model.isFormSubmitted, false);
        assert.equal(model.apiCallInProgress, false);
        assert.deepEqual(model.adjustInventoryCreateEditForm.value, value);
        assert.deepEqual(model.requests, []);
    });
    test(`${action} adjustment: empty and incomplete selections retain their current representation`, () => {
        const model = instance('raw-date');
        model.selection.selected = [];
        invoke(model);
        assert.deepEqual(model.requests[0].request.formValue.variantUniqueNames, []);
        model.selection.selected = [null, {}, { variant: {} }];
        invoke(model);
        assert.deepEqual(model.requests[1].request.formValue.variantUniqueNames, [undefined, undefined, undefined]);
        assert.equal(model.requests[1].request.formValue.date, 'raw-date');
    });
    test(`${action} adjustment: malformed selection still fails visibly before dispatch`, () => {
        const model = instance('23-10-2026');
        model.selection.selected = null;
        assert.throws(() => invoke(model), TypeError);
        assert.equal(model.apiCallInProgress, false);
        assert.deepEqual(model.requests, []);
    });
}

test('business-document creation keeps its separate validation and request path', () => {
    const model = instance('23-10-2026');
    model.isBusinessDocumentMode = true;
    model.adjustInventoryCreateEditForm.invalid = true;
    const original = structuredClone(model.adjustInventoryCreateEditForm.value);
    model.createInventoryAdjustment();
    assert.equal(model.businessDocumentCalled, true);
    assert.equal(model.invalidMarked, undefined);
    assert.equal(model.isFormSubmitted, false);
    assert.deepEqual(model.adjustInventoryCreateEditForm.value, original);
    assert.deepEqual(model.requests, []);
});
