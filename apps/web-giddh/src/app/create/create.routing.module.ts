import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateInvoiceComponent } from './components/invoice/invoice.component';
import { CreateInvoiceTemplateComponent } from './components/invoice/templates/template.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', redirectTo: 'invoice', pathMatch: 'full' },
            { path: 'invoice', component: CreateInvoiceComponent },
            { path: 'invoice/:templateId', component: CreateInvoiceTemplateComponent },
            { path: '**', redirectTo: 'invoice', pathMatch: 'full' }
        ])
    ],
    exports: [RouterModule]
})
export class CreateRoutingModule {
}
