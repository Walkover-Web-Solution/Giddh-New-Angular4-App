import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuOtherTaxes } from "./aside-menu-other-taxes";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [
        AsideMenuOtherTaxes
    ],
    imports: [
        CommonModule,
        KeyboardShortutModule,
        ClickOutsideModule,
        ShSelectModule,
        ReactiveFormsModule,
        FormsModule,
        FormFieldsModule,
        MatButtonModule
    ],
    exports: [
        AsideMenuOtherTaxes
    ]
})
export class AsideMenuOtherTaxesModule {

}
