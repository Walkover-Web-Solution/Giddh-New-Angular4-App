import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatTabsModule } from "@angular/material/tabs";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { ShSelectModule } from "../../../theme/ng-virtual-select/sh-select.module";

import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { InventorySidebarModule } from "../inventory-sidebar/inventory-sidebar.module";
import { CreateUpdateGroupComponent } from "./create-update-group.component";
import { GroupCreateEditRoutingModule } from "./create-update-group.routing.module";
import { MainGroupComponent } from "./main-group.component";

@NgModule({
    declarations: [
        MainGroupComponent,
        CreateUpdateGroupComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        FormFieldsModule,
        ReactiveFormsModule,
        GroupCreateEditRoutingModule,
        InventorySidebarModule,
        TranslateDirectiveModule,
        MatRadioModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTabsModule,
        HamburgerMenuModule,
        MatButtonModule,
        ShSelectModule
    ],
    exports: [
        CreateUpdateGroupComponent
    ]
})
export class GroupCreateEditModule {

}
