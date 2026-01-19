import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { AccountAddNewDetailsModule } from "../header/components/account-add-new-details/account-add-new-details.module";
import { AccountUpdateNewDetailsModule } from "../header/components/account-update-new-details/account-update-new-details.module";
import { GenericAsideMenuAccountComponent } from "./generic.aside.menu.account.component";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { KeyboardShortutModule } from "../helpers/directives/keyboardShortcut/keyboardShortut.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        GenericAsideMenuAccountComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        AccountAddNewDetailsModule,
        AccountUpdateNewDetailsModule,
        MatDialogModule,
        MatButtonModule,
        KeyboardShortutModule
    ],
    exports: [
        GenericAsideMenuAccountComponent
    ]
})

/**
 * GenericAsideMenuAccountModule module
 * Implements GenericAsideMenuAccountModule functionality
 */
export class GenericAsideMenuAccountModule {

}