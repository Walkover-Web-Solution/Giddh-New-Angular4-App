import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatInputModule } from "@angular/material/input";
import { ClickOutsideModule } from "ng-click-outside";
import { DecimalDigitsModule } from "../../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../../../shared/helpers/directives/ngx-mask";
import { LedgerDiscountComponent } from "./ledger-discount.component";
import { MatFormFieldModule } from "@angular/material/form-field";

@NgModule({
    declarations: [LedgerDiscountComponent],
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgxMaskModule,
        DecimalDigitsModule,
        MatInputModule,
        MatCheckboxModule,
        MatFormFieldModule
    ],
    exports: [LedgerDiscountComponent]
})
export class LedgerDiscountModule {}
