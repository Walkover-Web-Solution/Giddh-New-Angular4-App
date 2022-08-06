import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { ProformaInvoiceModule } from '../material-proforma-invoice/proforma-invoice.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { PurchaseModule } from '../purchase/purchase.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    declarations: [],
    imports: [
        InvoiceRoutingModule,
        ProformaInvoiceModule,
        DigitsOnlyModule,
        PurchaseModule,
        SharedModule
    ],
    exports: [
        InvoiceRoutingModule,
    ]
})
export class InvoiceModule {
}
