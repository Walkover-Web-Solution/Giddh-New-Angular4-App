import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
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
            { path: 'ewaybill/create', component: EWayBillCreateComponent },
        ]
    },
    { path: 'ewaybill', canActivate: [NeedsAuthentication], component: EWayBillComponent },
];

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild(INVOICE_ROUTES),
    ],
    exports: [
        RouterModule
    ]
})
/**
 * InvoiceRoutingModule module
 * Implements InvoiceRoutingModule functionality
 */
export class InvoiceRoutingModule {
}
