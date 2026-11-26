const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const appRoot = path.resolve(__dirname, '../../apps/web-giddh/src/app');
const helperPath = path.join(appRoot, 'shared/helpers/invoice-custom-number-settings.helper.ts');

function evaluateTypeScript(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false },
    });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}

const { clearInactiveCustomNumberPrefixesOnSettingsSave } = evaluateTypeScript(readFileSync(helperPath, 'utf8'));

test('clears invoice prefixes when useCustomInvoiceNumber is false', () => {
    const formToSave = {
        invoiceSettings: {
            useCustomInvoiceNumber: false,
            branchInvoiceNumberPrefix: 'TEST-',
            invoiceNumberPrefix: 'INV',
            initialInvoiceNumber: 5,
        },
    };
    clearInactiveCustomNumberPrefixesOnSettingsSave(formToSave);
    assert.equal(formToSave.invoiceSettings.branchInvoiceNumberPrefix, null);
    assert.equal(formToSave.invoiceSettings.invoiceNumberPrefix, null);
    assert.equal(formToSave.invoiceSettings.initialInvoiceNumber, null);
});

test('keeps invoice prefixes when useCustomInvoiceNumber is true', () => {
    const formToSave = {
        invoiceSettings: {
            useCustomInvoiceNumber: true,
            branchInvoiceNumberPrefix: 'TEST-',
            invoiceNumberPrefix: 'INV',
            initialInvoiceNumber: 5,
        },
    };
    clearInactiveCustomNumberPrefixesOnSettingsSave(formToSave);
    assert.equal(formToSave.invoiceSettings.branchInvoiceNumberPrefix, 'TEST-');
    assert.equal(formToSave.invoiceSettings.invoiceNumberPrefix, 'INV');
    assert.equal(formToSave.invoiceSettings.initialInvoiceNumber, 5);
});

test('clears purchase order prefix when useCustomPONumber is false', () => {
    const formToSave = {
        purchaseBillSettings: {
            useCustomPONumber: false,
            poNumberPrefix: 'PO-',
            initialPONumber: 1,
        },
    };
    clearInactiveCustomNumberPrefixesOnSettingsSave(formToSave);
    assert.equal(formToSave.purchaseBillSettings.poNumberPrefix, null);
    assert.equal(formToSave.purchaseBillSettings.initialPONumber, null);
});