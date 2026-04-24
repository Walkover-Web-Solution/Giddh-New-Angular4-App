import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { DownloadComponent } from "./download.component";
import { DownloadRoutingModule } from "./download.routing.module";
import { MatButtonModule } from "@angular/material/button";

@NgModule({
    declarations: [
        DownloadComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatButtonModule,
        TranslateDirectiveModule,
        DownloadRoutingModule
    ]
})

export class DownloadModule {

}