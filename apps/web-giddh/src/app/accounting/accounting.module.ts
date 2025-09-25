import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LaddaModule } from 'angular2-ladda';
import {
    AccountingSidebarComponent,
} from 'apps/web-giddh/src/app/accounting/accouting-sidebar/accounting-sidebar.component';
import { KeyboardService } from 'apps/web-giddh/src/app/accounting/keyboard.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { VirtualScrollModule } from '../theme/ng-virtual-select/virtual-scroll';
import { QuickAccountModule } from '../theme/quick-account-component/quickAccount.module';
import { InventoryModule } from './../inventory/inventory.module';
import { SharedModule } from './../shared/shared.module';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { InvoiceGridComponent } from './invoice-grid/invoice-grid.component';
import { AccountAsInvoiceComponent } from './journal-voucher/invoice/invoice.component';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';
import { ReceiptEntryModalComponent } from './journal-voucher/voucher/receipt-entry-modal/receipt-entry-modal.component';
import { AccountAsVoucherComponent } from './journal-voucher/voucher/voucher.component';
import { OnReturnDirective } from './keyboard.directive';
import { AVShSelectModule } from './ng-virtual-list/virtual-list.module';
import { TallyModuleService } from './tally-service';
import { VoucherGridComponent } from './voucher-grid/voucher-grid.component';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { A11yModule } from '@angular/cdk/a11y';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';

@NgModule({
    declarations: [
        JournalVoucherComponent,
        AccountAsInvoiceComponent,
        AccountingSidebarComponent,
        AccountAsVoucherComponent,
        OnReturnDirective,
        AccountingComponent, // TODO: Deprecated, remove it
        InvoiceGridComponent, // TODO: Deprecated, remove it
        VoucherGridComponent, // TODO: Deprecated, remove it
        ReceiptEntryModalComponent
    ],
    exports: [RouterModule, AccountingSidebarComponent],
    providers: [KeyboardService, TallyModuleService],
    imports: [
        AccountingRoutingModule,
        RouterModule,
        CommonModule,
        CurrencyModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        DecimalDigitsModule,
        AVShSelectModule,
        SharedModule,
        ClickOutsideModule,
        TooltipModule.forRoot(),
        TypeaheadModule.forRoot(),
        VirtualScrollModule,
        ElementViewChildModule,
        QuickAccountModule,
        InventoryModule,
        NgxMaskModule.forRoot(),
        FormsModule,
        FormFieldsModule,
        MatDialogModule,
        MatButtonModule,
        MatInputModule,
        A11yModule,
        GiddhDatepickerModule,
        KeyboardShortutModule
    ],
})
export class AccountingModule {
}
