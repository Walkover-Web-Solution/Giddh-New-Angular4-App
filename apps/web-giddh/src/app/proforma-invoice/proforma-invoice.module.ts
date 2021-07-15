import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxUploaderModule } from 'ngx-uploader';
import { SettingsServiceModule } from '../settings/settings-service.module';
import { AsideMenuRecurringEntryModule } from '../shared/aside-menu-recurring-entry/aside.menu.recurringEntry.module';
import { VoucherTypeToNamePipeModule } from '../shared/header/pipe/voucherTypeToNamePipe/voucherTypeToNamePipe.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SendEmailInvoiceModule } from '../shared/send-email-invoice/send-email-invoice.module';
import { SharedModule } from '../shared/shared.module';
import { DiscountControlModule } from '../theme/discount-control/discount-control.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SalesShSelectModule } from '../theme/sales-ng-virtual-select/sh-select.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AsideMenuProductServiceComponent } from './components/aside-menu-product-service/component';
import { SalesAddStockComponent } from './components/aside-menu-product-service/components/create-stock/sales.create.stock.component';
import { ProformaGstTreatmentComponent } from './components/proforma-gst-treatment/proforma-gst-treatment.component';
import { ProformaLastInvoicesComponent } from './components/proforma-last-invoices/proforma-last-invoices.component';
import { ProformaPrintInPlaceComponent } from './components/proforma-print-inplace/proforma-print-in-place.component';
import { ProformaInvoiceRendererComponent } from './proforma-invoice-renderer.component';
import { ProformaInvoiceComponent } from './proforma-invoice.component';
import { ProformaInvoiceRoutingModule } from './proforma-invoice.routing.module';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { HasFocusDirectiveModule } from '../shared/helpers/directives/has-focus/has-focus.module';

@NgModule({
    imports: [
        ProformaInvoiceRoutingModule,
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
        SharedModule,
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
        SettingsServiceModule,
        AdvanceReceiptAdjustmentModule,
        HasFocusDirectiveModule
    ],
    exports: [ProformaInvoiceComponent, SalesAddStockComponent, AsideMenuProductServiceComponent],
    declarations: [
        ProformaInvoiceRendererComponent,
        ProformaInvoiceComponent,
        ProformaLastInvoicesComponent,
        ProformaGstTreatmentComponent,
        SalesAddStockComponent,
        AsideMenuProductServiceComponent,
        ProformaPrintInPlaceComponent
    ],
    providers: [TitleCasePipe],
})
export class ProformaInvoiceModule {
}
