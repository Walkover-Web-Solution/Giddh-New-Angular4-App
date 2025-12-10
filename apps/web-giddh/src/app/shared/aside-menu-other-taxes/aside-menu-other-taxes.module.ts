import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
// import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuOtherTaxes } from "./aside-menu-other-taxes";
import { MatButtonModule } from "@angular/material/button";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AsideMenuOtherTaxes,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        KeyboardShortutModule,
        ClickOutsideModule,
        ReactiveFormsModule,
        FormsModule
    
    ],
    exports: [
        AsideMenuOtherTaxes
    
    ]
})
export class AsideMenuOtherTaxesModule {

}
