import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { CustomFieldsCreateEditComponent } from "./create-edit/create-edit.component";
import { CustomFieldsRoutingModule } from "./custom-fields.routing.module";
import { CustomFieldsListComponent } from "./list/list.component";
import { MainComponent } from "./main.component";

@NgModule({
    declarations: [
        MainComponent,
        CustomFieldsListComponent,
        CustomFieldsCreateEditComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        CustomFieldsRoutingModule,
        HamburgerMenuModule,
        MatButtonModule,
        MatTableModule
    ]
})
export class CustomFieldsModule {

}