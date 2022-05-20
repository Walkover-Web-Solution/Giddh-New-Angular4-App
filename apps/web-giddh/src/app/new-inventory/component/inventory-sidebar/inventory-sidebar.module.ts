import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ClickOutsideModule } from "ng-click-outside";
import { InventorySidebarComponent } from "./inventory-sidebar.component";
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from "@angular/material/button";


@NgModule({
    declarations: [
        InventorySidebarComponent
    ],
    imports: [
        CommonModule,
        ClickOutsideModule,
        RouterModule,
        MatTreeModule,
        MatIconModule,
        MatButtonModule
    ],
    exports: [
        InventorySidebarComponent
    ]
})
export class InventorySidebarModule {

}