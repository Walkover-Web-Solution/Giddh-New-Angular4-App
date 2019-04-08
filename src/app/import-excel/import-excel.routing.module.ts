import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import-excel.component';
import { ImportTypeSelectComponent } from './import-type-select/import-type-select.component';
import { ImportWizardComponent } from './import-wizard/import-wizard.component';
import { ImportReportComponent } from './import-report/import-report.component';
//import { importHistoryComponent } from './import-history/import-history.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: ImportComponent, children: [
          {path: '', redirectTo: 'select'},
          {path: 'select', component: ImportTypeSelectComponent},
          {path: 'group', component: ImportWizardComponent},
          {path: 'account', component: ImportWizardComponent},
          {path: 'entries', component: ImportWizardComponent},
          {path: 'trial-balance', component: ImportWizardComponent},
          {path: 'stock', component: ImportWizardComponent},
          {path: 'import-report', component: ImportReportComponent},
          //{path: 'import-history', component: importHistoryComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ImportExcelRoutingModule {
}
