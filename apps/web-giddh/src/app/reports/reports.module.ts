import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { AdjustInvoiceModalComponent } from './components/adjust-invoice-modal/adjust-invoice-modal.component';
import { AdvanceReceiptReportComponent } from './components/advance-receipt-report/advance-receipt-report.component';
import { CashFlowStatementComponent } from './components/cash-flow-statement-component/cash.flow.statement.component';
import { ColumnarReportComponent } from './components/columnar-report-component/columnar.report.component';
import { ColumnarReportTableComponent } from './components/columnar-report-table-component/columnar.report.table.component';
import { PurchaseRegisterComponent } from './components/purchase-register-component/purchase.register.component';
import {
    PurchaseRegisterExpandComponent,
} from './components/purchase-register-expand-component/purchase.register.expand.component';
import {
    PurchaseRegisterTableComponent,
} from './components/purchase-register-table-component/purchase.register.table.component';
import { ReceiptAdvanceSearchComponent } from './components/receipt-advance-search/receipt-advance-search.component';
import { RefundAmountComponent } from './components/refund-amount/refund-amount.component';
import { ReportsDashboardComponent } from './components/report-dashboard/reports.dashboard.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { ReportsGraphComponent } from './components/report-graph-component/report.graph.component';
import { ReportsTableComponent } from './components/report-table-components/report.table.component';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component';
import { SalesRegisterComponent } from './components/sales-register-component/sales.register.component';
import {
    SalesRegisterDetailsComponent,
} from './components/sales-register-details-component/sales.register.details.component';
import { SalesRegisterExpandComponent } from './components/salesRegister-expand-component/sales.register.expand.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';

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
        ColumnarReportComponent,
        AdvanceReceiptReportComponent,
        ReceiptAdvanceSearchComponent,
        RefundAmountComponent,
        AdjustInvoiceModalComponent,
        ColumnarReportTableComponent,
        CashFlowStatementComponent
    ],
    entryComponents: [
        ReceiptAdvanceSearchComponent
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
        CommonModule,
        Daterangepicker,
        BsDropdownModule,
        PaginationModule,
        ShSelectModule,
        FormsModule,
        CurrencyModule,
        AccountDetailModalModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        TooltipModule,
        ElementViewChildModule,
        ModalModule.forRoot(),
        SharedModule,
        TaxSidebarModule
    ]
})

export class ReportsModule {

}
