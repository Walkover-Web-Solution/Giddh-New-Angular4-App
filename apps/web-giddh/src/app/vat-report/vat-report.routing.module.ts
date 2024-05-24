import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VatReportComponent } from './vat-report.component';
import { VatReportTransactionsComponent } from './transactions/vat-report-transactions.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ObligationsComponent } from './obligations/obligations.component';
import { WithHeldSettingComponent } from './with-held-setting/with-held-setting.component';
import { LiabilityReportComponent } from './liability-report/liability-report.component';

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
            },
            {
                path: 'obligations',
                component: ObligationsComponent,
                canActivate: [NeedsAuthentication]
            },
            {
                path: 'with-held-setting',
                component: WithHeldSettingComponent,
                canActivate: [NeedsAuthentication]
            },
            {
                path: 'liability-report',
                component: LiabilityReportComponent,
                canActivate: [NeedsAuthentication]
            },
        ])
    ],
    exports: [RouterModule]
})
export class VatReportRoutingModule {
}
