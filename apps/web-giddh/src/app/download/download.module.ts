import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { TranslateDirectiveModule } from "../theme/translate/translate.directive.module";
import { DownloadComponent } from "./download.component";
import { DownloadRoutingModule } from "./download.routing.module";

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        DownloadComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        TranslateDirectiveModule,
        DownloadRoutingModule
    ]
})

/**
 * DownloadModule module
 * Implements DownloadModule functionality
 */
export class DownloadModule {

}