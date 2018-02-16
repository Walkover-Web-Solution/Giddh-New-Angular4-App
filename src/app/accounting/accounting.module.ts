import { TallyModuleService } from './tally-service';
import { AccountAsVoucherComponent } from './voucher-grid/voucher-grid.component';
import { VsForDirective } from './../theme/ng2-vs-for/ng2-vs-for';
import { SharedModule } from './../shared/shared.module';
import { AccountAsInvoiceComponent } from './invoice-grid/invoice-grid.component';
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { ShSelectModule } from './../theme/ng-virtual-select/sh-select.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, InjectionToken } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { KeyboardService } from 'app/accounting/keyboard.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AccountingSidebarComponent } from 'app/accounting/accouting-sidebar/accounting-sidebar.component';
import { AccountListComponent } from 'app/accounting/account-list/accounts-list.component';
import { TooltipModule, TypeaheadModule } from 'ngx-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';

@NgModule({
  declarations: [
    AccountingComponent,
    AccountAsInvoiceComponent,
    AccountingSidebarComponent,
    AccountListComponent,
    AccountAsVoucherComponent
  ],
  exports: [RouterModule, AccountingSidebarComponent],
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
    ShSelectModule,
    SharedModule,
    ClickOutsideModule,
    TooltipModule,
    TypeaheadModule,
    TextMaskModule
  ],
})
export class AccountingModule {
}
