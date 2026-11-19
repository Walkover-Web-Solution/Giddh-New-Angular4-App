const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const headerPath = path.resolve(__dirname, '../../apps/web-giddh/src/app/shared/header/header.component.ts');

function evaluateTypeScript(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false }
    });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}

const source = ts.createSourceFile('header.component.ts', readFileSync(headerPath, 'utf8'), ts.ScriptTarget.Latest, true);
const headerClass = source.statements.find(
    (statement) => ts.isClassDeclaration(statement) && statement.name?.text === 'HeaderComponent'
);
const methodSources = headerClass.members
    .filter((member) => ts.isMethodDeclaration(member) && ['toggleHelpSupportPane', 'toggleSidebarPane'].includes(member.name.getText(source)))
    .map((member) => member.getText(source))
    .join('\n');

const { HeaderComponent } = evaluateTypeScript(`export class HeaderComponent { ${methodSources} }`);

function createHarness() {
    const openCalls = [];
    const closeCalls = [];
    const dialogs = new Map();
    let nextId = 1;

    const dialog = {
        getDialogById(id) {
            return dialogs.get(id) ?? null;
        },
        open(templateRef, config) {
            const id = `help-dialog-${nextId++}`;
            const ref = {
                id,
                close() {
                    closeCalls.push(id);
                    dialogs.delete(id);
                }
            };
            dialogs.set(id, ref);
            openCalls.push({ id, templateRef, config });
            return ref;
        }
    };

    const instance = new HeaderComponent();
    instance.dialog = dialog;
    instance.asideHelpSupportMenuStateRef = { elementRef: 'help-template' };
    instance.toggleSidebarPane = () => {};

    return { instance, dialog, openCalls, closeCalls, dialogs };
}

test('toggleHelpSupportPane(true): first click opens the help drawer', () => {
    const { instance, openCalls, closeCalls } = createHarness();
    instance.toggleHelpSupportPane(true);
    assert.equal(openCalls.length, 1);
    assert.equal(closeCalls.length, 0);
    assert.ok(instance.asideHelpSupportDialogRef);
});

test('toggleHelpSupportPane(true): second click while open does not close the drawer', () => {
    const { instance, openCalls, closeCalls, dialogs } = createHarness();
    instance.toggleHelpSupportPane(true);
    instance.toggleHelpSupportPane(true);
    assert.equal(openCalls.length, 1);
    assert.equal(closeCalls.length, 0);
    assert.ok(dialogs.has(instance.asideHelpSupportDialogRef.id));
});

test('toggleHelpSupportPane: close then open again works', () => {
    const { instance, openCalls, closeCalls } = createHarness();
    instance.toggleHelpSupportPane(true);
    const firstId = instance.asideHelpSupportDialogRef.id;
    instance.toggleHelpSupportPane(false);
    assert.deepEqual(closeCalls, [firstId]);
    assert.equal(instance.asideHelpSupportDialogRef, undefined);
    instance.toggleHelpSupportPane(true);
    assert.equal(openCalls.length, 2);
    assert.notEqual(openCalls[1].id, firstId);
});