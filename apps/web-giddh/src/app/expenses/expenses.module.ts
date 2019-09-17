import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses.routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PendingListComponen } from './components/pending-list/pending-list.component';
import { RejectedListComponen } from './components/rejected-list/rejected-list.component';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { FilterDataComponent } from './components/filter-data/filter-data.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { RejectionReason } from './components/rejection-reason/rejection-reason.component';


@NgModule({
  declarations: [ExpensesComponent,PendingListComponen, RejectedListComponen, FilterListComponent, ExpenseDetailsComponent, FilterDataComponent, RejectionReason],
  providers: [],
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule,
    DatepickerModule,
    Daterangepicker,
    ExpensesRoutingModule,
    TabsModule.forRoot()
  ],
  exports: [
    ExpensesComponent
  ]
})
export class ExpensesModule {
}
