import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyImportExportComponent } from './company-import-export.component';
import { CompanyImportExportRoutingModule } from './company-import-export.routing.module';
import { CompanyImportExportFormComponent } from './component/form/company-import-export-form';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
@NgModule({
    imports: [
        CompanyImportExportRoutingModule,
        FormsModule,
        CommonModule,
        Daterangepicker,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        SharedModule,
        MatMenuModule,
        FormFieldsModule,
        CompanyImportExportFormComponent, // Standalone component imported here
        HamburgerMenuModule
    ],
    exports: [],
    declarations: [
        CompanyImportExportComponent
        // CompanyImportExportFormComponent // Standalone component - should be imported instead
    ],
    providers: [],
})
export class CompanyImportExportModule {
}
