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
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { LedgerModule } from '../ledger/ledger.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { NgxUploaderModule } from 'ngx-uploader';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { SalesModule } from '../sales/sales.module';
import { ApprovePettyCashEntryConfirmDialogComponent } from './components/approve-petty-cash-entry-confirm-dialog/approve-petty-cash-entry-confirm-dialog.component';


@NgModule({
    declarations: [ExpensesComponent, PendingListComponent, RejectedListComponent, FilterListComponent, ExpenseDetailsComponent, ApprovePettyCashEntryConfirmDialogComponent],
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
        CurrencyModule,
        NgxUploaderModule,
        PaginationModule,
        SharedModule,
        ShSelectModule,
        ModalModule,
        ElementViewChildModule, SalesModule
    ],
    exports: [
        ExpensesComponent,
        CurrencyModule
    ]
})
export class ExpensesModule {
}
