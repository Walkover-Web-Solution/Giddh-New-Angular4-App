import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { LaddaModule } from 'angular2-ladda';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, ModalModule, PaginationModule, TooltipModule } from 'ngx-bootstrap';
import { AsideMenuAccountInContactComponent } from './aside-menu-account/aside.menu.account.component';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    ContactComponent,
    AsideMenuAccountInContactComponent
  ],
  exports: [
    AsideMenuAccountInContactComponent
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
    ModalModule,
    PaginationModule
  ],
  providers: []
})
export class ContactModule {
}
