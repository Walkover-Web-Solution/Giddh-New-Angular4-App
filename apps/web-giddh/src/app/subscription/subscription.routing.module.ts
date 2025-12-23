import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionComponent } from './subscription.component';
import { ChangeBillingComponent } from './change-billing/change-billing.component';
import { ViewSubscriptionComponent } from './view-subscription/view-subscription.component';
import { BuyPlanComponent } from './buy-plan/buy-plan.component';
import { VerifyOwnershipDialogComponent } from './verify-ownership-dilaog/verify-ownership-dilaog.component';
import { CallBackPageComponent } from '../shared/call-back-page/call-back-page.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SubscriptionComponent
            },
            {
                path: ':type', component: SubscriptionComponent
            },
            {
                path: 'subscription/change-billing/:billingAccountUnqiueName', component: ChangeBillingComponent
            },
            {
                path: 'subscription/view-subscription/:id', component: ViewSubscriptionComponent
            },
            {
                path: 'verify-ownership/:requestId', component: VerifyOwnershipDialogComponent
            },
            {
                path: 'subscription/buy-plan', component: BuyPlanComponent
            },
            {
                path: 'subscription/buy-plan/:id', component: BuyPlanComponent
            },
            {
                path: 'subscription/call-back', component: CallBackPageComponent
            }
        ])
    ],
    exports: [RouterModule]
})

export class SubscriptionRoutingModule {

}
