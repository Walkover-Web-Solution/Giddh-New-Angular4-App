import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { EWayBillCreateComponent } from './create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill.component';
import { EWayBillCredentialsComponent } from './eWayBillcredentialsModal/eWayBillCredentials.component';
import { TranslateModule } from '@ngx-translate/core';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
// import { ShSelectMenuComponent } from '../../theme/ng-virtual-select/sh-select-menu.component';
import { ShSelectModule } from '../../theme/ng-virtual-select/sh-select.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { LaddaModule } from 'angular2-ladda';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeleteTemplateConfirmationModalModule } from '../../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { InputFieldComponent } from '../../theme/form-fields/input-field/input-field.component';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { LaddaModule } from 'angular2-ladda';
// import { ClickOutsideModule } from 'ng-click-outside';
// import { CollapseModule } from 'ngx-bootstrap/collapse';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
// import { ModalModule } from 'ngx-bootstrap/modal';
// import { PaginationModule } from 'ngx-bootstrap/pagination';
// import { TabsModule } from 'ngx-bootstrap/tabs';
// import { TooltipModule } from 'ngx-bootstrap/tooltip';
// import { MatSlideToggleModule } from '@angular/material/slide-toggle';
// import { MatDialogModule } from '@angular/material/dialog';
// import { ScrollingModule } from '@angular/cdk/scrolling';
// import { MatTabsModule } from '@angular/material/tabs';
// import { MatDividerModule } from '@angular/material/divider';
// import { VoucherModule } from '../../voucher/voucher.module';
// import { InvoiceTemplatesModule } from '../../invoice/templates/invoice.templates.module';
// import { KeyboardShortutModule } from '../helpers/directives/keyboardShortcut/keyboardShortut.module';
// import { SelectModule } from '../../theme/ng-select/ng-select';
// import { ShSelectModule } from '../../theme/ng-virtual-select/sh-select.module';
// import { ElementViewChildModule } from '../helpers/directives/elementViewChild/elementViewChild.module';
// import { DecimalDigitsModule } from '../helpers/directives/decimalDigits/decimalDigits.module';
// import { AsideMenuRecurringEntryModule } from '../aside-menu-recurring-entry/aside.menu.recurringEntry.module';
// import { SalesShSelectModule } from '../../theme/sales-ng-virtual-select/sh-select.module';
// import { Daterangepicker } from '../../theme/ng2-daterangepicker/daterangepicker.module';
// import { AccountDetailModalModule } from '../../theme/account-detail-modal/account-detail-modal.module';
// import { CurrencyModule } from '../helpers/pipes/currencyPipe/currencyType.module';
// import { UniqueNameModule } from '../helpers/directives/uniqueName/uniqueName.module';
// import { ConfirmModalModule } from '../../theme';
// import { VoucherTypeToNamePipeModule } from '../header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
// import { SendEmailInvoiceModule } from '../send-email-invoice/send-email-invoice.module';
// import { AdvanceReceiptAdjustmentModule } from '../advance-receipt-adjustment/advance-receipt-adjustment.module';
// import { HasFocusDirectiveModule } from '../helpers/directives/has-focus/has-focus.module';
// import { TrimPipeModule } from '../helpers/pipes/trim/trim.module';
// import { TaxSidebarModule } from '../tax-sidebar/tax-sidebar.module';
// import { NoDataModule } from '../no-data/no-data.module';
// import { NgxMaskModule } from '../helpers/directives/ngx-mask';
// import { ValidateSubscriptionDirectiveModule } from '../validate-subscription/validate-subscription.module';
// import { DeleteVoucherConfirmationModalModule } from '../delete-voucher-confirmation-modal/delete-voucher-confirmation-modal.module';
// import { PurchaseSendEmailModule } from '../purchase-send-email/purchase-send-email.module';
// import { RevisionHistoryModule } from '../revision-history/revision-history.module';
// import { PurchaseOrderPreviewModule } from '../purchase-order-preview/purchase-order-preview.module';
// import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
// import { ValidateSectionPermissionDirectiveModule } from '../validate-section-permission/validate-section-permission.module';
// import { AmountFieldComponentModule } from '../amount-field/amount-field.module';
// import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
// import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
// import { GiddhPageLoaderModule } from '../giddh-page-loader/giddh-page-loader.module';
// import { DatepickerWrapperModule } from '../datepicker-wrapper/datepicker.wrapper.module';
// import { WatchVideoModule } from '../../theme/watch-video/watch-video.module';
// import { BulkExportVoucherModule } from '../bulk-export-voucher/bulk-export-voucher.module';
// import { GenerateEWayBillModule } from '../../invoice/preview/models/generateEWayBill/generateEWayBill.module';
// import { InvoiceSettingModule } from '../../invoice/settings/invoice-setting.module';
// import { InvoiceGenerateModule } from '../../invoice/generate/invoice-generate.module';
// import { DeleteTemplateConfirmationModalModule } from '../../invoice/templates/edit-template/modals/confirmation-modal/confirmation.modal.module';
// import { FroalaTemplateEditorModule } from '../template-froala/template-froala.module';
// import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
// import { MatCheckboxModule } from '@angular/material/checkbox';
// import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
    declarations: [
        EWayBillComponent,
        EWayBillCreateComponent,
        EWayBillCredentialsComponent
    ],
    imports: [
        TranslateModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        MatFormFieldModule,
        ShSelectModule,
        CommonModule,
        FormsModule,
        BsDatepickerModule.forRoot(),
        LaddaModule,
        ModalModule.forRoot(),
        DeleteTemplateConfirmationModalModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatInputModule,
        MatRadioModule,
        GiddhDatepickerModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        EWayBillComponent,
        EWayBillCreateComponent,
        EWayBillCredentialsComponent
    ]
})
export class EWayBillComponentModule {
}
