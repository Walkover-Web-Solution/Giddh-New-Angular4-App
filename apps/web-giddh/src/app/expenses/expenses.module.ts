import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxUploaderModule } from 'ngx-uploader';
import { UpdateLedgerEntryPanelModule } from '../ledger/components/update-ledger-entry-panel/update-ledger-entry-panel.module';
import { LedgerModule } from '../ledger/ledger.module';
import { AsideMenuSalesOtherTaxesModule } from '../sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { SalesModule } from '../sales/sales.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { SharedModule } from '../shared/shared.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ApprovePettyCashEntryConfirmDialogComponent } from './components/approve-petty-cash-entry-confirm-dialog/approve-petty-cash-entry-confirm-dialog.component';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';
import { FilterListComponent } from './components/filter-list/filter-list.component';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { ExpensesComponent } from './expenses.component';
import { ExpensesRoutingModule } from './expenses.routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { LightboxModule } from 'ngx-lightbox';
import { RejectPettyCashEntryConfirmDialogComponent } from './components/reject-petty-cash-entry-confirm-dialog/reject-petty-cash-entry-confirm-dialog.component';

@NgModule({
    declarations: [
        ExpensesComponent,
        PendingListComponent,
        RejectedListComponent,
        FilterListComponent,
        ExpenseDetailsComponent,
        ApprovePettyCashEntryConfirmDialogComponent,
        RejectPettyCashEntryConfirmDialogComponent
    ],
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
        ElementViewChildModule,
        SalesModule,
        UpdateLedgerEntryPanelModule,
        NoDataModule,
        AsideMenuSalesOtherTaxesModule,
        MatTabsModule,
        MatTableModule,
        MatSortModule,
        MatButtonModule,
        MatDialogModule,
        MatListModule,
        MatDividerModule,
        MatInputModule,
        LightboxModule
    ],
    exports: [
        ExpensesComponent,
        CurrencyModule
    ]
})
export class ExpensesModule {
}
