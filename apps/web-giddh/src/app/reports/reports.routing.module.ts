import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { NeedsAuthentication } from '../decorators/needsAuthentication';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { SalesRegisterExpandComponent } from './components/salesRegister-expand-component/sales.register.expand.component';
import { ReportsDashboardComponent } from "./components/report-dashboard/reports.dashboard.component";
import { SalesRegisterDetailsComponent } from './components/sales-register-details-component/sales.register.details.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                canActivate: [NeedsAuthentication],
                component: ReportsComponent,
                children: [
                    {path: '', redirectTo: 'reports-dashboard', pathMatch: 'full'},
                    {path: 'reports-details', component: ReportsDetailsComponent}, // working
                    {path: 'sales-detailed', component: SalesRegisterDetailsComponent},
                    {path: 'sales-detailed-expand', component: SalesRegisterExpandComponent},
                    {path: 'reports-dashboard', component: ReportsDashboardComponent}

                ]
            }
        ]),
    ],
    exports: [RouterModule]
})
export class ReportsRoutingModule {

}

