import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
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
        DecimalDigitsModule
    ],
    exports: [LedgerDiscountComponent]
})
export class LedgerDiscountModule {}
