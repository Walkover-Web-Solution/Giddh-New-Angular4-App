import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from "@angular/material/legacy-autocomplete";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyFormFieldModule as MatFormFieldModule } from "@angular/material/legacy-form-field";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { DecimalDigitsModule } from "../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { SelectFieldComponent } from "./select-field/select-field.component";
import { TextFieldComponent } from "./text-field/text-field.component";
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { DigitsOnlyModule } from "../../shared/helpers/directives/digitsOnly/digitsOnly.module";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { NgxMaskModule } from "../../shared/helpers/directives/ngx-mask";
import { ClickOutsideModule } from "ng-click-outside";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { CdkScrollComponent } from "./cdk-scroll/cdk-scroll.component";
import { CdkScrollModule } from "./cdk-scroll/cdk-scroll.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { SelectMultipleFieldsComponent } from "./select-multiple-fields/select-multiple-fields.component";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";

@NgModule({
    declarations: [
        TextFieldComponent,
        SelectFieldComponent,
        SelectMultipleFieldsComponent,
        CdkScrollComponent
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
        MatButtonModule
    ],
    exports: [
        TextFieldComponent,
        SelectFieldComponent,
        SelectMultipleFieldsComponent,
        MatFormFieldModule,
        CdkScrollComponent,
        CdkScrollModule,
        ScrollingModule
    ]
})

export class FormFieldsModule {

}
