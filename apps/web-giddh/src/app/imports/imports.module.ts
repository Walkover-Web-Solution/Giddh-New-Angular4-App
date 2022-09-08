import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { HamburgerMenuModule } from "../shared/header/components/hamburger-menu/hamburger-menu.module";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { ShSelectModule } from "../theme/ng-virtual-select/sh-select.module";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { ImportsRoutingModule } from "./imports.routing.module";
import { ImportsComponent } from "./imports/imports.component";



@NgModule({
    declarations: [ImportsComponent],
    exports: [],
    imports: [CommonModule, FormsModule, PaginationModule.forRoot(), MatTableModule, ImportsRoutingModule, MatButtonModule, MatDialogModule, HamburgerMenuModule, TranslateDirectiveModule, NoDataModule,
        GiddhPageLoaderModule, ShSelectModule]
})

export class ImportsModule { }
