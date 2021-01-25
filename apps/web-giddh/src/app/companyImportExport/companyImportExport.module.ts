import { NgModule } from '@angular/core';
import { CompanyImportExportComponent } from './companyImportExport.component';
import { CompanyImportExportRoutingModule } from './companyImportExport.routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CompanyImportExportFormComponent } from './component/form/company-import-export-form';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from './../shared/shared.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { HamburgerMenuComponentModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
@NgModule({
    imports: [
        CompanyImportExportRoutingModule,
        TabsModule,
        ShSelectModule,
        FormsModule,
        CommonModule,
        Daterangepicker,
        LaddaModule,
        SharedModule,
        HamburgerMenuComponentModule,
        DatepickerWrapperModule
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
