import { DownloadInBulkComponent } from './download-in-bulk.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'download', component: DownloadInBulkComponent,
            }
        ])
    ],
    exports: [RouterModule]
})
export class DownloadRoutingModule {
}
