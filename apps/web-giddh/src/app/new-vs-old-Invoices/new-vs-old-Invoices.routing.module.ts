import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([{
            path: '', component: NewVsOldInvoicesComponent
        }])
    ],
    exports: [RouterModule]
})

/**
 * NewVsOldInvoicesRoutingModule module
 * Implements NewVsOldInvoicesRoutingModule functionality
 */
export class NewVsOldInvoicesRoutingModule {
}
