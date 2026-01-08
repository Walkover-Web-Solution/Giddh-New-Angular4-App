import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AsideMenuSalesOtherTaxes } from "./aside-menu-sales-other-taxes";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { KeyboardShortutModule } from "../../shared/helpers/directives/keyboardShortcut/keyboardShortut.module";

@NgModule({
    declarations: [AsideMenuSalesOtherTaxes],
    imports: [
        CommonModule,
        FormsModule,
        KeyboardShortutModule,
        FormFieldsModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [AsideMenuSalesOtherTaxes]
})
export class AsideMenuSalesOtherTaxesModule {}
