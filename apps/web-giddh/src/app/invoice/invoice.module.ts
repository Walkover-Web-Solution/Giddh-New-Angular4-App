import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { EWayBillCreateComponent } from './eWayBill/create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill/eWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBill/eWayBillcredentialsModal/eWayBillCredentials.component';
import { InvoiceGenerateComponent } from './generate/invoice.generate.component';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';
import { InvoiceAdvanceSearchComponent } from './preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { BulkExportModal } from './preview/models/bulk-export-modal/bulk-export.component';
import { InvoiceBulkUpdateModalComponent } from './preview/models/bulkUpdateModal/invoiceBulkUpdateModal.component';
import { DownloadOrSendInvoiceOnMailComponent } from './preview/models/download-or-send-mail/download-or-send-mail.component';
import { DownloadVoucherComponent } from './preview/models/download-voucher/download-voucher.component';
import { EsignModalComponent } from './preview/models/e-Sign/e-Sign.component';
import { GenerateEWayBillComponent } from './preview/models/generateEWayBill/generateEWayBill.component';
import { InvoicePreviewDetailsComponent } from './preview/models/invoice-preview-details/invoice-preview-details.component';
import { InvoicePaymentModelComponent } from './preview/models/invoicePayment/invoice.payment.model.component';
import { ProformaListComponent } from './proforma/proforma-list.component';
import { RecurringComponent } from './recurring/recurring.component';
import { InvoiceSettingComponent } from './settings/invoice.settings.component';
import { EditInvoiceComponent } from './templates/edit-template/edit.invoice.component';
import { DesignFiltersContainerComponent } from './templates/edit-template/filters-container/design-filters/design.filters.component';
import { EditFiltersContainersComponent } from './templates/edit-template/filters-container/edit.filters.component';
import { InvoiceTemplateModalComponent } from './templates/edit-template/modals/template-modal/template-modal.component';
import { InvoiceTemplatePreviewModelComponent } from './templates/edit-template/modals/template-preview-modal/template-preview.modal.component';
import { WebviewDirective } from './webview.directive';
import { FontPickerConfigInterface, FontPickerModule, FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { TextMaskModule } from 'angular2-text-mask';
import { ClickOutsideModule } from 'ng-click-outside';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgxUploaderModule } from 'ngx-uploader';
import { InvoiceUiDataService } from '../services/invoice.ui.data.service';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { DeleteVoucherConfirmationModalModule } from '../shared/delete-voucher-confirmation-modal/delete-voucher-confirmation-modal.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { HasFocusDirectiveModule } from '../shared/helpers/directives/has-focus/has-focus.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { UniqueNameModule } from '../shared/helpers/directives/uniqueName/uniqueName.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { TrimPipeModule } from '../shared/helpers/pipes/trim/trim.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { PurchaseOrderPreviewModule } from '../shared/purchase-order-preview/purchase-order-preview.module';
import { PurchaseSendEmailModule } from '../shared/purchase-send-email/purchase-send-email.module';
import { RevisionHistoryModule } from '../shared/revision-history/revision-history.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { ValidateSectionPermissionDirectiveModule } from '../shared/validate-section-permission/validate-section-permission.module';
import { ValidateSubscriptionDirectiveModule } from '../shared/validate-subscription/validate-subscription.module';
import { ConfirmModalModule } from '../theme';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { DeleteTemplateConfirmationModalModule } from './templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { InvoiceTemplatesModule } from './templates/invoice.templates.module';
import { VoucherModule } from '../voucher/voucher.module';
import { MatLegacySlideToggleModule as MatSlideToggleModule } from '@angular/material/legacy-slide-toggle';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
    // Change this to your Google API key
    apiKey: 'AIzaSyAAvwBeHl0uuVSEVeZ3bTylwIkRGKCFvdI'
};

@NgModule({
    declarations: [
        InvoiceComponent,
        InvoicePreviewComponent,
        InvoiceGenerateComponent,
        EditInvoiceComponent,
        DesignFiltersContainerComponent,
        EditFiltersContainersComponent,
        InvoiceSettingComponent,
        InvoicePaymentModelComponent,
        DownloadOrSendInvoiceOnMailComponent,
        InvoiceTemplateModalComponent,
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
        DownloadVoucherComponent
    ],
    imports: [
        InvoiceRoutingModule,
        VoucherModule,
        DigitsOnlyModule,
        FormsModule,
        CommonModule,
        TabsModule.forRoot(),
        ReactiveFormsModule,
        ModalModule,
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        InvoiceTemplatesModule,
        KeyboardShortutModule,
        FontPickerModule,
        CollapseModule.forRoot(),
        NgxUploaderModule,
        SelectModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        DatepickerModule,
        BsDropdownModule.forRoot(),
        AsideMenuRecurringEntryModule,
        SalesShSelectModule,
        TextMaskModule,
        Daterangepicker,
        AccountDetailModalModule,
        CurrencyModule,
        PerfectScrollbarModule,
        VoucherModule,
        DigitsOnlyModule,
        UniqueNameModule,
        ConfirmModalModule,
        VoucherTypeToNamePipeModule,
        SendEmailInvoiceModule,
        AdvanceReceiptAdjustmentModule,
        HasFocusDirectiveModule,
        TrimPipeModule,
        TaxSidebarModule,
        NoDataModule,
        NgxMaskModule.forRoot(),
        MatSlideToggleModule,
        ValidateSubscriptionDirectiveModule,
        DeleteVoucherConfirmationModalModule,
        PurchaseSendEmailModule,
        RevisionHistoryModule,
        PurchaseOrderPreviewModule,
        TranslateDirectiveModule,
        ValidateSectionPermissionDirectiveModule,
        AmountFieldComponentModule,
        HamburgerMenuModule,
        GiddhDatepickerModule,
        BsDatepickerModule.forRoot(),
        GiddhPageLoaderModule,
        DatepickerWrapperModule,
        DeleteTemplateConfirmationModalModule
    ],
    exports: [
        InvoiceRoutingModule,
        TooltipModule,
        DownloadOrSendInvoiceOnMailComponent,
        InvoicePreviewComponent
    ],
    providers: [InvoiceUiDataService, {
            provide: FONT_PICKER_CONFIG,
            useValue: DEFAULT_FONT_PICKER_CONFIG
        }
    ]
})
export class InvoiceModule {
}
