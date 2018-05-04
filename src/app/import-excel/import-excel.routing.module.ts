import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportComponent } from './import-excel.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: ImportComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ImportExcelRoutingModule { }
