const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');

const appRoot = path.resolve(__dirname, '../../apps/web-giddh/src/app');
const components = [
    'settings/integration/campaign/setting-campaign/setting-campaign.component.ts',
    'settings/triggers-old/triggers.component.ts',
    'shared/triggers/components/advance-trigger/advance-trigger.component.ts'
];
function evaluate(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, {
        compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false }
    });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}
const helperPath = path.join(appRoot, 'shared/triggers/uitilty/trigger-form-validation.ts');
const bindings = existsSync(helperPath) ? evaluate(readFileSync(helperPath, 'utf8')) : {};
bindings.cloneDeep = evaluate(readFileSync(path.join(appRoot, 'lodash-optimized.ts'), 'utf8')).cloneDeep;
bindings.takeUntil = () => observable => observable;
const fields = ['title', 'condition', 'entity', 'subConditions', 'campaignSlug', 'triggerToChiplist'];
const messages = ['invalid_title', 'invalid_action', 'invalid_entity', 'invalid_sub_entity', 'invalid_slug', 'invalid_to'];
function validTrigger() {
    return { title: 'Invoice reminder', condition: { action: ['created'], entity: 'Voucher', subConditions: [{ action: ['sales'] }] }, campaignDetails: { campaignName: 'Reminder', to: ['customer@example.invalid'] } };
}
const invalidate = [
    model => model.title = '',
    model => model.condition.action = [],
    model => model.condition.entity = '',
    model => model.condition.subConditions = [],
    model => model.campaignDetails.campaignName = null,
    model => model.campaignDetails.to = []
];
for (const component of components) {
    const source = ts.createSourceFile(component, readFileSync(path.join(appRoot, component), 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(node => ts.isClassDeclaration(node));
    const methods = declaration.members.filter(node => ts.isMethodDeclaration(node) && ['resetValidationErrors', 'validateTriggerForm', 'createTriggerForm', 'updateTriggerForm'].includes(node.name.getText(source)));
    const { TriggerForm } = evaluate(`export class TriggerForm { ${methods.map(method => method.getText(source)).join('\n')} }`, bindings);
    function form(model = validTrigger(), locale = Object.fromEntries(messages.map(key => [key, `message:${key}`]))) {
        const instance = new TriggerForm();
        const calls = [];
        instance.createTrigger = model;
        instance.mandatoryFields = Object.fromEntries([...fields, 'authKey'].map(key => [key, true]));
        instance.localeData = locale === null ? null : { communication: locale };
        instance.toasty = { showSnackBar: (...args) => calls.push(args) };
        return { instance, calls };
    }
    test(`${component}: valid input clears field errors without changing request or authentication errors`, () => {
        const model = validTrigger();
        const before = structuredClone(model);
        const { instance, calls } = form(model);
        assert.equal(instance.validateTriggerForm(), true);
        assert.deepEqual(model, before);
        assert.deepEqual(calls, []);
        assert.ok(fields.every(field => instance.mandatoryFields[field] === false));
        assert.equal(instance.mandatoryFields.authKey, true);
    });
    test(`${component}: validation preserves each first-error field, message, and priority`, () => {
        for (let index = 0; index < fields.length; index++) {
            const model = validTrigger();
            for (const mutate of invalidate.slice(index)) mutate(model);
            const { instance, calls } = form(model);
            assert.equal(instance.validateTriggerForm(), false);
            assert.deepEqual(fields.filter(field => instance.mandatoryFields[field]), [fields[index]]);
            assert.deepEqual(calls, [['error', `message:${messages[index]}`]]);
        }
    });
    test(`${component}: a repaired form clears old errors on the next attempt`, () => {
        const { instance, calls } = form();
        instance.createTrigger.title = '';
        assert.equal(instance.validateTriggerForm(), false);
        instance.createTrigger.title = 'Repaired title';
        assert.equal(instance.validateTriggerForm(), true);
        assert.ok(fields.every(field => instance.mandatoryFields[field] === false));
        assert.equal(calls.length, 1);
    });
    test(`${component}: missing translations and malformed models retain existing behavior`, () => {
        const { instance, calls } = form(validTrigger(), null);
        instance.createTrigger.title = '';
        assert.equal(instance.validateTriggerForm(), false);
        assert.deepEqual(calls, [['error', undefined]]);
        instance.createTrigger = { title: 'Title' };
        assert.throws(() => instance.validateTriggerForm(), TypeError);
    });
    for (const operation of ['create', 'update']) {
        function submission(model = validTrigger()) {
            const fixture = form(model);
            const { instance } = fixture;
            const requests = [];
            const transitions = [];
            let respond;
            instance.disableSubmitButton = false;
            instance.showTriggerForm = true;
            instance.triggerMode = 'update';
            instance.triggerUniquename = 'trigger-existing';
            instance.resetCommunicationForm = () => transitions.push('reset');
            instance.getTriggers = () => transitions.push('refresh');
            instance.campaignIntegrationService = {
                [`${operation}Trigger`]: (...args) => {
                    requests.push(args);
                    return { pipe: () => ({ subscribe: callback => respond = callback }) };
                }
            };
            return { ...fixture, requests, transitions, respond: response => respond(response) };
        }
        test(`${component}: ${operation} validates before submitting`, () => {
            const fixture = submission();
            fixture.instance.createTrigger.title = '';
            fixture.instance[`${operation}TriggerForm`](fixture.instance.createTrigger);
            assert.equal(fixture.requests.length, 0);
            assert.equal(fixture.instance.disableSubmitButton, false);
            assert.deepEqual(fixture.transitions, []);
            assert.deepEqual(fixture.calls, [['error', 'message:invalid_title']]);
        });
        test(`${component}: ${operation} preserves request filtering and success transitions`, () => {
            const model = validTrigger();
            model.campaignDetails.argsMapping = [{ name: 'blank', value: '' }, { name: 'zero', value: 0 }, { name: 'missing' }, { name: 'text', value: 'invoice.number' }];
            const before = structuredClone(model);
            const fixture = submission(model);
            fixture.instance[`${operation}TriggerForm`](model);
            assert.equal(fixture.instance.disableSubmitButton, true);
            assert.equal(fixture.requests.length, 1);
            const [request, uniqueName] = fixture.requests[0];
            assert.notEqual(request, model);
            assert.deepEqual(request.campaignDetails.argsMapping, model.campaignDetails.argsMapping.slice(1));
            assert.equal(request.campaignDetails.argsMapping[0], model.campaignDetails.argsMapping[1]);
            assert.deepEqual(model, before);
            assert.equal(uniqueName, operation === 'update' ? 'trigger-existing' : undefined);
            fixture.respond({ status: 'success', body: 'Updated' });
            assert.equal(fixture.instance.disableSubmitButton, false);
            assert.equal(fixture.instance.showTriggerForm, false);
            assert.equal(fixture.instance.triggerMode, 'create');
            assert.deepEqual(fixture.transitions, ['reset', 'refresh']);
            assert.deepEqual(fixture.calls, [['success', operation === 'update' ? 'Updated' : undefined]]);
        });
        test(`${component}: ${operation} keeps the form open and retryable on an API error`, () => {
            const fixture = submission();
            fixture.instance[`${operation}TriggerForm`](fixture.instance.createTrigger);
            fixture.respond({ status: 'error', message: 'Rejected' });
            assert.equal(fixture.instance.disableSubmitButton, false);
            assert.equal(fixture.instance.showTriggerForm, true);
            assert.deepEqual(fixture.transitions, []);
            assert.deepEqual(fixture.calls, [['error', 'Rejected']]);
        });
    }

}
