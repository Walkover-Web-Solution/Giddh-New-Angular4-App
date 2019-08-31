import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserDetailsRoutingModule } from './userDetails.routing.module';
import { UserDetailsComponent } from './userDetails.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LaddaModule } from 'angular2-ladda';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar/dist/lib/perfect-scrollbar.interfaces';
import { DurationModule } from '../shared/helpers/pipes/durationPipe/duration.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import {SharedModule} from "../shared/shared.module";
import {ElementViewChildModule} from "../shared/helpers/directives/elementViewChild/elementViewChild.module";
//import { ModalModule } from 'ngx-bootstrap';
import { SubscriptionsComponent } from './components/subscriptions/subscriptions.component';
import { UserDetailsPipe } from './userDetails.pipe';
import { UserDetailsCompanyComponent } from './components/company/user-details-company.component'
;import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SubscriptionsPlansComponent } from './components/subscriptions-plans/subscriptions-plans.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({

  declarations: [
    // Components / Directives/ Pipes
    UserDetailsComponent,
    SubscriptionsComponent,
    UserDetailsPipe,
    UserDetailsCompanyComponent,
    SubscriptionsPlansComponent
  ],
  exports: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserDetailsRoutingModule,
    TabsModule,
    AlertModule,
    LaddaModule,
    PerfectScrollbarModule,
    DurationModule,
    DecimalDigitsModule,
    SharedModule,
    ElementViewChildModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class UserDetailsModule {

}
