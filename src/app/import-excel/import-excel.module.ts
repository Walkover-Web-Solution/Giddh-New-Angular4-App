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
import { TooltipModule, BsDropdownModule } from 'ngx-bootstrap';
import { ClickOutsideModule } from 'ng-click-outside';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ImportComponent,
    ImportTypeSelectComponent,
    ImportProcessComponent,
    MapExcelDataComponent,
    UploadFileComponent,
    ImportWizardComponent
  ],
  exports: [ImportComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ImportExcelRoutingModule,
    LaddaModule,
    ShSelectModule,
    TooltipModule,
    BsDropdownModule
  ],
})
export class ImportExcelModule {
}
