import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';
import { MfReportComponent } from './report/mf.report.component';
import { MfEditComponent } from './edit/mf.edit.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { DeleteManufacturingConfirmationModelComponent } from './edit/modal/confirmation.model.component';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { SelectModule } from '../theme/ng-select/ng-select';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';

@NgModule({
  declarations: [
    ManufacturingComponent,
    MfReportComponent,
    MfEditComponent,
    DeleteManufacturingConfirmationModelComponent
  ],
  exports: [RouterModule],
  providers: [],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ManufacturingRoutingModule,
    PaginationModule,
    DatepickerModule,
    BsDatepickerModule.forRoot(),
    ModalModule,
    LaddaModule,
    SelectModule,
    DecimalDigitsModule
  ],
})
export class ManufacturingModule {
}
