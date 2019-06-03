import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProformaInvoiceComponent } from './proforma-invoice.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ProformaInvoiceRendererComponent } from './proforma-invoice-renderer.component';

const routes: Routes = [
  {
    path: '',
    component: ProformaInvoiceRendererComponent,
    children: [
      {
        path: '', redirectTo: 'proforma', pathMatch: 'full'
      },
      {
        path: ':invoiceType', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
      },
      {
        path: ':invoiceType/:accUniqueName', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
      },
      {
        path: ':invoiceType/:accUniqueName/:invoiceNo', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  declarations: [],
})
export class ProformaInvoiceRoutingModule {
}
