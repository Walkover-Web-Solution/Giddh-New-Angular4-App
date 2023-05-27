import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import { MatLegacyTableModule as MatTableModule } from "@angular/material/legacy-table";
import { RouterModule } from "@angular/router";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { CustomFieldsCreateEditComponent } from "./create-edit/create-edit.component";
import { CustomFieldsRoutingModule } from "./custom-fields.routing.module";
import { CustomFieldsListComponent } from "./list/list.component";
import { MainComponent } from "./main.component";
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatCommonModule } from '@angular/material/core';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatLegacyTooltipModule as MatTooltipModule } from "@angular/material/legacy-tooltip";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule } from "@angular/forms";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NoDataModule } from "../shared/no-data/no-data.module";

@NgModule({
    declarations: [
        MainComponent,
        CustomFieldsListComponent,
        CustomFieldsCreateEditComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        CustomFieldsRoutingModule,
        HamburgerMenuModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatCommonModule,
        MatRadioModule,
        MatSelectModule,
        FormFieldsModule,
        MatTooltipModule,
        TranslateDirectiveModule,
        PaginationModule.forRoot(),
        FormsModule,
        GiddhPageLoaderModule,
        NoDataModule
    ]
})
export class CustomFieldsModule {

}