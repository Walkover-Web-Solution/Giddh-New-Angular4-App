import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import-excel.component';
import { ImportTypeSelectComponent } from './import-type-select/import-type-select.component';
import { ImportWizardComponent } from './import-wizard/import-wizard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: ImportComponent, children: [
          {path: '', redirectTo: 'select'},
          {path: 'select', component: ImportTypeSelectComponent},
          {path: 'groups', component: ImportWizardComponent},
          {path: 'accounts', component: ImportWizardComponent},
          {path: 'trial-balance', component: ImportWizardComponent},
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ImportExcelRoutingModule {
}
