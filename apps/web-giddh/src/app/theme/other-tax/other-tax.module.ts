import { NgModule } from "@angular/core";
import { OtherTaxComponent } from "./other-tax.component";
// import { FormFieldsModule } from "../form-fields/form-fields.module";
// Temporarily disabled;
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AsideMenuCreateTaxModule } from "../../shared/aside-menu-create-tax/aside-menu-create-tax.module";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        OtherTaxComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatSelectModule
    
    ],
    exports: [
        OtherTaxComponent
    ]
})
export class OtherTaxModule {

}
