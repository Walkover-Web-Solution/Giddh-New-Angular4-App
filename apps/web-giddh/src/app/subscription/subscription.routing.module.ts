import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { ChangeBillingComponent } from './change-billing/change-billing.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SubscriptionComponent
            },
            {
                path: 'change-billing', component: ChangeBillingComponent
            },
        ])
    ],
    exports: [RouterModule]
})

export class SubscriptionRoutingModule {

}
