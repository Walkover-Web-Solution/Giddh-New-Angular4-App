import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatLegacySlideToggleModule as MatSlideToggleModule } from "@angular/material/legacy-slide-toggle";
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
