import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { DownloadsRoutingModule } from "./downloads.routing.module";
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { CommonModule } from "@angular/common";
import { NoDataModule } from "../shared/no-data/no-data.module";
// import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
// import { SharedModule } from "../shared/shared.module";
import { ImportsComponent } from "./components/imports/imports.component";
import { ExportsComponent } from "./components/exports/exports.component";
import { ExportsJsonComponent } from "./components/exports-json/exports-json.component";
import { DownloadsComponent } from "./downloads.component";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatInputModule } from "@angular/material/input";
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";
// import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
// Temporarily disabled;

@NgModule({
    declarations: [
        DownloadsComponent,
        ExportsComponent,
        ExportsJsonComponent,
        ImportsComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    exports: [],
    imports: [
        CommonModule,
        MatPaginatorModule,
        MatTableModule,
        MatMenuModule,
        DownloadsRoutingModule,
        MatButtonModule,
        MatDialogModule,
        HamburgerMenuModule,
        TranslateDirectiveModule,
        NoDataModule,
        MatTabsModule,
        MatTooltipModule,
        MatInputModule
    
    ]
})

export class DownloadsModule { }