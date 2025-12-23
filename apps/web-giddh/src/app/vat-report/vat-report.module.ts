import { NgModule } from "@angular/core";
import { VatReportComponent } from "./vat-report.component";
import { VatReportTransactionsComponent } from "./transactions/vat-report-transactions.component";
import { ObligationsComponent } from "./obligations/obligations.component";
import { ViewReturnComponent } from "./view-return/view-return.component";
import { FileReturnComponent } from "./file-return/file-return.component";
import { WithHeldSettingComponent } from "./with-held-setting/with-held-setting.component";
import { LiabilityReportComponent } from "./liability-report/liability-report.component";
import { LiabilityDetailedReportComponent } from "./liability-detailed-report/liability-detailed-report.component";
import { VatReportFiltersComponent } from "./vat-report-filters/vat-report-filters.component";
import { VatLiabilitiesPayments } from "./vat-liabilities-payments/vat-liabilities-payments.component";
import { VatReportRoutingModule } from "./vat-report.routing.module";
import { CommonModule } from "@angular/common";

import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule } from "@angular/forms";
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { ElementViewChildModule } from "../shared/helpers/directives/elementViewChild/elementViewChild.module";
// import { InvoiceModule } from "../invoice/invoice.module";
import { SharedModule } from "../shared/shared.module";
import { TaxSidebarModule } from "../shared/tax-sidebar/tax-sidebar.module";
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialogModule } from "@angular/material/dialog";
import { GiddhDateRangepickerModule } from "../theme/giddh-daterangepicker/giddh-daterangepicker.module";
import { DatepickerWrapperModule } from "../shared/datepicker-wrapper/datepicker.wrapper.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NewConfirmationModalModule } from "../theme/new-confirmation-modal/confirmation-modal.module";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { GiddhNumberFormatModule } from "../shared/helpers/pipes/number-format/number-format.module";

@NgModule({
    declarations: [
        VatReportComponent,
        VatReportTransactionsComponent,
        ObligationsComponent,
        ViewReturnComponent,
        FileReturnComponent,
        WithHeldSettingComponent,
        LiabilityReportComponent,
        LiabilityDetailedReportComponent,
        VatReportFiltersComponent,
        VatLiabilitiesPayments
    ],
    imports: [
        VatReportRoutingModule,
        CommonModule,
        GiddhNumberFormatModule,
        ClickOutsideModule,
        FormsModule,
        Daterangepicker,
        ElementViewChildModule,
        // InvoiceModule,
        SharedModule,
        TaxSidebarModule,
        FormFieldsModule,
        MatTooltipModule,
        MatButtonModule,
        MatTableModule,
        MatMenuModule,
        MatDialogModule,
        GiddhDateRangepickerModule,
        DatepickerWrapperModule,
        GiddhPageLoaderModule,
        NewConfirmationModalModule,
        MatInputModule,
        MatPaginatorModule
    ],
    exports: [
        VatReportRoutingModule,
        VatReportFiltersComponent
    ]
})
export class VatReportModule {
}
