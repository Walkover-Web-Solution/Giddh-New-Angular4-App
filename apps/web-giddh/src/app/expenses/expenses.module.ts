import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxUploaderModule } from 'ngx-uploader';

import { LedgerModule } from '../ledger/ledger.module';
import { SalesModule } from '../sales/sales.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import {
    ApprovePettyCashEntryConfirmDialogComponent,
} from './components/approve-petty-cash-entry-confirm-dialog/approve-petty-cash-entry-confirm-dialog.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses.routing.module';


@NgModule({
    declarations: [ExpensesComponent, PendingListComponent, RejectedListComponent, FilterListComponent, ExpenseDetailsComponent, ApprovePettyCashEntryConfirmDialogComponent],
    providers: [],
    imports: [CommonModule,
        ReactiveFormsModule,
        FormsModule,
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
        DatepickerWrapperModule,
        ElementViewChildModule, SalesModule
    ],
    exports: [
        ExpensesComponent,
        CurrencyModule
    ]
})
export class ExpensesModule {
}
