import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { SharedModule } from '../shared/shared.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { CashFlowStatementComponent } from './components/cash-flow-statement-component/cash.flow.statement.component';
import { ColumnarReportComponent } from './components/columnar-report-component/columnar.report.component';
import { ColumnarReportTableComponent } from './components/columnar-report-table-component/columnar.report.table.component';
import { PurchaseRegisterComponent } from './components/purchase-register-component/purchase.register.component';
import { PurchaseRegisterExpandComponent } from './components/purchase-register-expand-component/purchase.register.expand.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component';
import { SalesRegisterExpandComponent } from './components/sales-register-expand-component/sales.register.expand.component';
import { ReportsComponent } from './reports.component';
import { ReportsRoutingModule } from './reports.routing.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { MatCardModule } from '@angular/material/card';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewConfirmModalModule } from '../theme/new-confirm-modal';
import { MatDialogModule } from '@angular/material/dialog';
import { SendEmailModule } from '../shared/send-email/send-email.module';
import { ConfirmModalModule } from '../theme/confirm-modal/confirm-modal.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SelectTableColumnModule } from '../shared/select-table-column/select-table-column.module';
import { SalesPurchaseRegisterExportComponent } from './sales-purchase-register-export/sales-purchase-register-export.component';
import { BulkExportVoucherModule } from '../shared/bulk-export-voucher/bulk-export-voucher.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { SerialNumberPipe } from '../shared/helpers/pipes/serialNumber.pipe';
import { MatSortModule } from '@angular/material/sort';
import { GiddhTableModule } from '../shared/common-table/giddh.table.module';
import { MatSelectModule } from '@angular/material/select';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SalesPersonService } from '../shared/sales-person/utility/sales-person.service';

@NgModule({
    declarations: [
        ReportsComponent,
        ReportsDetailsComponent,
        SalesRegisterExpandComponent,
        PurchaseRegisterComponent,
        PurchaseRegisterExpandComponent,
        ReverseChargeReport,
        ColumnarReportComponent,
        ColumnarReportTableComponent,
        CashFlowStatementComponent,
        SalesPurchaseRegisterExportComponent
    ],
    exports: [
        ReportsComponent,
        ReportsDetailsComponent,
        Daterangepicker
    ],
    providers: [SalesPersonService],
    imports: [
        ReportsRoutingModule,
        CommonModule,
        Daterangepicker,
        FormsModule,
        GiddhNumberFormatModule,
        AccountDetailModalModule,
        ReactiveFormsModule,
        ClickOutsideModule,
        ElementViewChildModule,
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
        SelectTableColumnModule,
        BulkExportVoucherModule,
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        SerialNumberPipe,
        MatSortModule,
        GiddhTableModule,
        MatSelectModule,
        NgxMatSelectSearchModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})

export class ReportsModule {

}
