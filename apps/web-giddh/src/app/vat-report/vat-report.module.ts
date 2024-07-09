import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CurrencyModule } from "../shared/helpers/pipes/currencyPipe/currencyType.module";
import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { VatReportRoutingModule } from './vat-report.routing.module';
import { VatReportComponent } from './vat-report.component';
import { VatReportTransactionsComponent } from './transactions/vat-report-transactions.component';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { GiddhDateRangepickerModule } from '../theme/giddh-daterangepicker/giddh-daterangepicker.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { ObligationsComponent } from './obligations/obligations.component';
import { ViewReturnComponent } from './view-return/view-return.component';
import { FileReturnComponent } from './file-return/file-return.component';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { WithHeldSettingComponent } from './with-held-setting/with-held-setting.component';
import { LiabilityReportComponent } from './liability-report/liability-report.component';
import { LiabilityDetailedReportComponent } from './liability-detailed-report/liability-detailed-report.component';
import { VatReportFiltersComponent } from './vat-report-filters/vat-report-filters.component';

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
        VatReportFiltersComponent
    ],
    imports: [
        VatReportRoutingModule,
        TabsModule.forRoot(),
        CommonModule,
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CurrencyModule,
        BsDropdownModule.forRoot(),
        ClickOutsideModule,
        FormsModule,
        Daterangepicker,
        PaginationModule.forRoot(),
        ModalModule.forRoot(),
        ElementViewChildModule,
        InvoiceModule,
        ShSelectModule,
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
        ReactiveFormsModule
    ],
    exports: [
        VatReportRoutingModule,
        VatReportFiltersComponent
    ]
})
export class VatReportModule {
}
