import { NgModule } from '@angular/core';
import { EWayBillCreateComponent } from './create/e-way-bill-create-component';
import { HamburgerMenuModule } from '../header/components/hamburger-menu/hamburger-menu.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";


@NgModule({
    declarations: [
        EWayBillCreateComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        TranslateDirectiveModule,
        HamburgerMenuModule,
        MatFormFieldModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        GiddhDatepickerModule,
        MatFormFieldModule,
        MatRadioModule,
        MatDialogModule,
        MatButtonModule
    
    ],
    exports: [
        EWayBillCreateComponent
    ]
})
export class EWayBillModule { }