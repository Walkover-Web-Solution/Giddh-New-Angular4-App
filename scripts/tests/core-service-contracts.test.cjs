const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const { of, throwError, map, catchError } = require('rxjs');
const root = path.resolve(__dirname, '../../apps/web-giddh/src/app');

// Exercise actual request methods with recording HTTP and error boundaries.
// Angular construction/import wiring is checked separately by typecheck/build.
function evaluate(source, bindings = {}) {
    const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS } });
    const exports = {};
    new Function('exports', ...Object.keys(bindings), outputText)(exports, ...Object.values(bindings));
    return exports;
}
function loadMethods(file, className, bindings) {
    const source = ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(n => ts.isClassDeclaration(n) && n.name.text === className);
    const methods = declaration.members.filter(ts.isMethodDeclaration).map(n => n.getText(source)).join('\n');
    return evaluate(`export class ${className} { ${methods} }`, bindings)[className];
}
const apis = { ...evaluate(fs.readFileSync(path.join(root, 'services/apiurls/proforma.api.ts'), 'utf8')), ...evaluate(fs.readFileSync(path.join(root, 'services/apiurls/purchase-order.api.ts'), 'utf8')) };
const bindings = { ...apis, map, catchError };
const VoucherService = loadMethods('services/voucher.service.ts', 'VoucherService', bindings);
const ProformaService = loadMethods('services/proforma.service.ts', 'ProformaService', bindings);
const PurchaseOrderService = loadMethods('services/purchase-order.service.ts', 'PurchaseOrderService', bindings);
const GeneralService = loadMethods('services/general.service.ts', 'GeneralService', {});

function harness(failure = false) {
    const calls = [], catches = [];
    const response = { status: 'success', body: { uniqueName: 'saved' } };
    const error = { status: 422, error: { code: 'INVALID' } };
    const recovery = { status: 'error', message: 'rejected' };
    const http = Object.fromEntries(['post', 'put', 'deleteWithBody'].map(method => [method, (...args) => {
        calls.push({ method, args });
        return failure ? throwError(() => error) : of(response);
    }]));
    const errorHandler = { HandleCatch(...args) { catches.push(args); return of(recovery); } };
    const generalService = Object.assign(new GeneralService(), { companyUniqueName: 'company / north' });
    const dependencies = { http, errorHandler, generalService, config: { apiUrl: 'https://sandbox.invalid/' } };
    const proformaService = Object.assign(new ProformaService(), dependencies);
    const purchaseOrderService = Object.assign(new PurchaseOrderService(), dependencies);
    const service = Object.assign(new VoucherService(), dependencies, { proformaService, purchaseOrderService });
    return { service, calls, catches, response, error, recovery, generalService };
}
const cases = [
    ['getAllProformaEstimate', 'post', type => `company/company%20%2F%20north/vouchers/v3/${type}/all?page=2&count=25&from=2026-01-01&to=2026-01-31&q=a%26b&sort=asc&sortBy=date`],
    ['sendProformaEstimateOnEmail', 'post', type => `v3/company/company%20%2F%20north/accounts/account%20%2F%20one/${type}/mail`],
    ['updateAction', 'put', type => `v3/company/company%20%2F%20north/accounts/account%20%2F%20one/${type}/action`],
    ['generateInvoice', 'post', type => `company/company%20%2F%20north/vouchers/accounts/account%20%2F%20one/v3/generate-via-${type === 'proformas' ? 'proforma' : 'estimate'}`],
    ['generateProforma', 'post', () => 'v3/company/company%20%2F%20north/accounts/account%20%2F%20one/proformas/generate-via-estimate'],
    ['deleteEstimsteProformaVoucher', 'deleteWithBody', type => `v3/company/company%20%2F%20north/accounts/account%20%2F%20one/${type}`]
];
for (const [method, verb, suffix] of cases) for (const type of ['proformas', 'estimates']) {
    test(`${method}: ${type} URL, body, metadata and company context`, () => {
        const h = harness();
        const request = { accountUniqueName: 'account / one', page: 2, count: 25, from: '2026-01-01', to: '2026-01-31', q: 'a&b', sort: 'asc', sortBy: 'date' };
        let emitted;
        h.service[method](request, type).subscribe(value => emitted = value);
        assert.deepEqual(h.calls, [{ method: verb, args: [`https://sandbox.invalid/${suffix(type)}`, request] }]);
        assert.equal(h.calls[0].args[1], request);
        assert.equal(emitted, h.response);
        assert.equal(emitted.request, request);
        assert.deepEqual(emitted.queryString, method === 'getAllProformaEstimate' ? { page: 2, count: 25, from: request.from, to: request.to, type: 'pdf' } : type);
        // downloadPdfFile also reads this retained field; delegation must preserve it.
        assert.equal(h.service.companyUniqueName, h.generalService.companyUniqueName);
        h.generalService.companyUniqueName = 'company-two';
        h.service[method](request, type).subscribe();
        assert.ok(h.calls[1].args[0].includes('company/company-two/'));
    });
    test(`${method}: ${type} errors retain request context`, () => {
        const h = harness(true), request = { accountUniqueName: 'account / one', page: 2, count: 25, from: 'start', to: 'end' };
        let emitted;
        h.service[method](request, type).subscribe(value => emitted = value);
        assert.equal(emitted, h.recovery);
        assert.deepEqual(h.catches[0], method === 'getAllProformaEstimate' ? [h.error, request, { page: 2, count: 25, from: 'start', to: 'end', type: 'pdf' }] : [h.error, request]);
    });
}
for (const method of ['getVendorPurchaseOrders', 'getAllPendingPo']) {
    test(`${method}: pending purchase order query/body and error contract`, () => {
        const query = { companyUniqueName: 'company-one', accountUniqueName: 'vendor / one', from: 'unused-start', to: 'unused-end', page: 3, count: 10, sort: 'desc', sortBy: 'date' };
        const body = { search: 'purchase-order' };
        for (const failure of [false, true]) {
            const h = harness(failure);
            let emitted;
            h.service[method](query, body).subscribe(value => emitted = value);
            assert.deepEqual(h.calls, [{ method: 'post', args: ['https://sandbox.invalid/company/company-one/accounts/vendor%20%2F%20one/purchase-order/pending-numbers?page=3&count=10&sort=desc&sortBy=date&pendingItems=true', body] }]);
            assert.equal(h.calls[0].args[1], body);
            assert.equal(emitted, failure ? h.recovery : h.response);
            if (failure) assert.deepEqual(h.catches, [[h.error, query]]);
            else assert.equal(Object.hasOwn(emitted, 'request'), false);
        }
    });
}
