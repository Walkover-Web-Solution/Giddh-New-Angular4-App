import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PermissionRoutingModule } from './permission-routing-module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        MatTooltipModule,
        FormFieldsModule,
        MatSelectModule,
        MatButtonModule
    ]
})
export class PermissionModule {
}
