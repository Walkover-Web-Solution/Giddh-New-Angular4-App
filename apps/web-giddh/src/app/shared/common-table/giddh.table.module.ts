
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { AmountFieldComponentModule } from "../amount-field/amount-field.module";
import { GiddhTableComponent } from "./giddh-table.component";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";

@NgModule({
    declarations: [
        GiddhTableComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        MatTableModule
    
    ],
    exports: [
        GiddhTableComponent
    ]
})
export class GiddhTableModule {

}
