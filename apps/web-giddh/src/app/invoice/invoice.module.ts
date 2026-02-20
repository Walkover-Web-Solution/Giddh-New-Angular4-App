import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { EWayBillCreateComponent } from './eWayBill/create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill/eWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBill/eWayBillcredentialsModal/eWayBillCredentials.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { InvoiceBulkUpdateModalComponent } from './preview/models/bulkUpdateModal/invoiceBulkUpdateModal.component';
import { DownloadOrSendInvoiceOnMailComponent } from './preview/models/download-or-send-mail/download-or-send-mail.component';
import { EsignModalComponent } from './preview/models/e-Sign/e-Sign.component';
import { WebviewDirective } from './webview.directive';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatTabsModule } from '@angular/material/tabs';
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
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { TrimPipeModule } from '../shared/helpers/pipes/trim/trim.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { PurchaseSendEmailModule } from '../shared/purchase-send-email/purchase-send-email.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { TaxSidebarModule } from '../shared/tax-sidebar/tax-sidebar.module';
import { ValidateSectionPermissionDirectiveModule } from '../shared/validate-section-permission/validate-section-permission.module';
import { ValidateSubscriptionDirectiveModule } from '../shared/validate-subscription/validate-subscription.module';
import { ConfirmModalModule } from '../theme';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { VoucherModule } from '../voucher/voucher.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { BulkExportVoucherModule } from '../shared/bulk-export-voucher/bulk-export-voucher.module';
import { GenerateEWayBillModule } from './preview/models/generateEWayBill/generateEWayBill.module';
import { InvoiceSettingModule } from './settings/invoice-setting.module';
import { MatDividerModule } from '@angular/material/divider';
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { FroalaTemplateEditorModule } from '../shared/template-froala/template-froala.module';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        DownloadOrSendInvoiceOnMailComponent,
        EsignModalComponent,
        WebviewDirective,
        InvoiceRendererComponent,
        InvoiceBulkUpdateModalComponent,
        EWayBillCreateComponent,
        EWayBillComponent,
        EWayBillCredentialsComponent
    ],
    imports: [
        InvoiceRoutingModule,
        VoucherModule,
        DigitsOnlyModule,
        FormsModule,
        CommonModule,
        MatDividerModule,
        MatTabsModule,
        ReactiveFormsModule,
        KeyboardShortutModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ClickOutsideModule,
        ElementViewChildModule,
        DecimalDigitsModule,
        AsideMenuRecurringEntryModule,
        Daterangepicker,
        AccountDetailModalModule,
        GiddhNumberFormatModule,
        ScrollingModule,
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
        TranslateDirectiveModule,
        ValidateSectionPermissionDirectiveModule,
        AmountFieldComponentModule,
        HamburgerMenuModule,
        GiddhDatepickerModule,
        GiddhPageLoaderModule,
        DatepickerWrapperModule,
        MatDialogModule,
        WatchVideoModule,
        MatTabsModule,
        BulkExportVoucherModule,
        FroalaTemplateEditorModule,
        MatTableModule,
        MatFormFieldModule,
        FormFieldsModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        GenerateEWayBillModule,
        InvoiceSettingModule,
        MatMenuModule,
        MatTooltipModule,
        MatCheckboxModule,
        MatPaginatorModule,
        MatSortModule,
        NewConfirmationModalModule,
        MatCardModule,
        MatDividerModule,
        GiddhDatePipe
    ],
    exports: [
        InvoiceRoutingModule,
        DownloadOrSendInvoiceOnMailComponent
    ],
    providers: [
        InvoiceUiDataService
    ]
})
export class InvoiceModule {
}
