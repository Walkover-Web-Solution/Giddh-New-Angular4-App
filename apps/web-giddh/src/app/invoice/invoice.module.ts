import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';

@NgModule({
    declarations: [],
    imports: [
        InvoiceRoutingModule,
        NgbTypeaheadModule.forRoot(),
        ProformaInvoiceModule,
        DigitsOnlyModule,
    ],
    exports: [
        InvoiceRoutingModule
    ]
})
export class InvoiceModule {
}
