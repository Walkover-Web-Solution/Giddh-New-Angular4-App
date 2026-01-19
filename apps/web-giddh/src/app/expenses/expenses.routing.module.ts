import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpensesComponent } from './expenses.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: ExpensesComponent, canActivate: [NeedsAuthentication]
            },
            {
                path: ':type', component: ExpensesComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
/**
 * ExpensesRoutingModule module
 * Implements ExpensesRoutingModule functionality
 */
export class ExpensesRoutingModule {
}
