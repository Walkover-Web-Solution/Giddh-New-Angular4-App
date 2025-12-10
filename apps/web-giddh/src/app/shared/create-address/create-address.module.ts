
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
// import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { CreateAddressComponent } from "./create-address.component";
import { LaddaModule } from "angular2-ladda";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatChipsModule } from "@angular/material/chips";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        CreateAddressComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        TranslateDirectiveModule,
        ScrollingModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatChipsModule,
        MatCheckboxModule
    
    ],
    exports: [
        CreateAddressComponent
    ]
})
export class CreateAddressModule {

}