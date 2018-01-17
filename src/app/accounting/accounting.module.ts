import { VsForDirective } from './../theme/ng2-vs-for/ng2-vs-for';
import { SharedModule } from './../shared/shared.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { JournalComponent } from './journal/journal.component';
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
import { SelectModule } from '../theme/ng-select/ng-select';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { KeyboardService } from 'app/accounting/keyboard.service';
import { ClickOutsideModule } from 'ng-click-outside';
import { AccountsSideBarComponent } from 'app/shared/header/components';
import { Daterangepicker } from 'app/theme/ng2-daterangepicker/daterangepicker.module';
import { AccountingSidebarComponent } from 'app/accounting/accouting-sidebar/accounting-sidebar.component';
import { AccountListComponent } from 'app/accounting/account-list/accounts-list.component';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AccountingComponent,
    JournalComponent,
    PurchaseComponent,
    AccountingSidebarComponent,
    AccountListComponent
  ],
  exports: [RouterModule, AccountingSidebarComponent],
  providers: [KeyboardService],
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
    SelectModule,
    DecimalDigitsModule,
    ShSelectModule,
    SharedModule,
    ClickOutsideModule,
    TooltipModule
    // Daterangepicker
  ],
})
export class AccountingModule {
}
