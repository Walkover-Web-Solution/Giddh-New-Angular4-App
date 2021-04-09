import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllGiddhItemComponent } from './all-item.component';
import { AllItemRoutingModule } from './all-item.routing.module';

@NgModule({
    declarations: [
        AllGiddhItemComponent
    ],
    imports: [
        AllItemRoutingModule,
        SharedModule
    ],
    exports: [
        AllGiddhItemComponent
    ]
})
export class AllItemModule {
}
