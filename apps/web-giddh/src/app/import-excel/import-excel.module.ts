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
import { UploadSuccessComponent } from './upload-success/upload-success.component';
import { ImportReportComponent } from './import-report/import-report.component';
import { SharedModule } from '../shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GiddhDatePipe } from '../shared/pipes/giddh-date.pipe';
import { GoToBranchComponent } from '../shared/go-to-branch/go-to-branch.component';

@NgModule({
    declarations: [
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
        ScrollingModule,
        SharedModule,
        WatchVideoModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatTooltipModule,
        FormFieldsModule,
        MatCheckboxModule,
        HamburgerMenuModule,
        GiddhDatePipe,
        GoToBranchComponent
    ],
})
export class ImportExcelModule {
}
