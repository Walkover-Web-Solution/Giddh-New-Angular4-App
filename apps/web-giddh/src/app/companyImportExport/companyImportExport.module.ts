import { NgModule } from '@angular/core';
import { CompanyImportExportComponent } from './companyImportExport.component';
import { CompanyImportExportRoutingModule } from './companyImportExport.routing.module';
import { TabsModule } from 'ngx-bootstrap';
import { CompanyImportExportFormComponent } from './component/form/company-import-export-form';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
    imports: [
        CompanyImportExportRoutingModule,
        TabsModule,
        ShSelectModule,
        FormsModule,
        CommonModule,
        Daterangepicker,
        LaddaModule
    ],
    exports: [],
    declarations: [
        CompanyImportExportComponent,
        CompanyImportExportFormComponent
    ],
    providers: [],
})
export class CompanyImportExportModule {
}
