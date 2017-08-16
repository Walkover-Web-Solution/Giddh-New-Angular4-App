import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditInvoiceComponent } from './edit.invoice.component';
import { NeedsAuthentication } from '../../services/decorators/needsAuthentication';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: EditInvoiceComponent, canActivate: [NeedsAuthentication]
      }
    ])
  ],
  exports: [RouterModule]
})
export class EditInvoiceRoutingModule { }
