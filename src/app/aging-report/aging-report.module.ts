import { Daterangepicker } from 'app/theme/ng2-daterangepicker/daterangepicker.module';
import { CurrencyModule } from 'app/shared/helpers/pipes/currencyPipe/currencyType.module';
import { NgModule } from '@angular/core';
import { AgingDropdownComponent } from '../contact/aging-dropdown/aging.dropdown.component';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, ModalModule, PaginationComponent, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ClickOutsideModule } from 'ng-click-outside';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { AgingReportComponent } from './aging-report.component';
import { AgingReportRoutingModule } from './aging-report.routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; // importing the module
import { Ng2OrderModule } from 'ng2-order-pipe'; // importing the module for table column sort

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AgingDropdownComponent,
    AgingReportComponent
  ],
  exports: [
    AgingReportComponent,
    AgingDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgingReportRoutingModule,
    LaddaModule,
    ShSelectModule,
    TabsModule,
    BsDropdownModule,
    TooltipModule,
    SharedModule,
    SelectModule.forRoot(),
    ModalModule,
    PaginationModule,
    ClickOutsideModule,
    DigitsOnlyModule,
    ElementViewChildModule,
    CurrencyModule,
    Daterangepicker,
    Ng2SearchPipeModule,
    Ng2OrderModule
  ],
  entryComponents: [
    PaginationComponent
  ],
  providers: []
})
export class AgingReportModule {

}
