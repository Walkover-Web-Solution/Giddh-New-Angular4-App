import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KeyboardShortutModule } from "../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuSalesOtherTaxes } from "./aside-menu-sales-other-taxes";
// import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AsideMenuSalesOtherTaxes,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        CommonModule,
        FormsModule,
        KeyboardShortutModule,
        MatDialogModule
    
    ],
    exports: [
        AsideMenuSalesOtherTaxes
    ]
})
export class AsideMenuSalesOtherTaxesModule {}
