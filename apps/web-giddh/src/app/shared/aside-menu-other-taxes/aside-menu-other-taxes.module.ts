import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";
import { AsideMenuOtherTaxesComponent } from "./aside-menu-other-taxes";

@NgModule({
    declarations: [
        AsideMenuOtherTaxesComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        KeyboardShortutModule,
        ShSelectModule,
        FormsModule
    ],
    exports: [
        AsideMenuOtherTaxesComponent
    ]
})

export class AsideMenuOtherTaxesModule {

}