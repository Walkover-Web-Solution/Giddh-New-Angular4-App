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
import { BsDropdownModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { UploadSuccessComponent } from './upload-success/upload-success.component';
import { ImportReportComponent } from './import-report/import-report.component';
import { SharedModule } from '../shared/shared.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
	suppressScrollX: true
};
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
	providers: [{
		provide: PERFECT_SCROLLBAR_CONFIG,
		useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
	}],
	imports: [
		CommonModule,
		FormsModule,
		ImportExcelRoutingModule,
		LaddaModule,
		ShSelectModule,
		TooltipModule,
		BsDropdownModule,
		PerfectScrollbarModule,
		PaginationModule,
		SharedModule
	],
})
export class ImportExcelModule {
}
