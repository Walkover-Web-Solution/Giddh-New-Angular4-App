import { SharedModule } from './../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LedgerComponent,
  ],
  exports: [
    LedgerComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LedgerRoutingModule,
    SharedModule
  ],
})
export class LedgerModule {
}
