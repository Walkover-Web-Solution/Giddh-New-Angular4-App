import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses.routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { FilterDataComponent } from './components/filter-data/filter-data.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { RejectionReason } from './components/rejection-reason/rejection-reason.component';
import { LedgerModule } from '../ledger/ledger.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';


@NgModule({
  declarations: [ExpensesComponent, PendingListComponent, RejectedListComponent, FilterListComponent, ExpenseDetailsComponent, FilterDataComponent, RejectionReason],
  providers: [],
  imports: [CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BsDatepickerModule,
    DatepickerModule,
    Daterangepicker,
    ExpensesRoutingModule,
    TabsModule.forRoot(),
    LedgerModule,
    CurrencyModule
  ],
  exports: [
    ExpensesComponent,
    CurrencyModule
  ]
})
export class ExpensesModule {
}
