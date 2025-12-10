import { NgModule } from '@angular/core';
import { AsideMenuRecurringEntryComponent } from './aside.menu.recurringEntry.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LaddaModule } from 'angular2-ladda';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhDatepickerModule } from '../../theme/giddh-datepicker/giddh-datepicker.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";
// import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';
// Temporarily disabled;


@NgModule({
    declarations: [
        AsideMenuRecurringEntryComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        TranslateDirectiveModule,
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        GiddhDatepickerModule,
        MatCheckboxModule,
        MatButtonModule,
        // // FormFieldsModule, // Temporarily disabled for compilation
    exports: [
        AsideMenuRecurringEntryComponent
    ]
})
export class AsideMenuRecurringEntryModule {
}
