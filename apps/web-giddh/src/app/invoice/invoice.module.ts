import { NgModule } from '@angular/core';
import { InvoiceRoutingModule } from './invoice.routing.module';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [],
  imports: [
    InvoiceRoutingModule,
    NgbTypeaheadModule.forRoot(),

  ],
  exports: [
    InvoiceRoutingModule
  ]
})
export class InvoiceModule {
}
