import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatTableModule } from "@angular/material/table";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { DownloadsJsonComponent } from "./components/downloads-json/downloads-json.component";
import { DownloadsComponent } from "./components/downloads/downloads.component";
import { DownloadsRoutingModule } from "./downloads.routing.module";


@NgModule({
    declarations: [DownloadsComponent, DownloadsJsonComponent],
    exports: [],
    imports: [PaginationModule, MatTableModule, DownloadsRoutingModule, MatButtonModule, MatDialogModule]
})

export class DownloadsModule { }