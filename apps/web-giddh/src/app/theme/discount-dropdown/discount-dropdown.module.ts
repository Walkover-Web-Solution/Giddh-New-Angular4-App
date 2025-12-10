import { NgModule } from "@angular/core";
import { DiscountDropdownComponent } from "./discount-dropdown.component";
import { MatMenuModule } from "@angular/material/menu";
// import { FormFieldsModule } from "../form-fields/form-fields.module";
// Temporarily disabled;
import { MatCheckboxModule } from "@angular/material/checkbox";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        DiscountDropdownComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule
    
    ],
    exports: [
        DiscountDropdownComponent
    ]
})
export class DiscountDropdownModule { }