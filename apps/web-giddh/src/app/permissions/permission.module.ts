import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PermissionRoutingModule } from './permission-routing-module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        BsDropdownModule.forRoot(),
        MatTooltipModule,
        FormFieldsModule,
        MatSelectModule
    ]
})
export class PermissionModule {
}
