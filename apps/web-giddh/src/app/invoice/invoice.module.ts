import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { EWayBillCreateComponent } from './eWayBill/create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill/eWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBill/eWayBillcredentialsModal/eWayBillCredentials.component';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';
import { InvoiceAdvanceSearchComponent } from './preview/models/advanceSearch/invoiceAdvanceSearch.component';
import { InvoiceBulkUpdateModalComponent } from './preview/models/bulkUpdateModal/invoiceBulkUpdateModal.component';
import { DownloadOrSendInvoiceOnMailComponent } from './preview/models/download-or-send-mail/download-or-send-mail.component';
import { DownloadVoucherComponent } from './preview/models/download-voucher/download-voucher.component';
import { EsignModalComponent } from './preview/models/e-Sign/e-Sign.component';
import { InvoicePreviewDetailsComponent } from './preview/models/invoice-preview-details/invoice-preview-details.component';
import { InvoicePaymentModelComponent } from './preview/models/invoicePayment/invoice.payment.model.component';
import { ProformaListComponent } from './proforma/proforma-list.component';
import { RecurringComponent } from './recurring/recurring.component';
import { WebviewDirective } from './webview.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
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
import { InvoiceTemplatesModule } from './templates/invoice.templates.module';
import { VoucherModule } from '../voucher/voucher.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { MatTabsModule } from '@angular/material/tabs';
import { BulkExportVoucherModule } from '../shared/bulk-export-voucher/bulk-export-voucher.module';
import { GenerateEWayBillModule } from './preview/models/generateEWayBill/generateEWayBill.module';
import { InvoiceSettingModule } from './settings/invoice-setting.module';
import { InvoiceGenerateModule } from './generate/invoice-generate.module';
import { DeleteTemplateConfirmationModalModule } from './templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { MatDividerModule } from '@angular/material/divider';
import { FroalaTemplateEditorModule } from '../shared/template-froala/template-froala.module';


@NgModule({
    declarations: [
        InvoiceComponent,
        InvoicePreviewComponent,
        InvoicePaymentModelComponent,
        DownloadOrSendInvoiceOnMailComponent,
        EsignModalComponent,
        RecurringComponent,
        WebviewDirective,
        InvoiceAdvanceSearchComponent,
        InvoiceRendererComponent,
        InvoiceBulkUpdateModalComponent,
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
        MatDividerModule,
        TabsModule.forRoot(),
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        InvoiceTemplatesModule,
        KeyboardShortutModule,
        CollapseModule.forRoot(),
        SelectModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        BsDropdownModule.forRoot(),
        AsideMenuRecurringEntryModule,
        SalesShSelectModule,
        Daterangepicker,
        AccountDetailModalModule,
        CurrencyModule,
        ScrollingModule,
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
        MatDialogModule,
        WatchVideoModule,
        MatTabsModule,
        BulkExportVoucherModule,
        GenerateEWayBillModule,
        InvoiceSettingModule,
        InvoiceGenerateModule,
        DeleteTemplateConfirmationModalModule,
        FroalaTemplateEditorModule
    ],
    exports: [
        InvoiceRoutingModule,
        TooltipModule,
        DownloadOrSendInvoiceOnMailComponent,
        InvoicePreviewComponent
    ],
    providers: [
        InvoiceUiDataService
    ]
})
export class InvoiceModule {
}
