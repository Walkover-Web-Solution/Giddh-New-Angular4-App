import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyImportExportComponent } from './company-import-export.component';
import { CompanyImportExportRoutingModule } from './company-import-export.routing.module';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { SharedModule } from '../shared/shared.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { CompanyImportExportFormComponent } from './component/form/company-import-export-form';
/**
 * Handles NgModule functionality
 */
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
        HamburgerMenuModule
    ],
    exports: [],
    declarations: [
        CompanyImportExportComponent,
        CompanyImportExportFormComponent
    ],
    providers: [],
})
/**
 * CompanyImportExportModule module
 * Implements CompanyImportExportModule functionality
 */
export class CompanyImportExportModule {
}
