import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase.component';
import { PurchaseRecordComponent } from './purchase-record/component/purchase-record.component';

const INVOICE_ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: PurchaseComponent,
        children: [
            { path: '', redirectTo: 'purchase', pathMatch: 'full' },
            { path: 'purchase', component: PurchaseRecordComponent },
            { path: 'purchase/:accountUniqueName/:purchaseRecordUniqueName', component: PurchaseRecordComponent },
            { path: 'purchase/:type', component: PurchaseRecordComponent },
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
