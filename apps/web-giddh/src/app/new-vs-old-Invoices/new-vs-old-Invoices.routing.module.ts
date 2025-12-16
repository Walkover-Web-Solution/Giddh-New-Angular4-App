import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewVsOldInvoicesComponent } from './new-vs-old-Invoices.component';

@NgModule({
    imports: [
        RouterModule.forChild([{
            path: '', component: NewVsOldInvoicesComponent
        }])
    ],
    exports: [RouterModule]
})

export class NewVsOldInvoicesRoutingModule {
}
