import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { ClickOutsideModule } from "ng-click-outside";
import { DecimalDigitsModule } from "../../../shared/helpers/directives/decimalDigits/decimalDigits.module";
import { NgxMaskModule } from "../../../shared/helpers/directives/ngx-mask";
import { LedgerDiscountComponent } from "./ledger-discount.component";

@NgModule({
    declarations: [LedgerDiscountComponent],
    imports: [
        CommonModule,
        FormsModule,
        ClickOutsideModule,
        NgxMaskModule,
        DecimalDigitsModule,
        MatInputModule,
        MatCheckboxModule
    ],
    exports: [LedgerDiscountComponent]
})
export class LedgerDiscountModule {}
