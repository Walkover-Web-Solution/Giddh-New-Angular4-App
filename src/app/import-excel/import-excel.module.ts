import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { ImportComponent } from './import-excel.component';
import { ImportExcelRoutingModule } from './import-excel.routing.module';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ImportComponent
  ],
  exports: [ImportComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ImportExcelRoutingModule
  ],
})
export class ImportExcelModule {
}
