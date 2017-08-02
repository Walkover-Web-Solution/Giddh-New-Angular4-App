import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';
import { MfReportComponent } from './report/mf.report.component';
import { MfEditComponent } from './edit/mf.edit.component';

@NgModule({
  declarations: [
    ManufacturingComponent,
    MfReportComponent,
    MfEditComponent
  ],
  exports: [RouterModule],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
})
export class ManufacturingModule {
}
