import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { LedgerDiscountComponent } from './components/ledgerDiscount/ledgerDiscount.component';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LedgerComponent,
    NewLedgerEntryPanelComponent,
    LedgerDiscountComponent
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
