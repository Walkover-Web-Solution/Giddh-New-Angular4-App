import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTabsModule } from "@angular/material/tabs";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
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
        MatSlideToggleModule,
        GiddhPageLoaderModule
    ],
    exports: [
        CreateUpdateGroupComponent
    ]
})
export class GroupCreateEditModule {

}
