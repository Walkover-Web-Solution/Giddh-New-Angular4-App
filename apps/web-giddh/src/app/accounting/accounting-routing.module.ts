import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { JournalVoucherComponent } from './journal-voucher/journal-voucher.component';

/**
 * Handles NgModule functionality
 */
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
/**
 * AccountingRoutingModule module
 * Implements AccountingRoutingModule functionality
 */
export class AccountingRoutingModule {
}
