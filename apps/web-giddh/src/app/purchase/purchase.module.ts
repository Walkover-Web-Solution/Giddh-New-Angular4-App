import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { VoucherAddBulkItemsModule } from '../shared/voucher-add-bulk-items/voucher-add-bulk-items.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { DeleteVoucherConfirmationModalModule } from '../shared/delete-voucher-confirmation-modal/delete-voucher-confirmation-modal.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { PurchaseSendEmailModule } from '../shared/purchase-send-email/purchase-send-email.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { PurchaseOrderPreviewModule } from '../shared/purchase-order-preview/purchase-order-preview.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic.aside.menu.account.module';
import { AsideMenuOtherTaxesModule } from '../shared/aside-menu-other-taxes/aside-menu-other-taxes.module';
import { AsideMenuProductServiceModule } from '../shared/aside-menu-product-service/aside-menu-product-service.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { PurchaseSettingModule } from './purchase-setting/purchase-setting.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        PurchaseComponent
    ],
    imports: [
        MatButtonModule,
        PurchaseRoutingModule,
        InvoiceModule,
        MatPaginatorModule,

        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ClickOutsideModule,
        ElementViewChildModule,
        ScrollingModule,
        GiddhNumberFormatModule,
        NgxMaskModule.forRoot(),
        TaxControlModule,
        DiscountControlModule,
        NoDataModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatTabsModule,
        VoucherAddBulkItemsModule,
        TranslateDirectiveModule,
        KeyboardShortutModule,
        DecimalDigitsModule,
        HamburgerMenuModule,
        DeleteVoucherConfirmationModalModule,
        GiddhDatepickerModule,
        PurchaseSendEmailModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        DatepickerWrapperModule,
        PurchaseOrderPreviewModule,
        GenericAsideMenuAccountModule,
        AsideMenuOtherTaxesModule,
        AsideMenuProductServiceModule,
        FormFieldsModule,
        MatFormFieldModule,
        MatInputModule,
        MatMenuModule,
        MatCheckboxModule,
        MatRadioModule,
        PurchaseSettingModule
    ]
})
/**
 * PurchaseModule module
 * Implements PurchaseModule functionality
 */
export class PurchaseModule {
}
