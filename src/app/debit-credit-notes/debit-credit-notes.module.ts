import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { DebitCreditNotesComponent } from './debit-credit-notes.component';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ShSelectModule } from 'app/theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from 'app/shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ModalModule, PaginationComponent, PaginationModule } from 'ngx-bootstrap';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { DebitCreditNotesRoutingModule } from './debit-credit-notes.routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
  declarations: [
    DebitCreditNotesComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DecimalDigitsModule,
    FormsModule,
    ModalModule,
    BsDatepickerModule,
    PaginationModule,
    DatepickerModule,
    Daterangepicker,
    ShSelectModule,
    TabsModule,
    ElementViewChildModule,
    DebitCreditNotesRoutingModule
  ],
  entryComponents: [
    PaginationComponent
  ]
})
export class DebitCreditNotesModule {
}
