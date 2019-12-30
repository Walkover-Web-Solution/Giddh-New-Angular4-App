import { StockReportActions } from './inventory/stocks-report.actions';
import { VerifyMobileActions } from './verifyMobile.actions';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { CompanyActions } from './company.actions';
import { LoginActions } from './login.action';
import { GroupWithAccountsAction } from './groupwithaccounts.actions';

import { AccountsAction } from './accounts.actions';
import { SidebarAction } from './inventory/sidebar.actions';
import { DaybookActions } from './daybook/daybook.actions';
import { CustomStockUnitAction } from './inventory/customStockUnit.actions';
import { PermissionActions } from './permission/permission.action';
/**
 * Home Module
 */
import { InventoryAction } from './inventory/inventory.actions';
import { SearchActions } from './search.actions';
import { AuditLogsActions } from './audit-logs/audit-logs.actions';
import { FlyAccountsActions } from './fly-accounts.actions';
import { TBPlBsActions } from './tl-pl.actions';
import { LedgerActions } from './ledger/ledger.actions';
import { HomeActions } from './home/home.actions';
import { SettingsIntegrationActions } from './settings/settings.integration.action';
import { SettingsProfileActions } from './settings/profile/settings.profile.action';
import { SettingsTaxesActions } from './settings/taxes/settings.taxes.action';
import { ManufacturingActions } from './manufacturing/manufacturing.actions';
import { SalesActions } from './sales/sales.action';
import { InvoiceActions } from './invoice/invoice.actions';
import { SettingsLinkedAccountsActions } from './settings/linked-accounts/settings.linked.accounts.action';
import { InvoicePurchaseActions } from './purchase-invoice/purchase-invoice.action';
import { SettingsFinancialYearActions } from './settings/financial-year/financial-year.action';
import { GeneralActions } from './general/general.actions';
import { SettingsPermissionActions } from './settings/permissions/settings.permissions.action';
import { SettingsBranchActions } from './settings/branch/settings.branch.action';
import { SessionActions } from './session.action';
import { SettingsTagActions } from './settings/tag/settings.tag.actions';
import { InventoryReportActions } from './inventory/inventory.report.actions';
import { InventoryEntryActions } from './inventory/inventory.entry.actions';
import { InventoryUsersActions } from './inventory/inventory.users.actions';
import { SettingsTriggersActions } from './settings/triggers/settings.triggers.actions';
import { ImportExcelActions } from './import-excel/import-excel.actions';
import { SettingsDiscountActions } from './settings/discount/settings.discount.action';
import { NewVsOldInvoicesActions } from './new-vs-old-invoices.actions';
import { CompanyImportExportActions } from './company-import-export/company-import-export.actions';
import { AgingReportActions } from './aging-report.actions';
import { InvoiceReceiptActions } from './invoice/receipt/receipt.actions';
import { GstReconcileActions } from './gst-reconcile/GstReconcile.actions';
import { SubscriptionsActions } from './userSubscriptions/subscriptions.action';
import { ProformaActions } from './proforma/proforma.actions';
import { ExpencesAction } from './expences/expence.action';
import { CommonActions } from './common.actions';
import { ItemOnBoardingActions } from './item-on-boarding/item-on-boarding.action';
import { WarehouseActions } from '../settings/warehouse/action/warehouse.action';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [
        EffectsModule.forRoot([
            HomeActions,
            GeneralActions,
            ExpencesAction,
            CompanyActions,
            LoginActions,
            GroupWithAccountsAction,
            VerifyMobileActions,
            AccountsAction,
            SidebarAction,
            InventoryAction,
            InventoryReportActions,
            InventoryEntryActions,
            InventoryUsersActions,
            SidebarAction,
            CustomStockUnitAction,
            StockReportActions,
            SearchActions,
            AuditLogsActions,
            PermissionActions,
            ManufacturingActions,
            FlyAccountsActions,
            TBPlBsActions,
            LedgerActions,
            DaybookActions,
            InvoiceActions,
            SettingsIntegrationActions,
            SettingsProfileActions,
            SettingsBranchActions,
            SettingsTagActions,
            SettingsTaxesActions,
            SalesActions,
            SettingsLinkedAccountsActions,
            InvoicePurchaseActions,
            SettingsFinancialYearActions,
            SettingsPermissionActions,
            SessionActions,
            SettingsTriggersActions,
            ImportExcelActions,
            SettingsDiscountActions,
            NewVsOldInvoicesActions,
            AgingReportActions,
            CompanyImportExportActions,
            InvoiceReceiptActions,
            CompanyImportExportActions,
            GstReconcileActions,
            SubscriptionsActions,
            ProformaActions,
            CommonActions,
            ItemOnBoardingActions,
            WarehouseActions
        ])
    ],
    exports: [EffectsModule]
})
export class ActionModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: ActionModule,
            providers: []
        };
    }
}
