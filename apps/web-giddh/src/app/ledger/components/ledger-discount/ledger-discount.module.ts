import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { DecimalDigitsModule } from "../../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../../../shared/helpers/directives/ngx-mask";
import { LedgerDiscountComponent } from "./ledger-discount.component";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
    declarations: [LedgerDiscountComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgxMaskModule,
        MatInputModule,
        MatCheckboxModule,
        FormFieldsModule,
        MatMenuModule,
        DecimalDigitsModule
    ],
    exports: [LedgerDiscountComponent]
})
export class LedgerDiscountModule {}
