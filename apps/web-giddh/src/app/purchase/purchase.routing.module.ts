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
import { PurchaseOrderInvoicePreviewComponent } from './purchase-order-invoice-preview/purchase-order-invoice-preview.component';
import { PurchaseSettingComponent } from './purchase-setting/purchase-setting.component';
/**
 * Created by kunalsaxena on 9/1/17.
 */

const INVOICE_ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: PurchaseComponent,
        children: [
            { path: '', redirectTo: 'purchase', pathMatch: 'full' },
            { path: 'invoice', component: PurchaseInvoiceComponent },
            { path: 'create-purchase-order', component: CreatePurchaseOrderComponent },
            { path: 'purchase-order-page', component: PurchaseOrderComponent },
            { path: 'purchase-order-invoice-preview', component: PurchaseOrderInvoicePreviewComponent },
            { path: 'purchase-setting', component: PurchaseSettingComponent },
            { path: 'purchase', component: PurchaseRecordComponent },
            { path: 'purchase/:accountUniqueName/:purchaseRecordUniqueName', component: PurchaseRecordComponent }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [
        // Daterangepicker,
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        RouterModule.forChild(INVOICE_ROUTES),
        // Ng2BootstrapModule.forRoot(),
    ],
    exports: [
        RouterModule,
        // Ng2BootstrapModule,
        FormsModule,
        CommonModule,
        // Daterangepicker
    ],
    providers: [Location]
})
export class PurchaseRoutingModule {
}
