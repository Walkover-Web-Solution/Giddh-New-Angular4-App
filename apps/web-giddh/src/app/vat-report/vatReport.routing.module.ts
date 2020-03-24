import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VatReportComponent } from './vatReport.component';
import { VatReportTransactionsComponent } from './transactions/vatReportTransactions.component';
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
