import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([{
      path: '', component: NewVsOldInvoicesComponent, canActivate: [NeedsAuthentication]
    }])
  ],
  exports: [RouterModule]
})

export class NewVsOldInvoicesRoutingModule {
}
