import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SubscriptionModalComponent } from './subscription-modal.component';
import { SubscriptionModalRoutingModule } from './subscription-modal.routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        SubscriptionModalRoutingModule,
        ModalModule.forRoot(),

    ],
    declarations: [SubscriptionModalComponent]
})
export class SubscriptionModalModule {

}
