const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const root = path.resolve(__dirname, '../../apps/web-giddh/src/app');
function evaluate(source, bindings = {}) {
    const output = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } }).outputText;
    const exports = {};
    new Function('exports', ...Object.keys(bindings), output)(exports, ...Object.values(bindings));
    return exports;
}
function actionConstants(file, className) {
    const source = ts.createSourceFile(file, readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(n => ts.isClassDeclaration(n) && n.name.text === className);
    return Object.fromEntries(declaration.members.filter(n => ts.isPropertyDeclaration(n) && n.modifiers?.some(m => m.kind === ts.SyntaxKind.StaticKeyword) && n.initializer && ts.isStringLiteral(n.initializer)).map(n => [n.name.getText(source), n.initializer.text]));
}
const LoginActions = actionConstants('actions/login.action.ts', 'LoginActions');
const CompanyActions = actionConstants('actions/company.actions.ts', 'CompanyActions');
const integration = evaluate(readFileSync(path.join(root, 'actions/settings/settings.integration.const.ts'), 'utf8'));
const lodash = evaluate(readFileSync(path.join(root, 'lodash-optimized.ts'), 'utf8'));
function reducer(file, name) {
    const source = ts.createSourceFile(file, readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(n => ts.isFunctionDeclaration(n) && n.name.text === name);
    const bindings = { LoginActions, CompanyActions, ...integration, cloneDeep: lodash.cloneDeep };
    // Other action tables only participate in case matching; use distinct tokens.
    function visit(node) {
        if (ts.isCaseClause(node) && ts.isPropertyAccessExpression(node.expression)) {
            const table = node.expression.expression.getText(source);
            if (!bindings[table]) bindings[table] = new Proxy({}, { get: (_, key) => `${table}.${String(key)}` });
        }
        ts.forEachChild(node, visit);
    }
    visit(declaration);
    return evaluate(declaration.getText(source), bindings)[name];
}
const authentication = reducer('store/authentication/authentication.reducer.ts', 'AuthenticationReducer');
const session = reducer('store/authentication/authentication.reducer.ts', 'SessionReducer');
const settings = reducer('store/settings/Settings.reducer.ts', 'SettingsReducer');
test('Google response keeps the first-case loading transition and existing social-login flag', () => {
    for (const status of ['success', 'error']) for (const social of [false, true]) {
        const state = { isLoginWithGoogleInProcess: true, isLoggedInWithSocialAccount: social, retained: 'value' };
        const result = authentication(state, { type: LoginActions.SIGNUP_WITH_GOOGLE_RESPONSE, payload: { status } });
        assert.deepEqual(result, { ...state, isLoginWithGoogleInProcess: false });
        assert.equal(state.isLoginWithGoogleInProcess, true);
    }
});
test('company creation reset clears the same three flags and preserves company data', () => {
    const companies = [{ uniqueName: 'a' }];
    const state = { isCompanyCreated: true, isCompanyCreationInProcess: true, isCompanyCreationSuccess: true, companies };
    const result = session(state, { type: CompanyActions.RESET_CREATE_COMPANY_FLAG });
    assert.deepEqual(result, { ...state, isCompanyCreated: false, isCompanyCreationInProcess: false, isCompanyCreationSuccess: false });
    assert.equal(result.companies, companies);
    assert.equal(state.isCompanyCreated, true);
});
test('Cashfree updates payout data while autocollect remains a separate transition', () => {
    for (const status of ['success', 'error']) {
        const state = { integration: { payoutForm: { old: 'payout' }, autoCollect: { old: 'collection' } } };
        const request = { account: 'new' };
        const updated = settings(state, { type: integration.SETTINGS_INTEGRATION_ACTIONS.UPDATE_CASHFREE_DETAILS_RESPONSE, payload: { status, request } });
        const collected = settings(state, { type: integration.SETTINGS_INTEGRATION_ACTIONS.ADD_AUTOCOLLECT_USER_RESPONSE, payload: { status, request } });
        assert.deepEqual(updated.integration, { payoutForm: status === 'success' ? request : state.integration.payoutForm, autoCollect: state.integration.autoCollect });
        assert.deepEqual(collected.integration, { payoutForm: state.integration.payoutForm, autoCollect: status === 'success' ? request : state.integration.autoCollect });
        if (status === 'error') { assert.equal(updated, state); assert.equal(collected, state); }
        assert.deepEqual(state.integration.payoutForm, { old: 'payout' });
    }
});
