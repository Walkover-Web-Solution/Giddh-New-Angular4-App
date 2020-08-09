import {NgModule} from '@angular/core';
import {InvoiceRoutingModule} from './invoice.routing.module';
import {ProformaInvoiceModule} from '../proforma-invoice/proforma-invoice.module';
import {DigitsOnlyModule} from '../shared/helpers/directives/digitsOnly/digitsOnly.module';

@NgModule({
    declarations: [],
    imports: [
        InvoiceRoutingModule,
        ProformaInvoiceModule,
        DigitsOnlyModule,
    ],
    exports: [
        InvoiceRoutingModule
    ]
})
export class InvoiceModule {
}
