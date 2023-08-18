import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CurrencyModule } from "../shared/helpers/pipes/currencyPipe/currencyType.module";
import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule } from "@angular/forms";
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

@NgModule({
    declarations: [
        VatReportComponent,
        VatReportTransactionsComponent
    ],
    providers: [],
    imports: [
        VatReportRoutingModule,
        TabsModule.forRoot(),
        CommonModule,
        TooltipModule.forRoot(),
        BsDatepickerModule.forRoot(),
        CurrencyModule,
        BsDropdownModule.forRoot(),
        ClickOutsideModule,
        DatepickerModule.forRoot(),
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
        GiddhPageLoaderModule
    ],
    exports: [
        VatReportRoutingModule
    ]
})
export class VatReportModule {
}
