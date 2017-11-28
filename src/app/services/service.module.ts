import { LogsService } from './logs.service';
import { StockReportActions } from '../actions/inventory/stocks-report.actions';
import { ErrorHandler } from './catchManager/catchmanger';
import { VerifyMobileActions } from '../actions/verifyMobile.actions';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { GroupService } from './group.service';
import { StorageService } from './storage.service';
import { HttpWrapperService } from './httpWrapper.service';
import { ToasterService } from './toaster.service';
import { CompanyActions } from '../actions/company.actions';
import { LoginActions } from '../actions/login.action';
import { GroupWithAccountsAction } from '../actions/groupwithaccounts.actions';

import { CompanyService } from './companyService.service';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { LocationService } from './location.service';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { AccountsAction } from '../actions/accounts.actions';
import { AccountService } from './account.service';
import { SidebarAction } from '../actions/inventory/sidebar.actions';
import { CustomStockUnitAction } from '../actions/inventory/customStockUnit.actions';
import { InventoryService } from './inventory.service';
import { PermissionService } from './permission.service';
import { ManufacturingService } from './manufacturing.service';
import { PermissionActions } from '../actions/permission/permission.action';
/**
 * Home Module
 */
import { InventoryAction } from '../actions/inventory/inventory.actions';
import { SearchActions } from '../actions/search.actions';
import { SearchService } from './search.service';
import { AuditLogsActions } from '../actions/audit-logs/audit-logs.actions';
import { FlyAccountsActions } from '../actions/fly-accounts.actions';
import { TlPlService } from './tl-pl.service';
import { TBPlBsActions } from '../actions/tl-pl.actions';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { LedgerService } from './ledger.service';
import { HomeActions } from '../actions/home/home.actions';
import { DashboardService } from './dashboard.service';
import { SettingsIntegrationService } from './settings.integraion.service';
import { SettingsIntegrationActions } from '../actions/settings/settings.integration.action';
import { SettingsProfileService } from './settings.profile.service';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { SettingsTaxesActions } from '../actions/settings/taxes/settings.taxes.action';
import { SettingsTaxesService } from './settings.taxes.service';
import { ManufacturingActions } from '../actions/manufacturing/manufacturing.actions';
import { SalesActions } from '../actions/sales/sales.action';
import { SalesService } from './sales.service';
import { NewUserAuthGuard } from './decorators/newUserGuard';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { InvoiceService } from './invoice.service';
import { InvoiceTemplatesService } from './invoice.templates.service';
import { SettingsLinkedAccountsService } from './settings.linked.accounts.service';
import { SettingsLinkedAccountsActions } from '../actions/settings/linked-accounts/settings.linked.accounts.action';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { InvoicePurchaseActions } from '../actions/purchase-invoice/purchase-invoice.action';
import { SettingsFinancialYearActions } from '../actions/settings/financial-year/financial-year.action';
import { SettingsFinancialYearService } from './settings.financial-year.service';
import { GeneralActions } from '../actions/general/general.actions';
import { SettingsPermissionActions } from '../actions/settings/permissions/settings.permissions.action';
import { SettingsPermissionService } from './settings.permission.service';
import { LoaderService } from '../loader/loader.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
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
  exports: [CommonModule, FormsModule, RouterModule, EffectsModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        LoaderService,
        StorageService,
        ErrorHandler,
        HttpWrapperService,
        AuthenticationService,
        ToasterService,
        DashboardService,
        CompanyService,
        SalesService,
        NeedsAuthentication,
        LocationService,
        UserAuthenticated,
        NewUserAuthGuard,
        GroupService,
        AccountService,
        InventoryService,
        PermissionService,
        ManufacturingService,
        SearchService,
        InvoiceService,
        InvoiceTemplatesService,
        LogsService,
        TlPlService,
        LedgerService,
        SettingsIntegrationService,
        SettingsProfileService,
        SettingsTaxesService,
        SettingsLinkedAccountsService,
        PurchaseInvoiceService,
        SettingsFinancialYearService,
        SettingsPermissionService
      ]
    };
  }
}
