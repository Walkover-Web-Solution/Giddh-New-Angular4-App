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
import { DigitsOnlyModule } from "../../shared/helpers/directives/digitsOnly/digitsOnly.module";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { NgxMaskModule } from "../../shared/helpers/directives/ngx-mask";
import { ClickOutsideModule } from "ng-click-outside";

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
        DigitsOnlyModule,
        NgxMaskModule,
        ClickOutsideModule

    ],
    exports: [
        TextFieldComponent,
        SelectFieldComponent,
        MatFormFieldModule,

    ]
})

export class FormFieldsModule {

}
