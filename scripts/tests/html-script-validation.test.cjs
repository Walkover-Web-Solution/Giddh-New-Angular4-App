const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');
const helperPath = path.join(root, 'apps/web-giddh/src/app/shared/helpers/html-script-validation.ts');
const { outputText } = ts.transpileModule(readFileSync(helperPath, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS }
});
const helperExports = {};
new Function('exports', outputText)(helperExports);
const { containsHtmlOrScript } = helperExports;

const rejected = [
    '<script>alert(1)</script>',
    '< script >alert(1)</script>',
    '</script>',
    '<SCRIPT src="x"></SCRIPT>',
    '<h1>Title</h1>',
    '<img src=x onerror=alert(1)>',
    '<svg/onload=alert(1)>',
    '"><b>bold</b>',
    'javascript:alert(1)',
    'javascript :alert(1)'
];

const accepted = [
    '',
    'Office supplies',
    'Amount < 1000',
    '5 < 10 and a > b',
    'Rate <1000',
    'See the note',
    null,
    undefined,
    12
];

test('containsHtmlOrScript rejects tags and script URLs', () => {
    for (const value of rejected) {
        assert.equal(containsHtmlOrScript(value), true, value);
    }
});

test('containsHtmlOrScript keeps plain descriptions and comparisons', () => {
    for (const value of accepted) {
        assert.equal(containsHtmlOrScript(value), false, String(value));
    }
});

test('petty cash pending descriptions share the saved description and show the HTML/script error', () => {
    const expenseDetails = readFileSync(
        path.join(root, 'apps/web-giddh/src/app/expenses/components/expense-details/expense-details.component.html'),
        'utf8'
    );
    const expenseComponent = readFileSync(
        path.join(root, 'apps/web-giddh/src/app/expenses/components/expense-details/expense-details.component.ts'),
        'utf8'
    );
    const ledgerTemplate = readFileSync(
        path.join(root, 'apps/web-giddh/src/app/ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component.html'),
        'utf8'
    );
    const ledgerComponent = readFileSync(
        path.join(root, 'apps/web-giddh/src/app/ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.component.ts'),
        'utf8'
    );

    assert.match(expenseDetails, /\[\s*\(ngModel\)\s*\]\s*=\s*"accountEntryPettyCash\.description"/);
    assert.match(expenseDetails, /rejectHtmlScript/);
    assert.match(expenseDetails, /id="petty-cash-description-error"/);
    assert.doesNotMatch(expenseComponent, /public comment/);
    assert.match(expenseComponent, /containsHtmlOrScript\(this\.accountEntryPettyCash\?\.description\)/);

    assert.match(ledgerTemplate, /id="update-ledger-description"[\s\S]*rejectHtmlScript/);
    assert.match(ledgerTemplate, /id="update-ledger-description-error"/);
    assert.match(ledgerComponent, /containsHtmlOrScript\(this\.vm\.selectedLedger\?\.description\)/);
});
