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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormFieldsModule } from "../theme/form-fields/form-fields.module";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { FormsModule } from "@angular/forms";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { WatchVideoModule } from "../theme/watch-video/watch-video.module";

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
        NoDataModule,
        MatSlideToggleModule,
        WatchVideoModule
    ]
})
export class CustomFieldsModule {

}