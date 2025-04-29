import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { InvoiceComponent } from './invoice.component';
import { InvoiceRendererComponent } from './invoice.renderer.component';
import { EWayBillCreateComponent } from './eWayBill/create/eWayBill.create.component';
import { EWayBillComponent } from './eWayBill/eWayBill/eWayBill.component';

const INVOICE_ROUTES: Routes = [

    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: InvoiceRendererComponent,
        children: [
            { path: '', redirectTo: 'preview/sales', pathMatch: 'full' },
            { path: 'preview/:voucherType', component: InvoiceComponent },
            { path: 'preview/:voucherType/:selectedType', component: InvoiceComponent },
            { path: 'preview/:voucherType/:voucherNoForDetail/:voucherAction', component: InvoiceComponent },
            { path: 'ewaybill/create', component: EWayBillCreateComponent },

        ]
    },
    { path: 'ewaybill', canActivate: [NeedsAuthentication], component: EWayBillComponent },
];

@NgModule({
    imports: [
        RouterModule.forChild(INVOICE_ROUTES),
    ],
    exports: [
        RouterModule
    ]
})
export class InvoiceRoutingModule {
}
