import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProformaInvoiceComponent } from './proforma-invoice.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

const routes: Routes = [
  {
    path: '', component: ProformaInvoiceComponent, redirectTo: 'proforma', pathMatch: 'full'
  },
  {
    path: ':accUniqueName', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
  },
  {
    path: ':invoiceType/:accUniqueName/:invoiceNo', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class ProformaInvoiceRoutingModule {
}
