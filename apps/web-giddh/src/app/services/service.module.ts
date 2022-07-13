import { PermissionDataService } from "../permissions/permission-data.service";
import { LogsService } from "./logs.service";
import { GiddhErrorHandler } from "./catchManager/catchmanger";
import { ModuleWithProviders, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuthenticationService } from "./authentication.service";
import { GroupService } from "./group.service";
import { HttpWrapperService } from "./httpWrapper.service";
import { ToasterService } from "./toaster.service";
import { CompanyService } from "./companyService.service";
import { LocationService } from "./location.service";
import { AccountService } from "./account.service";
import { InventoryService } from "./inventory.service";
import { PermissionService } from "./permission.service";
import { ManufacturingService } from "./manufacturing.service";
import { SearchService } from './search.service';
import { TlPlService } from './tl-pl.service';
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
import { SettingsBranchService } from './settings.branch.service';
import { SettingsTagService } from './settings.tag.service';
import { ContactService } from './contact.service';
import { SettingsTriggersService } from './settings.triggers.service';
import { RecurringVoucherService } from './recurring-voucher.service';
import { ImportExcelService } from './import-excel.service';
import { SettingsDiscountService } from './settings.discount.service';
import { NewVsOldInvoicesService } from './new-vs-old-invoices.service';
import { CompanyImportExportService } from './companyImportExportService';
import { AgingreportingService } from './agingreporting.service';
import { GstReconcileService } from './GstReconcile.service';
import { ReceiptService } from './receipt.service';
import { DbService } from './db.service';
import { VersionCheckService } from 'apps/web-giddh/src/app/version-check.service';
import { SubscriptionsService } from './subscriptions.service';
import { ProformaService } from './proforma.service';
import { ExpenseService } from './expences.service';
import { CommonService } from './common.service';
import { VatService } from './vat.service';
import { CommandKService } from './commandk.service';
import { PurchaseRecordService } from './purchase-record.service';
import { InvoiceBulkUpdateService } from './invoice.bulkupdate.service';
import { EcommerceService } from './ecommerce.service';
import { ReverseChargeService } from './reversecharge.service';
import { CashFlowStatementService } from './cashflowstatement.service';
import { PurchaseOrderService } from './purchase-order.service';
import { BulkVoucherExportService } from './bulkvoucherexport.service';
import { LocaleService } from './locale.service';
import { CustomFieldsService } from "./custom-fields.service";
import { ActivityLogsService } from "./activity-logs.service";
import { DownloadsService } from "./downloads.service";

/**
 * Do not specify providers for modules that might be imported by a lazy loaded module.
 */

@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [CommonModule, FormsModule, RouterModule]
})
export class ServiceModule {
    public static forRoot(): ModuleWithProviders<ServiceModule> {
        return {
            ngModule: ServiceModule,
            providers: [
                GeneralService,
                PermissionDataService,
                LoaderService,
                GiddhErrorHandler,
                HttpWrapperService,
                AuthenticationService,
                ToasterService,
                DashboardService,
                CompanyService,
                SalesService,
                PurchaseRecordService,
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
                ActivityLogsService,
                TlPlService,
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
                RecurringVoucherService,
                ImportExcelService,
                SettingsDiscountService,
                NewVsOldInvoicesService,
                AgingreportingService,
                CompanyImportExportService,
                ReceiptService,
                DbService,
                GstReconcileService,
                VersionCheckService,
                SubscriptionsService,
                ProformaService,
                ExpenseService,
                CommonService,
                VatService,
                CommandKService,
                InvoiceBulkUpdateService,
                EcommerceService,
                ReverseChargeService,
                CashFlowStatementService,
                PurchaseOrderService,
                BulkVoucherExportService,
                LocaleService,
                CustomFieldsService,
                DownloadsService
            ]
        };
    }
}
