import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { PermissionRoutingModule } from './permission-routing-module';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        PermissionRoutingModule,
        MatTooltipModule,
        MatButtonModule
    
    ]
})
export class PermissionModule {
}
