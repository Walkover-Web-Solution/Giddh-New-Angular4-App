
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SubscriptionModalComponent } from './subscription-modal.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: SubscriptionModalComponent,
            }
        ])
    ],
    exports: [RouterModule]
})
export class SubscriptionModalRoutingModule {
}
