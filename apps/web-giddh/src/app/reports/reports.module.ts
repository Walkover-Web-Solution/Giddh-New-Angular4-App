import { NgModule } from '@angular/core';
import { ReportsRoutingModule } from './reports.routing.module';
import { ReportsComponent } from './reports.component';
import { ReportsDetailsComponent } from './components/report-details-components/report.details.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CommonModule } from '@angular/common';
import { Options } from 'highcharts';
import { BsDropdownModule, DatepickerModule, } from 'ngx-bootstrap';

import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { ReportsGraphComponent } from './components/report-graph-component/report.graph.component';
import { ReportsTableComponent } from './components/report-table-components/report.table.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { ChartModule } from 'angular2-highcharts';
import { SalesRegisterComponent } from './components/sales-register-component/sales.register.component';
import { SalesRegisterExpandComponent } from './components/salesRegister-expand-component/sales.register.expand.component';
import { SalesRegisterDetailsComponent } from './components/sales-register-details-component/sales.register.details.component';
import { ReportsDashboardComponent } from './components/report-dashboard/reports.dashboard.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';


@NgModule({
  declarations: [
    ReportsComponent,
    ReportsDetailsComponent,
    ReportsGraphComponent,
    ReportsTableComponent,
    SalesRegisterComponent,
    SalesRegisterExpandComponent,
    SalesRegisterDetailsComponent,
    ReportsDashboardComponent
  ],
  exports: [
    ReportsComponent,
    ReportsDetailsComponent,
    DatepickerModule,
    BsDropdownModule,
    Daterangepicker,
    PaginationModule,
    
  ],
  providers: [],
  imports: [
    ReportsRoutingModule,
    // NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CommonModule,
    ChartModule,
    BsDropdownModule,
    PaginationModule
    
  ]
})

export class ReportsModule {

}
