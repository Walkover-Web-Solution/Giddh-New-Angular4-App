import { NgModule } from "@angular/core";
import { TaxDropdownComponent } from "./tax-dropdown.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { MatCheckboxModule } from "@angular/material/checkbox";
// import { FormFieldsModule } from "../form-fields/form-fields.module";
// Temporarily disabled;
import { MatTooltipModule } from "@angular/material/tooltip";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        TaxDropdownComponent,
        TextFieldComponent,
        ReactiveDropdownFieldComponent,
        InputFieldComponent,
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatCheckboxModule
    
    ],
    exports: [
        TaxDropdownComponent
    ]
})
export class TaxDropdownModule {

}
