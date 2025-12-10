import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StockCreateEditModule } from "../../new-inventory/component/stock-create-edit/stock-create-edit.module";
// import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
// Temporarily disabled;
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
import { TextFieldComponent } from "../../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        AsideMenuProductServiceComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        FormsModule,
        TextCaseChangeModule,
        DecimalDigitsModule,
        StockCreateEditModule,
        MatButtonModule,
        MatCheckboxModule,
        MatRadioModule,
        MatDialogModule
    
    ],
    exports: [
        AsideMenuProductServiceComponent
    ]
})
export class AsideMenuProductServiceModule {

}
