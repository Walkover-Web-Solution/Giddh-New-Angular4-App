import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LaddaModule } from 'angular2-ladda';
import { PerfectScrollbarModule, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { ContactComponent } from './contact.component';
import { ContactRoutingModule } from './contact.routing.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    ContactComponent
  ],
  exports: [
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
    TooltipModule
  ],
  providers: [ ]
})
export class ContactModule {
}
