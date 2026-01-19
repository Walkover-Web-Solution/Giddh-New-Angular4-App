import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
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
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { BankIntegrationModule } from '../shared/bank-integration/bank-integration.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GiddhNumberFormatPipe } from '../shared/helpers/pipes/number-format/number-format.pipe';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';

/**
 * Handles NgModule functionality
 */
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
            GiddhNumberFormatPipe,
    ],
    imports: [
        CommonModule,
        FormsModule,
        HomeRoutingModule,
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),

        Daterangepicker,
        GiddhNumberFormatModule,
        SharedModule,
        MatCardModule,
        MatMenuModule,
        MatButtonModule,
        MatTableModule,
        GiddhDateRangepickerModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatDialogModule,
        BankIntegrationModule,
        MatTooltipModule,
        TranslateDirectiveModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
/**
 * HomeModule module
 * Implements HomeModule functionality
 */
export class HomeModule {
}
