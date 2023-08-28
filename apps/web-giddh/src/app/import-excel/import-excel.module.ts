import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ImportComponent } from './import-excel.component';
import { ImportExcelRoutingModule } from './import-excel.routing.module';
import { ImportTypeSelectComponent } from './import-type-select/import-type-select.component';
import { ImportProcessComponent } from './import-process/import-process.component';
import { MapExcelDataComponent } from './map-excel-data/map-excel-data.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { ImportWizardComponent } from './import-wizard/import-wizard.component';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UploadSuccessComponent } from './upload-success/upload-success.component';
import { ImportReportComponent } from './import-report/import-report.component';
import { SharedModule } from '../shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        ImportComponent,
        ImportTypeSelectComponent,
        ImportProcessComponent,
        MapExcelDataComponent,
        UploadFileComponent,
        UploadSuccessComponent,
        ImportWizardComponent,
        ImportReportComponent
    ],
    exports: [ImportComponent],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ImportExcelRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        ShSelectModule,
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        ScrollingModule,
        PaginationModule.forRoot(),
        SharedModule
    ],
})
export class ImportExcelModule {
}
