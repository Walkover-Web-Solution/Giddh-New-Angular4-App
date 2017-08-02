import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AboutRoutingModule } from './about.routing.module';
import { WebToPdfComponent } from './invoice.component';
import {WebToPdfRoutingModule} from './con.routing.module';

console.log('`About` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    WebToPdfComponent,
  ],
  exports: [WebToPdfComponent],
  imports: [
    CommonModule,
    FormsModule,
    WebToPdfRoutingModule
  ],
})
export class ConModule {
}
