import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyCheckboxModule as MatCheckboxModule } from "@angular/material/legacy-checkbox";
import { MatLegacyChipsModule as MatChipsModule } from "@angular/material/legacy-chips";
import { MatIconModule } from "@angular/material/icon";
import { MatLegacyInputModule as MatInputModule } from "@angular/material/legacy-input";
import { MatLegacyMenuModule as MatMenuModule } from "@angular/material/legacy-menu";
import { MatLegacyRadioModule as MatRadioModule } from "@angular/material/legacy-radio";
import { MatLegacySelectModule as MatSelectModule } from "@angular/material/legacy-select";
import { MatSortModule } from "@angular/material/sort";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { MatLegacyTabsModule as MatTabsModule } from "@angular/material/legacy-tabs";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { StockCreateEditComponent } from "./stock-create-edit.component";
import { StockCreateEditRoutingModule } from "./stock-create-edit.routing.module";
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MainComponent } from "./main.component";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { InventorySidebarModule } from "../inventory-sidebar/inventory-sidebar.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { RecipeModule } from "../recipe/recipe.module";

@NgModule({
    declarations: [
        MainComponent,
        StockCreateEditComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        StockCreateEditRoutingModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        MatRadioModule,
        MatTabsModule,
        MatChipsModule,
        MatInputModule,
        MatSelectModule,
        HamburgerMenuModule,
        ReactiveFormsModule,
        FormFieldsModule,
        MatAutocompleteModule,
        GiddhPageLoaderModule,
        InventorySidebarModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        RecipeModule
    ],
    exports: [
        StockCreateEditComponent
    ]
})
export class StockCreateEditModule {

}
