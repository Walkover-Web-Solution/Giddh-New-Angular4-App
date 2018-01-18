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

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [
    EffectsModule.forRoot([
      HomeActions,
      GeneralActions,
      CompanyActions,
      LoginActions,
      GroupWithAccountsAction,
      VerifyMobileActions,
      AccountsAction,
      SidebarAction,
      InventoryAction,
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
      SettingsTaxesActions,
      SalesActions,
      SettingsLinkedAccountsActions,
      InvoicePurchaseActions,
      SettingsFinancialYearActions,
      SettingsPermissionActions
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
