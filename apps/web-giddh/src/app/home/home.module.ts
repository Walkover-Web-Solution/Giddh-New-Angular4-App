import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { HighchartsChartModule } from 'highcharts-angular';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { GiddhCurrencyPipe } from '../shared/helpers/pipes/currencyPipe/currencyType.pipe';
import { SharedModule } from '../shared/shared.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { BankAccountsComponent } from './components/bank-accounts/bank-accounts.component';
import { CrDrComponent } from './components/cr-dr-list/cr-dr-list.component';
import { ProfitLossComponent } from './components/profit-loss/profile-loss.component';
import { RatioAnalysisChartComponent } from './components/ratio-analysis/ratio-analysis-chart.component';
import { RevenueChartComponent } from './components/revenue/revenue-chart.component';
import { TotalOverduesChartComponent } from './components/total-overdues/total-overdues-chart.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { GiddhDateRangepickerModule } from '../theme/giddh-daterangepicker/giddh-daterangepicker.module';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        HomeComponent,
        RevenueChartComponent,
        RatioAnalysisChartComponent,
        TotalOverduesChartComponent,
        ProfitLossComponent,
        BankAccountsComponent,
        CrDrComponent
    ],
    exports: [HomeComponent],
    providers: [
            GiddhCurrencyPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HomeRoutingModule,
        ModalModule,
        HighchartsChartModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        BsDropdownModule.forRoot(),
        TabsModule.forRoot(),
        TooltipModule.forRoot(),
        Daterangepicker,
        CurrencyModule,
        SharedModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        GiddhDateRangepickerModule,
        MatDatepickerModule,
        MatFormFieldModule
    ],
})
export class HomeModule {
}
