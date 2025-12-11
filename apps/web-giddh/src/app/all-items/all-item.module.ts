import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllGiddhItemComponent } from './all-item.component';
import { AllItemRoutingModule } from './all-item.routing.module';
// // import { } from '../theme/form-fields/form-fields.module';
// Temporarily disabled
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
    declarations: [
        AllGiddhItemComponent
    ],
    imports: [
        AllItemRoutingModule,
        MatDialogModule,
        MatButtonModule

    ],
    exports: [
        AllGiddhItemComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AllItemModule {
}
