import { PurchaseModule } from '../purchase/purchase.module';
import { PushToGstInComponent } from './filing/tabs/push-to-gstin/push-to-gstin.component';
import { TransactionSummaryComponent } from './filing/tabs/push-to-gstin/components/transaction-summary/transaction-summary.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
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
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { UnitMappingComponent } from './unit-mapping/unit-mapping.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    declarations: [FileGstR3Component,
        GstComponent, FilingComponent, FilingHeaderComponent, FilingOverviewComponent,
        ReconcileComponent, PushToGstInComponent, ViewTransactionsComponent,
        OverviewSummaryComponent, TransactionSummaryComponent,
        PushToGstInComponent, NilSummaryComponent, HsnSummaryComponent, B2csSummaryComponent,
        DocumentIssuedComponent, FailedTransactionsComponent, GstAsideMenuComponent, UnitMappingComponent],
    imports: [
        GstRoutingModule,
        CollapseModule,
        PaginationModule.forRoot(),
        DatepickerModule,
        BsDropdownModule.forRoot(),
        Daterangepicker,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        HighlightModule,
        TooltipModule.forRoot(),
        ClickOutsideModule,
        TabsModule.forRoot(),
        ElementViewChildModule,
        AlertModule,
        DecimalDigitsModule,
        ModalModule,
        PurchaseModule,
        InvoiceModule,
        PerfectScrollbarModule,
        CurrencyModule,
        ConfirmModalModule,
        SharedModule,
        ShSelectModule,
        TaxSidebarModule,
        MatGridListModule,
        FormFieldsModule,
        MatButtonModule,
    ],
    providers: [],
    entryComponents: [
        PaginationComponent
    ],
    exports: [ViewTransactionsComponent]
})
export class GstModule {
}
