import { NgModule } from '@angular/core';
import { AsideMenuAccountInContactComponent } from '../contact/aside-menu-account/aside.menu.account.component';
import { CommonModule } from '@angular/common';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, ModalModule, PaginationModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { CarriedOverSalesComponent } from './carried-over-sales.component';
import { CarriedOverSalesRoutingModule } from './carried-over-sales.routing.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    CarriedOverSalesComponent,
    AsideMenuAccountInContactComponent
  ],
  exports: [
    AsideMenuAccountInContactComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CarriedOverSalesRoutingModule,
    LaddaModule,
    ShSelectModule,
    TabsModule,
    BsDropdownModule,
    TooltipModule,
    SharedModule,
    SelectModule.forRoot(),
    ModalModule,
    PaginationModule
  ],
  providers: []
})

export class CarriedOverSalesModule {

}
