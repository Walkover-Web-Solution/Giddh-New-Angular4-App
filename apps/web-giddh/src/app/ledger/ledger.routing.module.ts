import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { LedgerGridComponent } from './components/ledger-grid/ledger-grid.component';
import { LedgerComponent } from './ledger.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: LedgerComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class LedgerRoutingModule {
}
