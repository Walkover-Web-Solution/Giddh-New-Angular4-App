import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthorization } from '../decorators/needAuthorization';
import { BillingDetailComponent } from './billing-details.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: BillingDetailComponent, canActivate: [NeedsAuthorization]
            },
            {
                path: 'buy-plan', component: BillingDetailComponent
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * BillingDetailRoutingModule module
 * Implements BillingDetailRoutingModule functionality
 */
export class BillingDetailRoutingModule {
}
