import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NeedsAuthentication } from "../decorators/needsAuthentication";
import { DownloadsComponent } from "./downloads.component";


/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: DownloadsComponent
            },
            {
                path: ':type',
                canActivate: [NeedsAuthentication],
                component: DownloadsComponent
            }
        ])
    ],
    exports: [RouterModule]
})

/**
 * DownloadsRoutingModule module
 * Implements DownloadsRoutingModule functionality
 */
export class DownloadsRoutingModule {

}