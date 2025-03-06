import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { KeyboardShortutModule } from "../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { AsideMenuSalesOtherTaxes } from "./aside-menu-sales-other-taxes";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [AsideMenuSalesOtherTaxes],
    imports: [
        CommonModule,
        FormsModule,
        KeyboardShortutModule,
        ShSelectModule,
        FormFieldsModule,
        MatButtonModule
    ],
    exports: [AsideMenuSalesOtherTaxes]
})
export class AsideMenuSalesOtherTaxesModule {}
