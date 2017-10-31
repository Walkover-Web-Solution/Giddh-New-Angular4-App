import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserDetailsRoutingModule } from './userDetails.routing.module';
import { UserDetailsComponent } from './userDetails.component';
import { UiSwitchModule } from 'angular2-ui-switch';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    UserDetailsComponent
  ],
  exports: [
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserDetailsRoutingModule,
    TabsModule,
    AlertModule,
    UiSwitchModule,
    LaddaModule
  ],
})
export class UserDetailsModule {
}
