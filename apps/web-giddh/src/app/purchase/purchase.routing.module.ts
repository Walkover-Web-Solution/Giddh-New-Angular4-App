import { RouterModule, Routes } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, Location } from '@angular/common';
import { NgModule } from '@angular/core';
import { PurchaseComponent } from './purchase.component';

const INVOICE_ROUTES: Routes = [
    {
        path: '',
        canActivate: [NeedsAuthentication],
        component: PurchaseComponent,
        children: [
            { path: '', redirectTo: 'purchase', pathMatch: 'full' }
        ]
    }
];

/**
 * Handles NgModule functionality
 */
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
/**
 * PurchaseRoutingModule module
 * Implements PurchaseRoutingModule functionality
 */
export class PurchaseRoutingModule {
}
