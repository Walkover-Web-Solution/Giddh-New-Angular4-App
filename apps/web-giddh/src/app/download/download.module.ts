import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DownloadInBulkComponent } from './download-in-bulk.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DownloadRoutingModule } from './download.routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        DownloadRoutingModule,
        ModalModule,
        LaddaModule,
        ShSelectModule,
        SharedModule
    ],
    declarations: [DownloadInBulkComponent]
})
export class DownloadModule {
}
