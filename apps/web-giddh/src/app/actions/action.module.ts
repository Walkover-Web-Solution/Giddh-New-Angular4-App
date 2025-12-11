// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: StockReportActions } from './inventory/stocks-report.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: VerifyMobileActions } from './verify-mobile.actions';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: CompanyActions } from './company.actions';
import { LoginActions } from './login.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: GroupWith// COMMENTED OUT - MISSING: AccountsAction } from './groupwithaccounts.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: AccountsAction } from './accounts.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: SidebarAction } from './inventory/sidebar.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: CustomStockUnitAction } from './inventory/custom-stock-unit.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: PermissionActions } from './permission/permission.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InventoryAction } from './inventory/inventory.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: SearchActions } from './search.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: AuditLogsActions } from './audit-logs/audit-logs.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: TBPlBsActions } from './tl-pl.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: LedgerActions } from './ledger/ledger.actions';
import { HomeActions } from './home/home.actions';
import { SettingsIntegrationActions } from './settings/settings.integration.action';
import { SettingsProfileActions } from './settings/profile/settings.profile.action';
import { SettingsTaxesActions } from './settings/taxes/settings.taxes.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: ManufacturingActions } from './manufacturing/manufacturing.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: SalesActions } from './sales/sales.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InvoiceActions } from './invoice/invoice.actions';
// COMMENTED OUT - MISSING: import { SettingsLinkedAccountsActions } from './settings/linked-accounts/settings.linked.accounts.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InvoicePurchaseActions } from './purchase-invoice/purchase-invoice.action';
// COMMENTED OUT - MISSING: import { SettingsFinancialYearActions } from './settings/financial-year/financial-year.action';
import { GeneralActions } from './general/general.actions';
// COMMENTED OUT - MISSING: import { SettingsPermissionActions } from './settings/permissions/settings.permissions.action';
// COMMENTED OUT - MISSING: import { SettingsBranchActions } from './settings/branch/settings.branch.action';
import { SessionActions } from './session.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InventoryReportActions } from './inventory/inventory.report.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InventoryEntryActions } from './inventory/inventory.entry.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InventoryUsersActions } from './inventory/inventory.users.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: AgingReportActions } from './aging-report.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: InvoiceReceiptActions } from './invoice/receipt/receipt.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: GstReconcileActions } from './gst-reconcile/gst-reconcile.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: SubscriptionsActions } from './user-subscriptions/subscriptions.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: ProformaActions } from './proforma/proforma.actions';
import { CommonActions } from './common.actions';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: ItemOnBoardingActions } from './item-on-boarding/item-on-boarding.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: WarehouseActions } from '../settings/warehouse/action/warehouse.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: PurchaseRecordActions } from './purchase-record/purchase-record.action';
// COMMENTED OUT - MISSING: import { // COMMENTED OUT - MISSING: PurchaseOrderActions } from './purchase-order/purchase-order.action';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        EffectsModule.forRoot([ HomeActions,
        GeneralActions,
        // COMMENTED OUT - MISSING: CompanyActions,
        LoginActions,
        // COMMENTED OUT - MISSING: GroupWith// COMMENTED OUT - MISSING: AccountsAction,
        // COMMENTED OUT - MISSING: VerifyMobileActions,
        // COMMENTED OUT - MISSING: AccountsAction,
        // COMMENTED OUT - MISSING: SidebarAction,
        // COMMENTED OUT - MISSING: InventoryAction,
        // COMMENTED OUT - MISSING: InventoryReportActions,
        // COMMENTED OUT - MISSING: InventoryEntryActions,
        // COMMENTED OUT - MISSING: InventoryUsersActions,
        // COMMENTED OUT - MISSING: SidebarAction,
        // COMMENTED OUT - MISSING: CustomStockUnitAction,
        // COMMENTED OUT - MISSING: StockReportActions,
        // COMMENTED OUT - MISSING: SearchActions,
        // COMMENTED OUT - MISSING: AuditLogsActions,
        // COMMENTED OUT - MISSING: PermissionActions,
        // COMMENTED OUT - MISSING: ManufacturingActions,
        // COMMENTED OUT - MISSING: TBPlBsActions,
        // COMMENTED OUT - MISSING: LedgerActions,
        // COMMENTED OUT - MISSING: InvoiceActions,
        SettingsIntegrationActions,
        SettingsProfileActions,
        // COMMENTED OUT - MISSING: SettingsBranchActions,
        SettingsTaxesActions,
        // COMMENTED OUT - MISSING: SalesActions,
        // COMMENTED OUT - MISSING: SettingsLinkedAccountsActions,
        // COMMENTED OUT - MISSING: InvoicePurchaseActions,
        // COMMENTED OUT - MISSING: SettingsFinancialYearActions,
        // COMMENTED OUT - MISSING: SettingsPermissionActions,
        // COMMENTED OUT - MISSING: SessionActions,
        // COMMENTED OUT - MISSING: AgingReportActions,
        // COMMENTED OUT - MISSING: InvoiceReceiptActions,
        // COMMENTED OUT - MISSING: GstReconcileActions,
        // COMMENTED OUT - MISSING: SubscriptionsActions,
        // COMMENTED OUT - MISSING: ProformaActions,
        CommonActions,
        // COMMENTED OUT - MISSING: ItemOnBoardingActions,
        // COMMENTED OUT - MISSING: WarehouseActions,
        // COMMENTED OUT - MISSING: PurchaseRecordActions,
        // COMMENTED OUT - MISSING: PurchaseOrderActions

        ])
    ],
    exports: [
        EffectsModule
    ]
})
export class ActionModule {
    public static forRoot(): ModuleWithProviders<ActionModule> {
        return {
            ngModule: ActionModule,
            providers: []
        };
    }
}
