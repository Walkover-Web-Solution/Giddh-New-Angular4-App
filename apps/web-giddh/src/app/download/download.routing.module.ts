import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DownloadComponent } from "./download.component";

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: DownloadComponent
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * DownloadRoutingModule module
 * Implements DownloadRoutingModule functionality
 */
export class DownloadRoutingModule {
}