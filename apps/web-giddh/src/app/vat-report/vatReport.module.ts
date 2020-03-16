import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule, BsDatepickerModule, BsDropdownModule, DatepickerModule, PaginationComponent, PaginationModule, ModalModule } from 'ngx-bootstrap';
import { CurrencyModule } from "../shared/helpers/pipes/currencyPipe/currencyType.module";
import { ClickOutsideModule } from "ng-click-outside";
import { FormsModule } from "@angular/forms";
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { VatReportRoutingModule } from './vatReport.routing.module';
import { VatReportComponent } from './vatReport.component';
import { VatReportTransactionsComponent } from './transactions/vatReportTransactions.component';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { InvoiceModule } from '../invoice/invoice.module';

@NgModule({
    declarations: [
        VatReportComponent,
        VatReportTransactionsComponent
    ],
    providers: [

    ],
    imports: [
        VatReportRoutingModule,
        TabsModule,
        CommonModule,
        TooltipModule,
        BsDatepickerModule,
        CurrencyModule,
        BsDropdownModule,
        ClickOutsideModule,
        DatepickerModule,
        FormsModule,
        Daterangepicker,
        PaginationModule,
        ModalModule,
        ElementViewChildModule,
        InvoiceModule
    ],
    exports: [
        VatReportRoutingModule
    ],
    entryComponents: [PaginationComponent]
})
export class VatReportModule {
}
