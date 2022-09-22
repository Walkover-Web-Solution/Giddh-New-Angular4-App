import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ClickOutsideModule } from "ng-click-outside";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuOtherTaxes } from "./aside-menu-other-taxes";

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
        FormsModule
    ],
    exports: [
        AsideMenuOtherTaxes
    ]
})
export class AsideMenuOtherTaxesModule {

}