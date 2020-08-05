import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase.component';
import { PurchaseInvoiceComponent } from './purchase-invoice/purchase.invoice.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component';
import { CreatePurchaseOrderComponent } from './create-purchase-order/create-purchase-order.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';

const INVOICE_ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: PurchaseComponent,
        children: [
            { path: '', redirectTo: 'purchase', pathMatch: 'full' },
            { path: 'invoice', component: PurchaseInvoiceComponent },
            { path: 'new-purchase-order', component: CreatePurchaseOrderComponent },
            { path: 'purchase-orders', component: PurchaseOrderComponent },
            { path: 'purchase-order-preview/:purchaseOrderUniqueName', component: PurchaseOrderComponent },
            { path: 'purchase-setting', component: PurchaseSettingComponent },
            { path: 'purchase', component: PurchaseRecordComponent },
            { path: 'purchase/:accountUniqueName/:purchaseRecordUniqueName', component: PurchaseRecordComponent }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(INVOICE_ROUTES),
    ],
    exports: [
        RouterModule,
        FormsModule,
        CommonModule,
    ],
    providers: [Location]
})
export class PurchaseRoutingModule {
}
