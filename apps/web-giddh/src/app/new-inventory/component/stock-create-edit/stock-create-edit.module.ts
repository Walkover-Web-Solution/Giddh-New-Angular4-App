import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { HamburgerMenuModule } from "../../../shared/header/components/hamburger-menu/hamburger-menu.module";
// import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
// Temporarily disabled;
import { StockCreateEditComponent } from "./stock-create-edit.component";
import { StockCreateEditRoutingModule } from "./stock-create-edit.routing.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MainComponent } from "./main.component";
// import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { InventorySidebarModule } from "../inventory-sidebar/inventory-sidebar.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RecipeModule } from "../recipe/recipe.module";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { SortByModule } from "../../../shared/helpers/pipes/sort-by/sort-by.module";
import { WatchVideoModule } from "../../../theme/watch-video/watch-video.module";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { PageLeaveConfirmationGuard } from "../../../decorators/page-leave-confirmation-guard";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        MainComponent,
        StockCreateEditComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
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
        InventorySidebarModule,
        TranslateDirectiveModule,
        MatTooltipModule,
        RecipeModule,
        DragDropModule,
        MatSlideToggleModule,
        SortByModule,
        WatchVideoModule,
        MatProgressSpinnerModule
    
    ],
    exports: [
        StockCreateEditComponent
    ],
    providers: [
        PageLeaveConfirmationGuard
    
    ]
})
export class StockCreateEditModule {

}