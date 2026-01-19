import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuOtherTaxes } from "./aside-menu-other-taxes";
import { MatButtonModule } from "@angular/material/button";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        AsideMenuOtherTaxes
    ],
    imports: [
        CommonModule,
        KeyboardShortutModule,
        ClickOutsideModule,
        ReactiveFormsModule,
        FormsModule,
        FormFieldsModule,
        MatButtonModule
    ],
    exports: [
        AsideMenuOtherTaxes
    ]
})
/**
 * AsideMenuOtherTaxesModule module
 * Implements AsideMenuOtherTaxesModule functionality
 */
export class AsideMenuOtherTaxesModule {

}
