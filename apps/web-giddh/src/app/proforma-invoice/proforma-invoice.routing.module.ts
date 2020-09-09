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
                path: '', redirectTo: 'invoice/proformas', pathMatch: 'full'
            },
            {
                path: 'invoice/:invoiceType', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName/:invoiceNo', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
            },
            {
                path: 'invoice/:invoiceType/:accUniqueName/:invoiceNo/:invoiceAction', component: ProformaInvoiceComponent, canActivate: [NeedsAuthentication]
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
