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
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { StockCreateEditComponent } from "./stock-create-edit.component";
import { StockCreateEditRoutingModule } from "./stock-create-edit.routing.module";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MainComponent } from "./main.component";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";

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
        GiddhPageLoaderModule
    ],
    exports: [
        StockCreateEditComponent
    ]
})
export class StockCreateEditModule {

}