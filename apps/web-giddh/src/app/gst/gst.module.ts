import { PurchaseModule } from '../purchase/purchase.module';
import { PushToGstInComponent } from './filing/tabs/push-to-gstin/push-to-gstin.component';
import { TransactionSummaryComponent } from './filing/tabs/push-to-gstin/components/transaction-summary/transaction-summary.component';
import { FilingComponent } from './filing/filing.component';
import { NgModule } from '@angular/core';
import { OverviewSummaryComponent } from './filing/tabs/overview/summary/summary.component';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { B2csSummaryComponent } from './filing/tabs/push-to-gstin/components/b2cs-summary/b2cs-summary.component';
import { NilSummaryComponent } from './filing/tabs/push-to-gstin/components/nil-summary/nil-summary.component';
import { FilingHeaderComponent } from './filing/header/filing-header.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { HsnSummaryComponent } from './filing/tabs/push-to-gstin/components/hsn-summary/hsn-summary.component';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ViewTransactionsComponent } from './filing/tabs/overview/view-transactions/view-transactions.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { LaddaModule } from 'angular2-ladda';
import { FailedTransactionsComponent } from './filing/tabs/push-to-gstin/components/failed-transactions/failed-transactions.component';
import { DocumentIssuedComponent } from './filing/tabs/push-to-gstin/components/document-issued/document-issued.component';
import { ReconcileComponent } from './filing/tabs/reconcilation/reconcilation.component';
import { InvoiceModule } from '../invoice/invoice.module';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { GstComponent } from './gst.component';
import { FilingOverviewComponent } from './filing/tabs/overview/overview.component';
import { GstRoutingModule } from './gst.routing.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { GstAsideMenuComponent } from './modals/gst-aside-menu/gst-aside-menu.component';
import { SharedModule } from '../shared/shared.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { UnitMappingComponent } from './unit-mapping/unit-mapping.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';
import { PushToPortalComponent } from './modals/push-to-portal/push-to-portal.component';
import { FilingStatusComponent } from './filing-status/filing-status.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GstSettingComponent } from './gst-setting/gst-setting.component';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';

@NgModule({
    declarations: [FileGstR3Component,
        GstComponent, FilingComponent, FilingHeaderComponent, FilingOverviewComponent,
        ReconcileComponent, PushToGstInComponent, ViewTransactionsComponent,
        OverviewSummaryComponent, TransactionSummaryComponent,
        PushToGstInComponent, NilSummaryComponent, HsnSummaryComponent, B2csSummaryComponent,
        DocumentIssuedComponent, FailedTransactionsComponent, GstAsideMenuComponent, UnitMappingComponent, PushToPortalComponent,FilingStatusComponent, GstSettingComponent],
    imports: [
        GstRoutingModule,
        Daterangepicker,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        HighlightModule,
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        TranslateDirectiveModule,
        PurchaseModule,
        InvoiceModule,
        GiddhNumberFormatModule,
        ConfirmModalModule,
        SharedModule,
        TaxSidebarModule,
        MatGridListModule,
        FormFieldsModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        WatchVideoModule,
        MatTooltipModule,
        MatDividerModule,
        MatSelectModule,
        MatTabsModule,
        MatDialogModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatMenuModule,
        MatListModule
    ],
    providers: [],
    exports: [ViewTransactionsComponent]
})
export class GstModule {
}
