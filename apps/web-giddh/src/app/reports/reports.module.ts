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
import { AdvanceReceiptReportComponent } from './components/advance-receipt-report/advance-receipt-report.component';
import { CashFlowStatementComponent } from './components/cash-flow-statement-component/cash.flow.statement.component';
import { ColumnarReportComponent } from './components/columnar-report-component/columnar.report.component';
import { ColumnarReportTableComponent } from './components/columnar-report-table-component/columnar.report.table.component';
import { PurchaseRegisterComponent } from './components/purchase-register-component/purchase.register.component';
import { PurchaseRegisterExpandComponent } from './components/purchase-register-expand-component/purchase.register.expand.component';
import { PurchaseRegisterTableComponent } from './components/purchase-register-table-component/purchase.register.table.component';
import { ReceiptAdvanceSearchComponent } from './components/receipt-advance-search/receipt-advance-search.component';
import { ReportsDashboardComponent } from './components/report-dashboard/reports.dashboard.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { ReportsTableComponent } from './components/report-table-components/report.table.component';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component';
import { SalesRegisterExpandComponent } from './components/sales-register-expand-component/sales.register.expand.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { PaymentReportComponent } from './components/payment-report/payment-report.component';
import { PaymentAdvanceSearchComponent } from './components/payment-advance-search/payment-advance-search.component';
import { PreviewComponent } from '../payment-receipt/components/preview/preview.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { NewConfirmModalModule } from '../theme/new-confirm-modal';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { SendEmailModule } from '../shared/send-email/send-email.module';
import { ConfirmModalModule } from '../theme/confirm-modal/confirm-modal.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';
import { SelectTableColumnModule } from '../shared/select-table-column/select-table-column.module';

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsDetailsComponent,
        ReportsTableComponent,
        SalesRegisterExpandComponent,
        ReportsDashboardComponent,
        PurchaseRegisterComponent,
        PurchaseRegisterTableComponent,
        PurchaseRegisterExpandComponent,
        ReverseChargeReport,
        ColumnarReportComponent,
        AdvanceReceiptReportComponent,
        ReceiptAdvanceSearchComponent,
        ColumnarReportTableComponent,
        CashFlowStatementComponent,
        PaymentReportComponent,
        PaymentAdvanceSearchComponent,
        PreviewComponent
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
        BsDropdownModule.forRoot(),
        PaginationModule.forRoot(),
        ShSelectModule,
        FormsModule,
        CurrencyModule,
        AccountDetailModalModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        TooltipModule.forRoot(),
        ElementViewChildModule,
        ModalModule.forRoot(),
        SharedModule,
        TaxSidebarModule,
        NoDataModule,
        MatCardModule,
        FormFieldsModule,
        MatMenuModule,
        MatButtonModule,
        MatTooltipModule,
        NewConfirmModalModule,
        MatDialogModule,
        SendEmailModule,
        ConfirmModalModule,
        MatSlideToggleModule,
        SelectTableColumnModule
    ]
})

export class ReportsModule {

}
