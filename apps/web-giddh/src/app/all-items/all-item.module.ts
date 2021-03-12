import { NgModule } from '@angular/core';
import { AllGiddhItemComponent } from './all-item.component';
import { AllItemRoutingModule } from './all-item.routing.module';

@NgModule({
    declarations: [
        AllGiddhItemComponent
    ],
    imports: [
        AllGiddhItemComponent,
        AllItemRoutingModule
    ],
    exports: [
        AllGiddhItemComponent,
    ]
})
export class AllItemModule {
}
