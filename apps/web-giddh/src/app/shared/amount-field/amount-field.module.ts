import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';

import { GiddhNumberFormatModule } from '../helpers/pipes/number-format/number-format.module';
import { AmountFieldComponent } from './amount-field.component';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";

@NgModule({
    declarations: [
        AmountFieldComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        GiddhNumberFormatModule,
        CommonModule
    ],
    exports: [
        AmountFieldComponent
    ],
    providers: [
        DecimalPipe
    ]
})
export class AmountFieldComponentModule { }
