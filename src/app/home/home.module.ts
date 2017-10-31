import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { LiveAccountsComponent } from './components/live-accounts/live-accounts.component';
import { ExpensesChartComponent } from './components/expenses/expenses-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { ComparisionChartComponent } from './components/comparision/comparision-chart.component';
import { HistoryChartComponent } from './components/history/history-chart.component';
import { NetworthChartComponent } from './components/networth/networth-chart.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { LaddaModule } from 'angular2-ladda';

export function highchartsFactory() {
  const hc = require('highcharts');
  const dd = require('highcharts/modules/drilldown');
  dd(hc);

  return hc;
}

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    HomeComponent,
    LiveAccountsComponent,
    ExpensesChartComponent,
    RevenueChartComponent,
    ComparisionChartComponent,
    HistoryChartComponent,
    NetworthChartComponent
  ],
  exports: [HomeComponent],
  providers: [
    {
      provide: HighchartsStatic,
      useFactory: highchartsFactory
    },
  ],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    ModalModule,
    ChartModule,
    LaddaModule
  ],
})
export class HomeModule {
}
