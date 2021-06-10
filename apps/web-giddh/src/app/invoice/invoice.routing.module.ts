import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
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
import { InvoiceGenerateModelComponent } from './generate/model/invoice.generate.model.component';
import { DownloadOrSendInvoiceOnMailComponent } from './preview/models/download-or-send-mail/download-or-send-mail.component';
import { InvoiceTemplateModalComponent } from './templates/edit-template/modals/template-modal/template-modal.component';
import { InvoiceEmailFilterComponent } from './templates/edit-template/filters-container/email-filter/email-filter.component';
import { InvoiceTemplatePreviewModelComponent } from './templates/edit-template/modals/template-preview-modal/template-preview.modal.component';
import { EsignModalComponent } from './preview/models/e-Sign/e-Sign.component';
import { SelectModule } from '../theme/ng-select/ng-select';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { ElementViewChildModule } from 'apps/web-giddh/src/app/shared/helpers/directives/elementViewChild/elementViewChild.module';
import { DecimalDigitsModule } from 'apps/web-giddh/src/app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RecurringComponent } from './recurring/recurring.component';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TextMaskModule } from 'angular2-text-mask';
import { WebviewDirective } from './webview.directive';
import { Daterangepicker } from 'apps/web-giddh/src/app/theme/ng2-daterangepicker/daterangepicker.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { InvoiceAdvanceSearchComponent } from './preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { BulkExportModal } from './preview/models/bulk-export-modal/bulk-export.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { InvoiceBulkUpdateModalComponent } from './preview/models/bulkUpdateModal/invoiceBulkUpdateModal.component';
import { EWayBillCreateComponent } from './eWayBill/create/eWayBill.create.component';
import { GenerateEWayBillComponent } from './preview/models/generateEWayBill/generateEWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBill/eWayBillcredentialsModal/eWayBillCredentials.component';
import { EWayBillComponent } from './eWayBill/eWayBill/eWayBill.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { InvoicePreviewDetailsComponent } from './preview/models/invoice-preview-details/invoice-preview-details.component';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { UniqueNameModule } from '../shared/helpers/directives/uniqueName/uniqueName.module';
import { ProformaListComponent } from './proforma/proforma-list.component';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { InvoicePaymentModelComponent } from './preview/models/invoicePayment/invoice.payment.model.component';
import { SharedModule } from '../shared/shared.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { DownloadVoucherComponent } from './preview/models/download-voucher/download-voucher.component';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { HasFocusDirectiveModule } from '../shared/helpers/directives/has-focus/has-focus.module';
import { TrimPipeModule } from '../shared/helpers/pipes/trim/trim.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';

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
            { path: '', redirectTo: 'preview/sales', pathMatch: 'full' },
            { path: 'preview/:voucherType', component: InvoiceComponent },
            { path: 'preview/:voucherType/:selectedType', component: InvoiceComponent },
            { path: 'preview/:voucherType/:voucherNoForDetail/:voucherAction', component: InvoiceComponent },
            { path: 'ewaybill/create', component: EWayBillCreateComponent },

        ]
    },
    { path: 'ewaybill', canActivate: [NeedsAuthentication], component: EWayBillComponent },
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
        InvoicePaymentModelComponent,
        InvoiceGenerateModelComponent,
        DownloadOrSendInvoiceOnMailComponent,
        InvoiceTemplateModalComponent,
        InvoiceEmailFilterComponent,
        InvoiceTemplatePreviewModelComponent,
        EsignModalComponent,
        RecurringComponent,
        WebviewDirective,
        InvoiceAdvanceSearchComponent,
        BulkExportModal,
        InvoiceRendererComponent,
        InvoiceBulkUpdateModalComponent,
        GenerateEWayBillComponent,
        EWayBillCreateComponent,
        EWayBillComponent,
        EWayBillCredentialsComponent,
        InvoicePreviewDetailsComponent,
        ProformaListComponent,
        DownloadVoucherComponent,
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
        CollapseModule.forRoot(),
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
        AccountDetailModalModule,
        CurrencyModule,
        PerfectScrollbarModule,
        ProformaInvoiceModule,
        DigitsOnlyModule,
        UniqueNameModule,
        ConfirmModalModule,
        SharedModule,
        VoucherTypeToNamePipeModule,
        SendEmailInvoiceModule,
        AdvanceReceiptAdjustmentModule,
        HasFocusDirectiveModule,
        TrimPipeModule,
        TaxSidebarModule
    ],
    exports: [
        RouterModule,
        TooltipModule,
        DownloadOrSendInvoiceOnMailComponent,
        InvoiceGenerateModelComponent,
        InvoiceCreateComponent,
        InvoicePreviewComponent,
        DeleteInvoiceConfirmationModelComponent
    ],
    entryComponents: [DownloadOrSendInvoiceOnMailComponent],
    providers: [InvoiceUiDataService, {
        provide: FONT_PICKER_CONFIG,
        useValue: DEFAULT_FONT_PICKER_CONFIG
    }
    ]
})
export class InvoiceRoutingModule {
}
