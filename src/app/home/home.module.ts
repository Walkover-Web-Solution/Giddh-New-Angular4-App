import { HomeActions } from './actions/home.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';

console.log('`Home` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    HomeComponent
  ],
  exports: [HomeComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
  ],
})
export class HomeModule {
}
