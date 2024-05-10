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
import { MatChipsModule } from "@angular/material/chips";
import { CdkScrollModule } from "./cdk-scroll/cdk-scroll.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { SelectMultipleFieldsComponent } from "./select-multiple-fields/select-multiple-fields.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { InputFieldComponent } from "./input-field/input-field.component";
import { DropdownFieldComponent } from "./dropdown-field/dropdown-field.component";
import { ReactiveDropdownFieldComponent } from "./reactive-dropdown-field/reactive-dropdown-field.component";
import { OptionsScrollDirective } from "./reactive-dropdown-field/reactive-dropdown-options-scroll.directive";
import { MatDividerModule } from "@angular/material/divider";

@NgModule({
    declarations: [
        TextFieldComponent,
        SelectFieldComponent,
        SelectMultipleFieldsComponent,
        InputFieldComponent,
        DropdownFieldComponent,
        ReactiveDropdownFieldComponent,
        OptionsScrollDirective
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
        ClickOutsideModule,
        MatChipsModule,
        CdkScrollModule,
        ScrollingModule,
        MatIconModule,
        MatMenuModule,
        MatButtonModule,
        MatDividerModule
    ],
    exports: [
        TextFieldComponent,
        SelectFieldComponent,
        SelectMultipleFieldsComponent,
        MatFormFieldModule,
        InputFieldComponent,
        DropdownFieldComponent,
        ReactiveDropdownFieldComponent
    ]
})

export class FormFieldsModule {

}
