import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { InventorySidebarComponent } from "./inventory-sidebar.component";


@NgModule({
    declarations: [
        InventorySidebarComponent
    ],
    imports: [
        CommonModule,
        ClickOutsideModule,
        RouterModule
    ],
    exports: [
        InventorySidebarComponent
    ]
})
export class InventorySidebarModule {

}