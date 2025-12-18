import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StockCreateEditModule } from "../../new-inventory/component/stock-create-edit/stock-create-edit.module";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GenericAsideMenuAccountModule } from "../generic-aside-menu-account/generic.aside.menu.account.module";
import { DecimalDigitsModule } from "../helpers/directives/decimalDigits/decimalDigits.module";
import { TextCaseChangeModule } from "../helpers/directives/textCaseChange/textCaseChange.module";
import { UniqueNameModule } from "../helpers/directives/uniqueName/uniqueName.module";
import { AsideMenuProductServiceComponent } from "./aside-menu-product-service.component";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatDialogModule } from "@angular/material/dialog";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";

@NgModule({
    declarations: [
        AsideMenuProductServiceComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        GenericAsideMenuAccountModule,
        ReactiveFormsModule,
        FormsModule,
        FormFieldsModule,
        UniqueNameModule,
        TextCaseChangeModule,
        DecimalDigitsModule,
        StockCreateEditModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDialogModule,
        KeyboardShortutModule
    ],
    exports: [
        AsideMenuProductServiceComponent
    ]
})
export class AsideMenuProductServiceModule {

}
