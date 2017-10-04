import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { UserDetailsRoutingModule } from './userDetails.routing.module';
import { UserDetailsComponent } from './userDetails.component';

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
    SharedModule,
    UserDetailsRoutingModule
  ],
})
export class UserDetailsModule {
}
