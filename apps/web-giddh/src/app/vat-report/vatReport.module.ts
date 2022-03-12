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
import { FormsModule } from "@angular/forms";
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { VatReportRoutingModule } from './vatReport.routing.module';
import { VatReportComponent } from './vatReport.component';
import { VatReportTransactionsComponent } from './transactions/vatReportTransactions.component';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';

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
        TooltipModule,
        BsDatepickerModule.forRoot(),
        CurrencyModule,
        BsDropdownModule,
        ClickOutsideModule,
        FormsModule,
        Daterangepicker,
        PaginationModule,
        ModalModule,
        ElementViewChildModule,
        InvoiceModule,
        ShSelectModule,
        SharedModule,
        TaxSidebarModule
    ],
    exports: [
        VatReportRoutingModule
    ]
})
export class VatReportModule {
}
