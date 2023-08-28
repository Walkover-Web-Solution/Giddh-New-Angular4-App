import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VatReportComponent } from './vat-report.component';
import { VatReportTransactionsComponent } from './transactions/vat-report-transactions.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: VatReportComponent, children: [
                    {
                        path: "",
                        pathMatch: "full",
                        component: VatReportComponent
                    }
                ]
            },
            {
                path: 'transactions/section/:section',
                component: VatReportTransactionsComponent,
                canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class VatReportRoutingModule {
}
