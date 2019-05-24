import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';

@NgModule({
  declarations: [],
  imports: [
    InvoiceRoutingModule,
    NgbTypeaheadModule.forRoot(),
    ProformaInvoiceModule
  ],
  exports: [
    InvoiceRoutingModule
  ]
})
export class InvoiceModule {
}
