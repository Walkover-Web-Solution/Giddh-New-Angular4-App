import { JournalComponent } from './journal/journal.component';
import { PurchaseComponent } from './purchase/purchase.component';
import { AccountingComponent } from './accounting.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { MfEditComponent } from './edit/mf.edit.component';
import { MfReportComponent } from './report/mf.report.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: AccountingComponent, canActivate: [NeedsAuthentication],
        children: [
          { path: '', redirectTo: 'journal', pathMatch: 'full' },
          { path: 'journal', component: JournalComponent },
          { path: 'purchase', component: PurchaseComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
