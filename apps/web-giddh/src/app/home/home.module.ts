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
import { TooltipModule } from 'ngx-bootstrap';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { LaddaModule } from 'angular2-ladda';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { RatioAnalysisChartComponent } from './components/ratio-analysis/ratio-analysis-chart.component';
import { TotalOverduesChartComponent } from './components/total-overdues/total-overdues-chart.component';
import { BsDropdownModule, TabsModule, BsDatepickerModule } from 'ngx-bootstrap';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { gstComponent } from './components/gst/gst.component';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { TotalSalesComponent } from './components/total-sales/total-sales.component';
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { SharedModule } from '../shared/shared.module';
import { DatepickeroptionsComponent } from './components/datepickeroptions/datepickeroptions.component';
import { CurrencyModule } from "../shared/helpers/pipes/currencyPipe/currencyType.module";
import { GiddhCurrencyPipe } from "../shared/helpers/pipes/currencyPipe/currencyType.pipe";

export function highchartsFactory() {
    // @ts-ignore
    const hc = require('highcharts');
    // @ts-ignore
    const dd = require('highcharts/modules/drilldown');
    dd(hc);

    return hc;
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: false,
    suppressScrollY: true
};

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        HomeComponent,
        LiveAccountsComponent,
        ExpensesChartComponent,
        RevenueChartComponent,
        ComparisionChartComponent,
        HistoryChartComponent,
        NetworthChartComponent,
        RatioAnalysisChartComponent,
        TotalOverduesChartComponent,
        ProfitLossComponent,
        gstComponent,
        BankAccountsComponent,
        CrDrComponent,
        TotalSalesComponent,
        DatepickeroptionsComponent
    ],
    exports: [HomeComponent],
    providers: [
        {
            provide: HighchartsStatic,
            useFactory: highchartsFactory
        },
        {
            provide: PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
        },
        GiddhCurrencyPipe
    ],
    imports: [
        CommonModule,
        FormsModule,
        HomeRoutingModule,
        ModalModule,
        ChartModule,
        LaddaModule,
        PerfectScrollbarModule,
        BsDropdownModule,
        TabsModule,
        BsDatepickerModule,
        TooltipModule.forRoot(),
        Daterangepicker,
        CurrencyModule,
        SharedModule
    ],
})
export class HomeModule {
}
