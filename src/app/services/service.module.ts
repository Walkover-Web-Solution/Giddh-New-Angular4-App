import { MagicLinkService } from './magic-link.service';
import { PermissionDataService } from './../permissions/permission-data.service';
import { LogsService } from './logs.service';
import { ErrorHandler } from './catchManager/catchmanger';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthenticationService } from './authentication.service';
import { GroupService } from './group.service';
import { StorageService } from './storage.service';
import { HttpWrapperService } from './httpWrapper.service';
import { ToasterService } from './toaster.service';

import { CompanyService } from './companyService.service';
import { LocationService } from './location.service';
import { AccountService } from './account.service';
import { InventoryService } from './inventory.service';
import { PermissionService } from './permission.service';
import { ManufacturingService } from './manufacturing.service';
/**
 * Home Module
 */
import { SearchService } from './search.service';
import { TlPlService } from './tl-pl.service';
import { LedgerService } from './ledger.service';
import { DaybookService } from './daybook.service';
import { DashboardService } from './dashboard.service';
import { SettingsIntegrationService } from './settings.integraion.service';
import { SettingsProfileService } from './settings.profile.service';
import { SettingsTaxesService } from './settings.taxes.service';
import { SalesService } from './sales.service';
import { InvoiceService } from './invoice.service';
import { InvoiceTemplatesService } from './invoice.templates.service';
import { SettingsLinkedAccountsService } from './settings.linked.accounts.service';
import { PurchaseInvoiceService } from './purchase-invoice.service';
import { SettingsFinancialYearService } from './settings.financial-year.service';
import { SettingsPermissionService } from './settings.permission.service';
import { LoaderService } from '../loader/loader.service';
import { GeneralService } from './general.service';
import { ServiceConfig, IServiceConfigArgs } from './service.config';
import { SettingsBranchService } from './settings.branch.service';
import { SettingsTagService } from './settings.tag.service';
import { ContactService } from './contact.service';
import { SettingsTriggersService } from './settings.triggers.service';
import { RecurringVoucherService } from './recurring-voucher.service';

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
  imports: [CommonModule, RouterModule
  ],
  exports: [CommonModule, FormsModule, RouterModule]
})
export class ServiceModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServiceModule,
      providers: [
        GeneralService,
        PermissionDataService,
        LoaderService,
        StorageService,
        ErrorHandler,
        HttpWrapperService,
        AuthenticationService,
        ToasterService,
        DashboardService,
        CompanyService,
        SalesService,
        LocationService,
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
        MagicLinkService,
        SettingsIntegrationService,
        SettingsProfileService,
        SettingsTaxesService,
        SettingsLinkedAccountsService,
        PurchaseInvoiceService,
        SettingsFinancialYearService,
        SettingsPermissionService,
        DaybookService,
        SettingsBranchService,
        SettingsTagService,
        ContactService,
        SettingsTriggersService,
        RecurringVoucherService
      ]
    };
  }
}
