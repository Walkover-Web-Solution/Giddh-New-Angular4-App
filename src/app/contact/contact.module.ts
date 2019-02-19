import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { AgingDropdownComponent } from './aging-dropdown/aging.dropdown.component';
import { AgingReportComponent } from './../aging-report/aging-report.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LaddaModule } from 'angular2-ladda';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, ModalModule, PaginationComponent, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { AsideMenuAccountInContactComponent } from './aside-menu-account/aside.menu.account.component';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { AgingReportModule } from 'app/aging-report/aging-report.module';
import { Ng2OrderModule } from 'ng2-order-pipe'; // importing the module for table column sort

// const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
//   suppressScrollX: true
// };
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: false,
  suppressScrollY: true
};

@NgModule({
  declarations: [
    ContactComponent,
    AsideMenuAccountInContactComponent
  ],
  exports: [
    AsideMenuAccountInContactComponent, CurrencyModule
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ContactRoutingModule,
    LaddaModule,
    ShSelectModule,
    TabsModule,
    BsDropdownModule,
    TooltipModule,
    SharedModule,
    SelectModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule,
    PaginationModule,
    ClickOutsideModule,
    DigitsOnlyModule,
    ElementViewChildModule,
    CurrencyModule,
    Daterangepicker,
    AgingReportModule,
    Ng2OrderModule,
    PerfectScrollbarModule
  ],
  entryComponents: [
    PaginationComponent
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ContactModule {
}
