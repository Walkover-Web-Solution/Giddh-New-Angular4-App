import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { InventorySidebarComponent } from "./inventory-sidebar.component";
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { CreateNewInventoryAsideComponent } from "../create-new-inventory-aside-pane/create-new-inventory-aside.component";


@NgModule({
    declarations: [
        InventorySidebarComponent,
        CreateNewInventoryAsideComponent
    ],
    imports: [
        CommonModule,
        ClickOutsideModule,
        RouterModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule,
        TranslateDirectiveModule
    ],
    exports: [
        InventorySidebarComponent,
        CreateNewInventoryAsideComponent
    ]
})
export class InventorySidebarModule {

}
