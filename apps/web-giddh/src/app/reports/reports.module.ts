import { NgModule } from '@angular/core';
import { ReportsRoutingModule } from './reports.routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { Options } from 'highcharts';
import { BsDropdownModule, DatepickerModule, TooltipModule, } from 'ngx-bootstrap';

import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ReportsGraphComponent } from './components/report-graph-component/report.graph.component';
import { ReportsTableComponent } from './components/report-table-components/report.table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { ChartModule } from 'angular2-highcharts';
import { SalesRegisterComponent } from './components/sales-register-component/sales.register.component';
import { SalesRegisterExpandComponent } from './components/salesRegister-expand-component/sales.register.expand.component';
import { SalesRegisterDetailsComponent } from './components/sales-register-details-component/sales.register.details.component';
import { ReportsDashboardComponent } from './components/report-dashboard/reports.dashboard.component';
import { PurchaseRegisterComponent } from './components/purchase-register-component/purchase.register.component';
import { PurchaseRegisterTableComponent } from './components/purchase-register-table-component/purchase.register.table.component';
import { PurchaseRegisterExpandComponent } from './components/purchase-register-expand-component/purchase.register.expand.component';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component';
import { AdvanceReceiptReport } from './components/advance-receipt-report/advance-receipt-report.component';
import { AdjustInvoiceAdvanceSearchComponent } from './components/adjust-invoice-advance-search/adjust-invoice-advance-search.component';
import { RefundAmountComponent } from './components/refund-amount/refund-amount.component';
import { AdjustInvoiceModalComponent } from './components/adjust-invoice-modal/adjust-invoice-modal.component';

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsDetailsComponent,
        ReportsGraphComponent,
        ReportsTableComponent,
        SalesRegisterComponent,
        SalesRegisterExpandComponent,
        SalesRegisterDetailsComponent,
        ReportsDashboardComponent,
        PurchaseRegisterComponent,
        PurchaseRegisterTableComponent,
        PurchaseRegisterExpandComponent,
        ReverseChargeReport,
        AdvanceReceiptReport,
        AdjustInvoiceAdvanceSearchComponent,
        RefundAmountComponent,
        AdjustInvoiceModalComponent
    ],
    exports: [
        ReportsComponent,
        ReportsDetailsComponent,
        DatepickerModule,
        BsDropdownModule,
        Daterangepicker,
        PaginationModule
    ],
    providers: [],
    imports: [
        ReportsRoutingModule,
        BsDatepickerModule.forRoot(),
        CommonModule,
        ChartModule,
        BsDropdownModule,
        PaginationModule,
        ShSelectModule,
        FormsModule,
        CurrencyModule,
        AccountDetailModalModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        TooltipModule,
        ModalModule.forRoot(),
    ]
})

export class ReportsModule {

}
