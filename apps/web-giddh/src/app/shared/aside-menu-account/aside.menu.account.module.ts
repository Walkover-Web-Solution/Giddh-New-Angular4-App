import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AccountAddNewDetailsModule } from "../header/components/account-add-new-details/account-add-new-details.module";
import { AccountUpdateNewDetailsModule } from "../header/components/account-update-new-details/account-update-new-details.module";
import { ConfirmModalModule } from "../../theme/confirm-modal/confirm-modal.module";
import { AsideMenuAccountInContactComponent } from "./aside.menu.account.component";
import { ModalModule } from "ngx-bootstrap/modal";

@NgModule({
    declarations: [
        AsideMenuAccountInContactComponent
    ],
    imports: [
        CommonModule,
        AccountAddNewDetailsModule,
        AccountUpdateNewDetailsModule,
        ConfirmModalModule,
        ModalModule.forRoot()
    ],
    exports: [
        AsideMenuAccountInContactComponent
    ]
})
export class AsideMenuAccountModule {

}