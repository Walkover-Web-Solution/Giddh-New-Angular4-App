const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const ts = require('typescript');
const { BehaviorSubject } = require('rxjs');
const storeModule = import('@angular/compiler').then(() => import('@ngrx/store'));

async function harness() {
    const { select, createSelector } = await storeModule;
    const file = path.resolve(__dirname, '../../apps/web-giddh/src/app/permissions/permission-data.service.ts');
    const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = source.statements.find(n => ts.isClassDeclaration(n) && n.name.text === 'PermissionDataService');
    const body = declaration.members.map(member => member.getText(source)).join('\n');
    const output = ts.transpileModule(`export class PermissionDataService { ${body} }`, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, useDefineForClassFields: false } }).outputText;
    const exports = {};
    new Function('exports', 'select', 'createSelector', output)(exports, select, createSelector);
    const companies = [{ uniqueName: 'a', createdBy: { name: 'Owner A' } }, { uniqueName: 'b', createdBy: { name: 'Owner B' } }];
    let session = { companies, companyUniqueName: 'a', companyUser: null };
    const store = new BehaviorSubject({ session });
    const service = new exports.PermissionDataService(store);
    function update(changes) { session = { ...session, ...changes }; store.next({ session }); }
    return { service, store, companies, update };
}
function role(entity, uniqueName, scopes) { return { entity: { entity }, role: { uniqueName, scopes } }; }
test('permission selection follows current company and preserves super-admin precedence', async () => {
    const h = await harness(), ordinary = [{ name: 'ledger', permissions: [] }], admin = [{ name: 'settings', permissions: [] }];
    assert.equal(h.service.getCompany, h.companies[0]);
    assert.deepEqual(h.service.getData, []);
    h.update({ companyUser: { userEntityRoles: [role('ACCOUNT', 'viewer', []), role('COMPANY', 'member', ordinary), role('COMPANY', 'super_admin', admin)] } });
    assert.equal(h.service.getData, admin);
    assert.equal(h.service.isUserSuperAdmin, true);
    h.update({ companyUniqueName: 'b' });
    assert.equal(h.service.getCompany, h.companies[1]);
    assert.equal(h.service.getData, admin);
    h.update({ companyUser: { userEntityRoles: [role('COMPANY', 'member', ordinary)] } });
    assert.equal(h.service.getData, ordinary);
    assert.equal(h.service.isUserSuperAdmin, false);
});
test('empty role responses retain prior scopes, and no-company roles use the first entry', async () => {
    const h = await harness(), scopes = [{ name: 'account', permissions: [] }];
    h.update({ companyUser: { userEntityRoles: [role('ACCOUNT', 'viewer', scopes)] } });
    assert.equal(h.service.getData, scopes);
    assert.equal(h.service.isUserSuperAdmin, false);
    h.update({ companyUser: { userEntityRoles: [] } });
    assert.equal(h.service.getData, scopes);
    h.update({ companyUser: null, companyUniqueName: 'missing' });
    assert.equal(h.service.getData, scopes);
    assert.equal(h.service.getCompany, undefined);
});
test('one store emission applies the matching company and role state before later subscribers read it', async () => {
    const h = await harness();
    const admin = [{ name: 'admin', permissions: [] }], member = [{ name: 'member', permissions: [] }];
    const observed = [];
    h.store.subscribe(() => observed.push({
        company: h.service.getCompany,
        scopes: h.service.getData,
        superAdmin: h.service.isUserSuperAdmin
    }));
    h.update({ companyUniqueName: 'b', companyUser: { userEntityRoles: [role('COMPANY', 'super_admin', admin), role('COMPANY', 'member', member)] } });
    assert.deepEqual(observed.at(-1), { company: h.companies[1], scopes: admin, superAdmin: true });
    h.update({ companyUniqueName: 'a', companyUser: { userEntityRoles: [role('COMPANY', 'member', member)] } });
    assert.deepEqual(observed.at(-1), { company: h.companies[0], scopes: member, superAdmin: false });
    const updatedCompany = { uniqueName: 'a', createdBy: { name: 'New owner' } };
    h.update({ companies: [updatedCompany], companyUser: { userEntityRoles: [] } });
    assert.deepEqual(observed.at(-1), { company: updatedCompany, scopes: member, superAdmin: false });
});
test('company switching keeps one owned store subscription', async () => {
    const h = await harness();
    for (let index = 0; index < 20; index++) h.update({ companyUniqueName: index % 2 ? 'a' : 'b' });
    assert.equal(h.store.observers.length, 1);
});
