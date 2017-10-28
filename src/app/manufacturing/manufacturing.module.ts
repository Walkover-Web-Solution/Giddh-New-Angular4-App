import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManufacturingComponent } from './manufacturing.component';
import { MfReportComponent } from './report/mf.report.component';
import { MfEditComponent } from './edit/mf.edit.component';
import { ManufacturingRoutingModule } from './manufacturing.routing.module';
import { DeleteManufacturingConfirmationModelComponent } from './edit/modal/confirmation.model.component';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
    ModalModule,
    SharedModule
  ],
})
export class ManufacturingModule {
}
