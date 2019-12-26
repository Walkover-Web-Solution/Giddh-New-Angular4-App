import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';


@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ExpensesComponent, canActivate: [NeedsAuthentication]
            },
            // {
            //   path: '', redirectTo: 'expenses-manager'
            // },
            // {
            //   path: 'expenses-manager', component: ExpensesComponent
            // }
            {
                path: ':type', component: ExpensesComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class ExpensesRoutingModule {
}
