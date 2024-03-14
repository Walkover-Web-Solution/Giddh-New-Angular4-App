import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { ChangeBillingComponent } from './change-billing/change-billing.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { BuyPlanComponent } from './buy-plan/buy-plan.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SubscriptionComponent
            },
            {
                path: 'change-billing', component: ChangeBillingComponent
            },
            {
                path: 'view-subscription', component: ViewSubscriptionComponent
            },
            {
                path: 'buy-plan', component: BuyPlanComponent
            }
        ])
    ],
    exports: [RouterModule]
})

export class SubscriptionRoutingModule {

}
