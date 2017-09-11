import { SharedModule } from '../shared/shared.module';
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

console.log('`Home` bundle loaded asynchronously');

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
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
  ],
})
export class HomeModule {
}
