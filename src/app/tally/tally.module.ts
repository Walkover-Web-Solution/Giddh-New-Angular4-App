import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TallyComponent } from './tally.component';
import { TallyRoutingModule } from './tally.routing.module';
import { CurrentComponent } from './Components/Current/current.component';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
@NgModule({
  declarations: [
    TallyComponent,
    CurrentComponent
  ],
  imports: [
    CommonModule,
    TallyRoutingModule,
    TabsModule,
    FormsModule,
    BsDatepickerModule,
    DatepickerModule
  ],
  exports: [
  ],
  entryComponents: [],
  providers: []
})

export class TallyModule {
}
