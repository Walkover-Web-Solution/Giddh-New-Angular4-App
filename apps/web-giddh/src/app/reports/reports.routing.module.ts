import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { SalesRegisterComponent } from './components/sales-register-component/sales.register.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { SalesRegisterExpandComponent } from './components/salesRegister-expand-component/sales.register.expand.component';
import { ManufacturingComponent } from "../manufacturing/manufacturing.component";
import { MfReportComponent } from "../manufacturing/report/mf.report.component";
import { MfEditComponent } from "../manufacturing/edit/mf.edit.component";
import { ReportsDashboardComponent } from "./components/report-dashboard/reports.dashboard.component";
import { SalesRegisterDetailsComponent } from './components/sales-register-details-component/sales.register.details.component';
import { ReverseChargeReport } from './components/reverse-charge-report-component/reverse-charge-report.component'



@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ReportsComponent,
                children: [
                    { path: '', redirectTo: 'reports-dashboard', pathMatch: 'full' },
                    { path: 'reports-details', component: ReportsDetailsComponent }, // working
                    { path: 'sales-detailed', component: SalesRegisterDetailsComponent },
                    { path: 'sales-detailed-expand', component: SalesRegisterExpandComponent },
                    { path: 'reports-dashboard', component: ReportsDashboardComponent },
                    { path: 'reverse-charge', component: ReverseChargeReport }

                ]
            }
        ]),
    ],
    exports: [RouterModule]
})
export class ReportsRoutingModule {

}

