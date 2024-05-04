import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LedgerComponent } from './ledger.component';
import { PageLeaveConfirmationGuard } from '../decorators/page-leave-confirmation-guard';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':accountUniqueName', component: LedgerComponent, canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: ':accountUniqueName/:from/:to', component: LedgerComponent, canDeactivate: [PageLeaveConfirmationGuard]
            },
            {
                path: '', redirectTo: '/pages/home', pathMatch: 'full'
            }
        ])
    ],
    exports: [RouterModule]
})
export class LedgerRoutingModule {
}
