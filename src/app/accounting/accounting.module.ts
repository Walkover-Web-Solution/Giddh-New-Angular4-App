import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { InventoryModule } from './../inventory/inventory.module';
import { TallyModuleService } from './tally-service';
import { AccountAsVoucherComponent } from './voucher-grid/voucher-grid.component';
import { SharedModule } from './../shared/shared.module';
import { AccountAsInvoiceComponent } from './invoice-grid/invoice-grid.component';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { KeyboardService } from 'app/accounting/keyboard.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AccountingSidebarComponent } from 'app/accounting/accouting-sidebar/accounting-sidebar.component';
import { TooltipModule, TypeaheadModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';
import { VirtualScrollModule } from '../theme/ng-virtual-select/virtual-scroll';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { QuickAccountModule } from '../theme/quick-account-component/quickAccount.module';
import { AVShSelectModule } from './ng-virtual-list/virtual-list.module';
import { OnReturnDirective } from './keyboard.directive';

@NgModule({
  declarations: [
    AccountingComponent,
    AccountAsInvoiceComponent,
    AccountingSidebarComponent,
    AccountAsVoucherComponent,
    OnReturnDirective
  ],
  exports: [RouterModule, AccountingSidebarComponent, CurrencyModule],
  providers: [KeyboardService, TallyModuleService],
  imports: [
    AccountingRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatepickerModule,
    BsDatepickerModule.forRoot(),
    ModalModule,
    LaddaModule,
    DecimalDigitsModule,
    AVShSelectModule,
    SharedModule,
    ClickOutsideModule,
    TooltipModule,
    TypeaheadModule,
    TextMaskModule,
    VirtualScrollModule,
    ElementViewChildModule,
    QuickAccountModule.forRoot(),
    InventoryModule,
    CurrencyModule
  ],
})
export class AccountingModule {
}
