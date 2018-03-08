import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DaybookRoutingModule } from './daybook.routing.module';
import { DaybookComponent } from './daybook.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { DaybookAdvanceSearchModelComponent } from 'app/daybook/advance-search/daybook-advance-search.component';
import { ShSelectModule } from 'app/theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from 'app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ModalModule, PaginationComponent, PaginationModule } from 'ngx-bootstrap';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { ExportDaybookComponent } from './export-daybook/export-daybook.component';

@NgModule({
  declarations: [DaybookComponent, ExportDaybookComponent, DaybookAdvanceSearchModelComponent],
  providers: [],
  imports: [CommonModule,
    ReactiveFormsModule, DecimalDigitsModule,
    FormsModule, ModalModule,
    BsDatepickerModule,
    PaginationModule,
    DatepickerModule,
    Daterangepicker,
    DaybookRoutingModule,
    ShSelectModule,
    ElementViewChildModule,
  ],
  entryComponents: [
    PaginationComponent
  ]
})
export class DaybookModule {
}
