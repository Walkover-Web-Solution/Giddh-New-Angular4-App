import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUploaderModule } from 'ngx-uploader';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuProductServiceComponent } from './components/aside-menu-product-service/component';
import { SalesAddStockComponent } from './components/aside-menu-product-service/components/create-stock/sales.create.stock.component';
import { VoucherGstTreatmentComponent } from './components/voucher-gst-treatment/voucher-gst-treatment.component';
import { VoucherPrintInPlaceComponent } from './components/voucher-print-inplace/voucher-print-in-place.component';
import { VoucherRendererComponent } from './voucher-renderer.component';
import { VoucherComponent } from './voucher.component';
import { VoucherRoutingModule } from './voucher.routing.module';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { HasFocusDirectiveModule } from '../shared/helpers/directives/has-focus/has-focus.module';
import { ReplacePipeModule } from '../shared/helpers/pipes/replace/replace.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatSelectModule } from '@angular/material/select';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { AddBulkItemsModule } from '../add-bulk-items/add-bulk-items.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { ConfirmationModalModule } from '../common/confirmation-modal/confirmation-modal.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic.aside.menu.account.module';
import { AsideMenuOtherTaxesModule } from '../shared/aside-menu-other-taxes/aside-menu-other-taxes.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

@NgModule({
    imports: [
        VoucherRoutingModule,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        ShSelectModule,
        KeyboardShortutModule,
        SalesShSelectModule,
        DecimalDigitsModule,
        CollapseModule,
        NgxUploaderModule,
        BsDropdownModule,
        DigitsOnlyModule,
        AsideMenuRecurringEntryModule,
        ModalModule,
        TaxControlModule,
        DiscountControlModule,
        LaddaModule,
        SelectModule.forRoot(),
        SendEmailInvoiceModule,
        VoucherTypeToNamePipeModule,
        CurrencyModule,
        NgxMaskModule.forRoot(),
        AdvanceReceiptAdjustmentModule,
        HasFocusDirectiveModule,
        ReplacePipeModule,
        NgxBootstrapSwitchModule.forRoot(),
        MatMenuModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatCheckboxModule,
        MatCommonModule,
        MatRadioModule,
        MatTableModule,
        MatSelectModule,
        FormFieldsModule,
        GiddhDatepickerModule,
        AddBulkItemsModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        ConfirmationModalModule,
        PopoverModule,
        BsDatepickerModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        ClickOutsideModule,
        GenericAsideMenuAccountModule,
        AsideMenuOtherTaxesModule,
        MatDialogModule,
        MatExpansionModule
    ],
    exports: [VoucherComponent, SalesAddStockComponent, AsideMenuProductServiceComponent],
    declarations: [
        VoucherRendererComponent,
        VoucherComponent,
        VoucherGstTreatmentComponent,
        SalesAddStockComponent,
        AsideMenuProductServiceComponent,
        VoucherPrintInPlaceComponent
    ],
    providers: [TitleCasePipe],
})
export class VoucherModule {
}
