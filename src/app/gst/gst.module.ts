import { GstComponent } from './gst.component';
import { GstRoutingModule } from './gst.routing.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgModule } from '@angular/core';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { FileGstR3Component } from './gstR3/gstR3.component';
import { FileGstR2Component } from './gstR2/gstR2.component';
import { FileGstR1Component } from './gstR1/gstR1.component';
import { FilingComponent } from './filing/filing.component';
import { FilingOverviewComponent } from './filing/tabs/overview/overview.component';
import { ReconcileComponent } from './filing/tabs/reconcilation/reconcilation.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PushToGstInComponent } from './filing/tabs/push-to-gstin/push-to-gstin.component';
import { ElementViewChildModule } from 'app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { DecimalDigitsModule } from 'app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { PurchaseModule } from 'app/purchase/purchase.module';
import { ViewTransactionsComponent } from './filing/tabs/overview/view-transactions/view-transactions.component';
import { OverviewSummaryComponent } from './filing/tabs/overview/summary/summary.component';
import { TransactionSummaryComponent } from './filing/tabs/push-to-gstin/components/transaction-summary/transaction-summary.component';
import { NilSummaryComponent } from './filing/tabs/push-to-gstin/components/nil-summary/nil-summary.component';
import { HsnSummaryComponent } from './filing/tabs/push-to-gstin/components/hsn-summary/hsn-summary.component';
import { B2csSummaryComponent } from './filing/tabs/push-to-gstin/components/b2cs-summary/b2cs-summary.component';
import { DocumentIssuedComponent } from './filing/tabs/push-to-gstin/components/document-issued/document-issued.component';
import { FailedTransactionsComponent } from './filing/tabs/push-to-gstin/components/failed-transactions/failed-transactions.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InvoiceModule } from 'app/invoice/invoice.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FilingHeaderComponent } from './filing/header/filing-header.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { GstAsideMenuComponent } from './modals/gst-aside-menu/gst-aside-menu.component';
import { NotePointsGstModalComponent } from './modals/note-points-gst-modal/note-points-gst-modal.component';
import { SubmitGstModalComponent } from './modals/submit-gst-modal/submit-gst-modal.component';

@NgModule({
  declarations: [FileGstR1Component, FileGstR2Component, FileGstR3Component,
    GstComponent, FilingComponent, FilingHeaderComponent, FilingOverviewComponent,
    ReconcileComponent, PushToGstInComponent, ViewTransactionsComponent,
    OverviewSummaryComponent, TransactionSummaryComponent,
    PushToGstInComponent, NilSummaryComponent, HsnSummaryComponent, B2csSummaryComponent,
    DocumentIssuedComponent, FailedTransactionsComponent, GstAsideMenuComponent,
    NotePointsGstModalComponent, SubmitGstModalComponent],
  imports: [
    GstRoutingModule,
    CollapseModule,
    PaginationModule,
    DatepickerModule,
    BsDropdownModule,
    Daterangepicker,
    LaddaModule,
    HighlightModule,
    TooltipModule,
    ClickOutsideModule,
    TabsModule,
    ElementViewChildModule,
    AlertModule,
    DecimalDigitsModule,
    ModalModule,
    PurchaseModule,
    InvoiceModule,
    PerfectScrollbarModule,
    CurrencyModule
  ],
  providers: [Location],
  entryComponents: [
    PaginationComponent
  ],
  exports: [ViewTransactionsComponent]
})
export class GstModule {
}
