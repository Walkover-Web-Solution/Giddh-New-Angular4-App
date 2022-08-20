import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthorization } from '../decorators/needAuthorization';
import { BillingDetailComponent } from './billingDetail.component';

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
export class BillingDetailRoutingModule {
}
