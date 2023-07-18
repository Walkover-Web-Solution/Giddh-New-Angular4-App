import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllGiddhItemComponent } from './all-item.component';
import { AllItemRoutingModule } from './all-item.routing.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatCardModule } from '@angular/material/card';

@NgModule({
    declarations: [
        AllGiddhItemComponent
    ],
    imports: [
        AllItemRoutingModule,
        SharedModule,
        FormFieldsModule,
        MatCardModule
    ],
    exports: [
        AllGiddhItemComponent
    ]
})
export class AllItemModule {
}
