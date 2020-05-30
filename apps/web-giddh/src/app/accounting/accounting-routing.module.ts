import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: JournalVoucherComponent, canActivate: [NeedsAuthentication],
            }
        ])
    ],
    exports: [RouterModule]
})
export class AccountingRoutingModule {
}
