import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AllGiddhItemComponent } from './all-item.component';
import { AllItemRoutingModule } from './all-item.routing.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        AllGiddhItemComponent
    ],
    imports: [
        AllItemRoutingModule,
        SharedModule,
        FormFieldsModule,
        MatCardModule,
        MatDialogModule,
        MatButtonModule
    ],
    exports: [
        AllGiddhItemComponent
    ]
})
/**
 * AllItemModule module
 * Implements AllItemModule functionality
 */
export class AllItemModule {
}
