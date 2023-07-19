import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { StockCreateEditModule } from "../../new-inventory/component/stock-create-edit/stock-create-edit.module";
import { ShSelectModule } from "../../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../../theme/translate/translate.directive.module";
import { GenericAsideMenuAccountModule } from "../generic-aside-menu-account/generic.aside.menu.account.module";
import { DecimalDigitsModule } from "../helpers/directives/decimalDigits/decimalDigits.module";
import { TextCaseChangeModule } from "../helpers/directives/textCaseChange/textCaseChange.module";
import { UniqueNameModule } from "../helpers/directives/uniqueName/uniqueName.module";
import { AsideMenuProductServiceComponent } from "./aside-menu-product-service.component";
import { SalesAddStockComponent } from "./components/create-stock/sales.create.stock.component";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
    declarations: [
        AsideMenuProductServiceComponent,
        SalesAddStockComponent
    ],
    imports: [
        CommonModule,
        TranslateDirectiveModule,
        GenericAsideMenuAccountModule,
        ReactiveFormsModule,
        FormsModule,
        ShSelectModule,
        UniqueNameModule,
        TextCaseChangeModule,
        DecimalDigitsModule,
        BsDropdownModule.forRoot(),
        StockCreateEditModule,
        MatButtonModule,
        MatDialogModule
    ],
    exports: [
        AsideMenuProductServiceComponent,
        SalesAddStockComponent
    ]
})
export class AsideMenuProductServiceModule {

}
