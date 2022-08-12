import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { DecimalDigitsModule } from "../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { SelectFieldComponent } from "./select-field/select-field.component";
import { TextFieldComponent } from "./text-field/text-field.component";
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { DigitsOnlyModule } from "../../shared/helpers/directives/digitsOnly/digitsOnly.module";

@NgModule({
    declarations: [
        TextFieldComponent,
        SelectFieldComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatAutocompleteModule,
        ReactiveFormsModule,
        DecimalDigitsModule,
        MatTooltipModule,
        TranslateDirectiveModule,
        DigitsOnlyModule
    ],
    exports: [
        TextFieldComponent,
        SelectFieldComponent,
        MatFormFieldModule
    ]
})

export class FormFieldsModule {

}