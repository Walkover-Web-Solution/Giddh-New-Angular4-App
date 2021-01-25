import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { SharedModule } from '../shared/shared.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
@NgModule({
    declarations: [],
    imports: [
        InvoiceRoutingModule,
        ProformaInvoiceModule,
        DigitsOnlyModule,
        PurchaseModule,
        DatepickerWrapperModule,
        SharedModule,
        HamburgerMenuComponentModule
    ],
    exports: [
        InvoiceRoutingModule,
    ]
})
export class InvoiceModule {
}
