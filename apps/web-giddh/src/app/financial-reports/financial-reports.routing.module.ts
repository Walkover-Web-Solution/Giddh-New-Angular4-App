import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { FinancialReportsComponent } from './financial-reports.component';
import { MultiCurrencyReportComponent } from './multi-currency-report/multi-currency-report.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: FinancialReportsComponent, canActivate: [NeedsAuthentication]
            }
        ])
    ],
    exports: [RouterModule]
})
export class FinancialReportsRoutingModule {
}
