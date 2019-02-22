import { ShSelectModule } from './../theme/ng-virtual-select/sh-select.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';

import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { InvoiceComponent } from './invoice.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceGenerateComponent } from './generate/invoice.generate.component';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';
import { InvoiceCreateComponent } from './create/invoice.create.component';
import { InvoiceTemplatesModule } from './templates/invoice.templates.module';
import { EditInvoiceComponent } from './templates/edit-template/edit.invoice.component';
import { InvoiceSettingComponent } from './settings/invoice.settings.component';

import { FONT_PICKER_CONFIG, FontPickerConfigInterface, FontPickerModule } from 'ngx-font-picker';
import { NgxUploaderModule } from 'ngx-uploader';
import { DesignFiltersContainerComponent } from './templates/edit-template/filters-container/design-filters/design.filters.component';
import { EditFiltersContainersComponent } from './templates/edit-template/filters-container/edit.filters.component';
import { InvoiceUiDataService } from '../services/invoice.ui.data.service';
import { DeleteInvoiceConfirmationModelComponent } from './preview/models/confirmation/confirmation.model.component';
import { PerformActionOnInvoiceModelComponent } from './preview/models/perform_action/invoice.action.model.component';
import { InvoiceGenerateModelComponent } from './generate/model/invoice.generate.model.component';
import { DownloadOrSendInvoiceOnMailComponent } from './preview/models/download-or-send-mail/download-or-send-mail.component';
import { InvoiceTemplateModalComponent } from './templates/edit-template/modals/template-modal/template-modal.component';
import { InvoiceEmailFilterComponent } from './templates/edit-template/filters-container/email-filter/email-filter.component';
import { DeleteTemplateConfirmationModelComponent } from './templates/edit-template/modals/confirmation-modal/confirmation.modal.component';
import { InvoiceTemplatePreviewModelComponent } from './templates/edit-template/modals/template-preview-modal/template-preview.modal.component';
import { EsignModalComponent } from './preview/models/e-Sign/e-Sign.component';
import { InvoicePageDDComponent } from '../shared/invoice-page-dd/invoice.page.dd.component';
import { SelectModule } from '../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { ElementViewChildModule } from 'app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { DecimalDigitsModule } from 'app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { BsDropdownModule, TabsModule } from 'ngx-bootstrap';
import { RecurringComponent } from './recurring/recurring.component';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TextMaskModule } from 'angular2-text-mask';
import { ReceiptComponent } from './receipt/receipt.component';
import { PreviewDownloadReceiptComponent } from './receipt/models/preview-download-receipt.component';
import { ReceiptUpdateComponent } from './receipt/receipt-update/receiptUpdate.component';
import { WebviewDirective } from './webview.directive';
import { Daterangepicker } from 'app/theme/ng2-daterangepicker/daterangepicker.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { InvoiceAdvanceSearchComponent } from './preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { InvoiceBulkUpdateModalComponent } from './preview/models/bulkUpdateModal/invoiceBulkUpdateModal.component';
// import { DownloadReceiptComponent } from './receipt/models/download-receipt.component';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: 'AIzaSyAAvwBeHl0uuVSEVeZ3bTylwIkRGKCFvdI'
};
const INVOICE_ROUTES: Routes = [
  {
    path: '',
    canActivate: [NeedsAuthentication],
    component: InvoiceRendererComponent,
    children: [
      {path: '', redirectTo: 'preview/sales', pathMatch: 'full'},
      {path: 'preview/:voucherType', component: InvoiceComponent},
      // {path: 'generate/:voucherType', component: InvoiceGenerateComponent},
      // {path: 'templates/:voucherType', component: EditInvoiceComponent},
      // {path: 'settings', component: InvoiceSettingComponent},
      // {path: 'recurring', component: RecurringComponent},
      {path: 'receipt', component: ReceiptComponent},
      // {path: 'cr-note', component: ReceiptComponent},
      // {path: 'dr-note', component: ReceiptComponent}
    ]
  }
];

@NgModule({
  declarations: [
    InvoiceComponent,
    InvoicePreviewComponent,
    InvoiceGenerateComponent,
    EditInvoiceComponent,
    InvoiceCreateComponent,
    DesignFiltersContainerComponent,
    EditFiltersContainersComponent,
    InvoiceSettingComponent,
    DeleteInvoiceConfirmationModelComponent,
    PerformActionOnInvoiceModelComponent,
    InvoiceGenerateModelComponent,
    DownloadOrSendInvoiceOnMailComponent,
    InvoiceTemplateModalComponent,
    InvoiceEmailFilterComponent,
    DeleteTemplateConfirmationModelComponent,
    InvoiceTemplatePreviewModelComponent,
    EsignModalComponent,
    InvoicePageDDComponent,
    RecurringComponent,
    ReceiptComponent,
    ReceiptUpdateComponent,
    PreviewDownloadReceiptComponent,
    WebviewDirective,
    InvoiceAdvanceSearchComponent,
    InvoiceRendererComponent,
    InvoiceBulkUpdateModalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    TabsModule,
    ReactiveFormsModule,
    ModalModule,
    TooltipModule,
    PaginationModule,
    RouterModule.forChild(INVOICE_ROUTES),
    InvoiceTemplatesModule,
    KeyboardShortutModule,
    FontPickerModule,
    BsDatepickerModule.forRoot(),
    NgxUploaderModule,
    SelectModule,
    LaddaModule,
    ShSelectModule,
    ClickOutsideModule,
    ElementViewChildModule,
    DecimalDigitsModule,
    DatepickerModule,
    BsDropdownModule,
    AsideMenuRecurringEntryModule,
    SalesShSelectModule,
    TextMaskModule,
    Daterangepicker,
    AccountDetailModalModule
  ],
  exports: [
    RouterModule,
    TooltipModule,
    DownloadOrSendInvoiceOnMailComponent,
    InvoiceGenerateModelComponent,
    InvoiceCreateComponent
  ],
  entryComponents: [DownloadOrSendInvoiceOnMailComponent, PreviewDownloadReceiptComponent,
    ReceiptUpdateComponent],
  providers: [InvoiceUiDataService, {
    provide: FONT_PICKER_CONFIG,
    useValue: DEFAULT_FONT_PICKER_CONFIG
  }
  ]
})
export class InvoiceRoutingModule {
}
