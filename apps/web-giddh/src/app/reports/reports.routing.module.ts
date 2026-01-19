import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { SalesRegisterExpandComponent } from './components/sales-register-expand-component/sales.register.expand.component';
import { PurchaseRegisterComponent } from './components/purchase-register-component/purchase.register.component';
import { PurchaseRegisterExpandComponent } from './components/purchase-register-expand-component/purchase.register.expand.component';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component';
import { ColumnarReportComponent } from './components/columnar-report-component/columnar.report.component';
import { CashFlowStatementComponent } from './components/cash-flow-statement-component/cash.flow.statement.component';

/**
 * Handles NgModule functionality
 */
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ReportsComponent,
                children: [
                    { path: '', redirectTo: 'sales-register', pathMatch: 'full' },
                    { path: 'sales-register', component: ReportsDetailsComponent },
                    { path: 'sales-detailed-expand', component: SalesRegisterExpandComponent },
                    { path: 'purchase-register', component: PurchaseRegisterComponent },
                    { path: 'purchase-detailed-expand', component: PurchaseRegisterExpandComponent },
                    { path: 'reverse-charge', component: ReverseChargeReport },
                    { path: 'monthly-columnar-report', component: ColumnarReportComponent },
                    { path: 'cash-flow-statement', component: CashFlowStatementComponent }
                ]
            }
        ]),
    ],
    exports: [RouterModule]
})

/**
 * ReportsRoutingModule module
 * Implements ReportsRoutingModule functionality
 */
export class ReportsRoutingModule {

}
