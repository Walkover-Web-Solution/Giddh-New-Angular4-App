import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DownloadComponent } from "./download.component";

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
export class DownloadRoutingModule {
}