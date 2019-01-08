import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { DebitCreditNotesComponent } from 'app/debit-credit-notes/debit-credit-notes.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: DebitCreditNotesComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class DebitCreditNotesRoutingModule {
}
