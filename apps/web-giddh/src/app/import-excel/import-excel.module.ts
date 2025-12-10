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
// import { SharedModule } from '../shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { WatchVideoModule } from '../theme/watch-video/watch-video.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
// import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
// Temporarily disabled;
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TextFieldComponent } from "../theme/form-fields/text-field/text-field.component";
import { ReactiveDropdownFieldComponent } from "../theme/form-fields/reactive-dropdown-field/reactive-dropdown-field.component";
import { InputFieldComponent } from "../theme/form-fields/input-field/input-field.component";
import { AmountFieldComponent } from "../shared/amount-field/amount-field.component";

@NgModule({
    declarations: [
        ImportComponent,
        ImportTypeSelectComponent,
        ImportProcessComponent,
        MapExcelDataComponent,
        UploadFileComponent,
        UploadSuccessComponent,
        ImportWizardComponent,
        ImportReportComponent,
        TextFieldComponent, // Added since FormFieldsModule is disabled
        ReactiveDropdownFieldComponent, // Added since FormFieldsModule is disabled
        InputFieldComponent, // Added since FormFieldsModule is disabled
        AmountFieldComponent, // Added since FormFieldsModule is disabled
    
    ],
    exports: [
        ImportComponent
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ImportExcelRoutingModule,
        LaddaModule.forRoot({ style: 'slide-left',
        spinnerSize: 30
    
    ]
        }),
        ScrollingModule,
        // SharedModule,
        WatchVideoModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatTooltipModule,
                // FormFieldsModule, // Temporarily disabled for compilation
        MatCheckboxModule
    ],
})
export class ImportExcelModule {
}
