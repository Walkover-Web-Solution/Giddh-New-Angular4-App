import { NgModule } from '@angular/core';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { PurchaseAdvanceSearchComponent } from './purchase-advance-search/purchase-advance-search.component';
import { PurchaseOrderPreviewComponent } from './purchase-order-preview/purchase-order-preview.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRoutingModule } from './purchase.routing.module';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { VoucherAddBulkItemsModule } from '../shared/voucher-add-bulk-items/voucher-add-bulk-items.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { DeleteVoucherConfirmationModalModule } from '../shared/delete-voucher-confirmation-modal/delete-voucher-confirmation-modal.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { PurchaseSendEmailModule } from '../shared/purchase-send-email/purchase-send-email.module';
import { RevisionHistoryModule } from '../shared/revision-history/revision-history.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { PurchaseOrderPreviewModule } from '../shared/purchase-order-preview/purchase-order-preview.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { GenericAsideMenuAccountModule } from '../shared/generic-aside-menu-account/generic.aside.menu.account.module';
import { AsideMenuOtherTaxesModule } from '../shared/aside-menu-other-taxes/aside-menu-other-taxes.module';
import { AsideMenuProductServiceModule } from '../shared/aside-menu-product-service/aside-menu-product-service.module';


@NgModule({
    declarations: [
        PurchaseOrderComponent,
        CreatePurchaseOrderComponent,
        PurchaseOrderPreviewComponent,
        PurchaseComponent,
        PurchaseRecordComponent,
        PurchaseSettingComponent,
        PurchaseAdvanceSearchComponent
    ],
    imports: [
        PurchaseRoutingModule,
        InvoiceModule,
        CollapseModule,
        PaginationModule.forRoot(),
        BsDropdownModule.forRoot(),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        TooltipModule.forRoot(),
        ClickOutsideModule,
        TabsModule.forRoot(),
        ElementViewChildModule,
        PerfectScrollbarModule,
        ShSelectModule,
        SalesShSelectModule,
        CurrencyModule,
        NgxMaskModule.forRoot(),
        TaxControlModule,
        DiscountControlModule,
        NoDataModule,
        NgxBootstrapSwitchModule.forRoot(),
        VoucherAddBulkItemsModule,
        TranslateDirectiveModule,
        KeyboardShortutModule,
        DecimalDigitsModule,
        ModalModule,
        HamburgerMenuModule,
        BsDatepickerModule.forRoot(),
        DeleteVoucherConfirmationModalModule,
        GiddhDatepickerModule,
        PurchaseSendEmailModule,
        RevisionHistoryModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        DatepickerWrapperModule,
        PurchaseOrderPreviewModule,
        GenericAsideMenuAccountModule,
        AsideMenuOtherTaxesModule,
        AsideMenuProductServiceModule
    ]
})
export class PurchaseModule {
}