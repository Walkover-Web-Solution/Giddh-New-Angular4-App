import { LogsService } from './logs.service';
import { StockReportActions } from './actions/inventory/stocks-report.actions';
import { ErrorHandler } from './catchManager/catchmanger';
import { VerifyMobileActions } from './actions/verifyMobile.actions';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { GroupService } from './group.service';
import { StorageService } from './storage.service';
import { HttpWrapperService } from './httpWrapper.service';
import { ErrorHandlerService } from './errorhandler.service';
import { ToasterService } from './toaster.service';
import { SharedModule } from '../shared/shared.module';
import { CompanyActions } from './actions/company.actions';
import { LoginActions } from './actions/login.action';
import { GroupWithAccountsAction } from './actions/groupwithaccounts.actions';

import { CompanyService } from './companyService.service';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { LocationService } from './location.service';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { AccountsAction } from './actions/accounts.actions';
import { AccountService } from './account.service';
import { SidebarAction } from './actions/inventory/sidebar.actions';
import { CustomStockUnitAction } from './actions/inventory/customStockUnit.actions';
import { InventoryService } from './inventory.service';
import { PermissionService } from './permission.service';
import { PermissionActions } from './actions/permission/permission.action';

/**
 * Home Module
 */
import { InventoryAction } from './actions/inventory/inventory.actions';
import { SearchActions } from './actions/search.actions';
import { SearchService } from './search.service';
import { AuditLogsActions } from './actions/audit-logs/audit-logs.actions';
import { FlyAccountsActions } from './actions/fly-accounts.actions';
import { TlPlService } from './tl-pl.service';
import { TlPlActions } from './actions/tl-pl.actions';
import { LedgerActions } from './actions/ledger/ledger.actions';
import { LedgerService } from './ledger.service';
import { HomeActions } from './actions/home/home.actions';
import { DashboardService } from './dashboard.service';
import { SettingsIntegrationService } from './settings.integraion.service';
import { SettingsIntegrationActions } from './actions/settings/settings.integration.action';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule,
    SharedModule.forRoot(),
    EffectsModule.run(HomeActions),
    EffectsModule.run(CompanyActions),
    EffectsModule.run(LoginActions),
    EffectsModule.run(GroupWithAccountsAction),
    EffectsModule.run(VerifyMobileActions),
    EffectsModule.run(AccountsAction),
    EffectsModule.run(SidebarAction),
    EffectsModule.run(InventoryAction),
    EffectsModule.run(SidebarAction),
    EffectsModule.run(CustomStockUnitAction),
    EffectsModule.run(StockReportActions),
    EffectsModule.run(SearchActions),
    EffectsModule.run(AuditLogsActions),
    EffectsModule.run(PermissionActions),
    EffectsModule.run(FlyAccountsActions),
    EffectsModule.run(TlPlActions),
    EffectsModule.run(LedgerActions),
    EffectsModule.run(SettingsIntegrationActions)
  ],
  exports: [CommonModule, FormsModule, RouterModule, EffectsModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        StorageService,
        HttpWrapperService,
        AuthenticationService,
        ErrorHandlerService,
        ToasterService,
        DashboardService,
        CompanyService,
        NeedsAuthentication,
        LocationService,
        UserAuthenticated,
        GroupService,
        AccountService,
        InventoryService,
        PermissionService,
        ErrorHandler,
        SearchService,
        LogsService,
        TlPlService,
        LedgerService,
        SettingsIntegrationService
      ]
    };
  }
}
