import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import-excel.component';
import { ImportTypeSelectComponent } from './import-type-select/import-type-select.component';
import { ImportWizardComponent } from './import-wizard/import-wizard.component';
import { ImportReportComponent } from './import-report/import-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ImportComponent, children: [
                    { path: '', redirectTo: 'select-type' },
                    { path: 'select-type', component: ImportTypeSelectComponent },
                    { path: ':type', component: ImportWizardComponent },
                    { path: 'report/import-report', component: ImportReportComponent }
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class ImportExcelRoutingModule {
}
