import { NgModule } from "@angular/core";
// import { FormFieldsModule } from "../form-fields/form-fields.module";
// Temporarily disabled for compilation
import { MatButtonModule } from "@angular/material/button";
import { CreateDiscountComponent } from "./create-discount.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSelectModule } from "@angular/material/select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { LaddaModule } from "angular2-ladda";
import { TranslateDirectiveModule } from "../translate/translate.directive.module";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";
// import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";

@NgModule({
    declarations: [
        CreateDiscountComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        LaddaModule,
        TranslateDirectiveModule
    
    ],
    exports: [
        CreateDiscountComponent
    ]
})
export class CreateDiscountModule {

}
