import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LedgerComponent } from './ledger.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: ':accountUniqueName', component: LedgerComponent
            },
            {
                path: ':accountUniqueName/:from/:to', component: LedgerComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class LedgerRoutingModule {
}
