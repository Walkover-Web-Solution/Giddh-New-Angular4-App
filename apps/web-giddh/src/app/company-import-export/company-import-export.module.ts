import { NgModule } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { CompanyImportExportComponent } from './company-import-export.component';
import { CompanyImportExportRoutingModule } from './company-import-export.routing.module';
import { CompanyImportExportFormComponent } from './component/form/company-import-export-form';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";
// import { SharedModule } from '../shared/shared.module';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
@NgModule({
    imports: [
        CompanyImportExportRoutingModule,
        FormsModule,
        CommonModule,
        Daterangepicker,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        // SharedModule,
        MatMenuModule,
        // // FormFieldsModule, // Temporarily disabled for compilation
    exports: [],
    declarations: [
        CompanyImportExportComponent,
        CompanyImportExportFormComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    providers: [],
})
export class CompanyImportExportModule {
}
