import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { HighchartsChartModule } from 'highcharts-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { GiddhCurrencyPipe } from '../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { SharedModule } from '../shared/shared.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { ComparisionChartComponent } from './components/comparision/comparision-chart.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { DatepickeroptionsComponent } from './components/datepickeroptions/datepickeroptions.component';
import { ExpensesChartComponent } from './components/expenses/expenses-chart.component';
import { gstComponent } from './components/gst/gst.component';
import { HistoryChartComponent } from './components/history/history-chart.component';
import { LiveAccountsComponent } from './components/live-accounts/live-accounts.component';
import { NetworthChartComponent } from './components/networth/networth-chart.component';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { RatioAnalysisChartComponent } from './components/ratio-analysis/ratio-analysis-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { TotalOverduesChartComponent } from './components/total-overdues/total-overdues-chart.component';
import { TotalSalesComponent } from './components/total-sales/total-sales.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { TranslateDirective } from '../theme/translate/translate.directive';

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
        DatepickeroptionsComponent,
        TranslateDirective
    ],
    exports: [HomeComponent],
    providers: [
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
        HighchartsChartModule,
        LaddaModule,
        PerfectScrollbarModule,
        BsDropdownModule,
        TabsModule,
        TooltipModule.forRoot(),
        Daterangepicker,
        CurrencyModule,
        SharedModule
    ],
})
export class HomeModule {
}
