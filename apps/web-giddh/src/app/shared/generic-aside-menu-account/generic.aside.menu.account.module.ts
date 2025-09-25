import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { AccountAddNewDetailsModule } from "../header/components/account-add-new-details/account-add-new-details.module";
import { AccountUpdateNewDetailsModule } from "../header/components/account-update-new-details/account-update-new-details.module";
import { GenericAsideMenuAccountComponent } from "./generic.aside.menu.account.component";

@NgModule({
    declarations: [
        GenericAsideMenuAccountComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        AccountAddNewDetailsModule,
        AccountUpdateNewDetailsModule
    ],
    exports: [
        GenericAsideMenuAccountComponent
    ]
})

export class GenericAsideMenuAccountModule {

}