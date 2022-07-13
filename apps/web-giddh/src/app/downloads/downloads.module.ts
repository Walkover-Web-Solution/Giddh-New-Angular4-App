import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { DownloadsJsonComponent } from "./components/downloads-json/downloads-json.component";
import { DownloadsComponent } from "./components/downloads/downloads.component";
import { DownloadsRoutingModule } from "./downloads.routing.module";
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { CommonModule } from "@angular/common";
import { NoDataModule } from "../shared/no-data/no-data.module";
import { GiddhPageLoaderModule } from "../shared/giddh-page-loader/giddh-page-loader.module";
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [DownloadsComponent, DownloadsJsonComponent],
    exports: [],
    imports: [CommonModule, PaginationModule, MatTableModule, DownloadsRoutingModule, MatButtonModule, MatDialogModule, HamburgerMenuModule, TranslateDirectiveModule, NoDataModule,
        GiddhPageLoaderModule, SharedModule]
})

export class DownloadsModule { }