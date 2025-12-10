import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { DecimalDigitsModule } from "../../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../../../shared/helpers/directives/ngx-mask";
import { LedgerDiscountComponent } from "./ledger-discount.component";
// import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { MatMenuModule } from "@angular/material/menu";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        LedgerDiscountComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgxMaskModule,
        MatInputModule,
        MatCheckboxModule
    
    ],
    exports: [
        LedgerDiscountComponent
    ]
})
export class LedgerDiscountModule {}
