import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideModule } from 'ng-click-outside';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BalanceSheetReportComponent } from './balance-sheet/balance-sheet-report.component';
import { MultiCurrencyReportsComponent } from './multi-currency-reports.component';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { MultiCurrencyReportsRoutingModule } from './multi-currency-reports.routing.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { RecTypeModule } from '../shared/helpers/pipes/recType/recType.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { AsideMenuAccountModule } from '../shared/aside-menu-account/aside.menu.account.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { FinancialSearchPipe } from '../shared/header/pipe/financial-search.pipe';
import { FilterMultiCurrencyComponent } from './filter/filter-multi-currency.component';
import { AccountsFilterPipe } from './pipes/accounts-filter.pipe';
import { TrialBalanceReportComponent } from './trial-balance/trial-balance-report.component';
import { TrialBalanceReportGridComponent } from './trial-balance/components/trial-balance-grid/trial-balance-report-grid.component';
import { GridReportRowComponent } from './grid-row/grid-report-row.component';
import { ProfitLossReportComponent } from './profit-loss/profit-loss-report.component';
import { ProfitLossReportGridComponent } from './profit-loss/components/profit-loss-grid/profit-loss-report-grid.component';
import { ProfitLossReportGridRowComponent } from './profit-loss/components/profit-loss-grid/components/profit-loss-grid-row/profit-loss-report-grid-row.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { FinancialAccordionDirective } from './directives/financial-accordion.directive';
import { BalanceSheetReportGridComponent } from './balance-sheet/components/balance-sheet-grid/balance-sheet-report-grid.component';
import { BalanceSheetReportGridRowComponent } from './balance-sheet/components/balance-sheet-grid/components/balance-sheet-grid-row/balance-sheet-report-grid-row.component';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';

/**
 * Handles NgModule functionality
 */
@NgModule({
    declarations: [
        MultiCurrencyReportsComponent,
        BalanceSheetReportComponent,
        BalanceSheetReportGridComponent,
        BalanceSheetReportGridRowComponent,
        FilterMultiCurrencyComponent,
        AccountsFilterPipe,
        TrialBalanceReportComponent,
        TrialBalanceReportGridComponent,
        GridReportRowComponent,
        ProfitLossReportComponent,
        ProfitLossReportGridComponent,
        ProfitLossReportGridRowComponent,
        FinancialAccordionDirective
    ],
    exports: [
        MultiCurrencyReportsComponent, GiddhNumberFormatModule
    ],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        Daterangepicker,
        MultiCurrencyReportsRoutingModule,
        HighlightModule,
        RecTypeModule,
        ClickOutsideModule,
        GiddhNumberFormatModule,
        AccountDetailModalModule,
        ScrollingModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        DatepickerWrapperModule,
        AsideMenuAccountModule,
        MatTooltipModule,
        MatButtonModule,
        MatFormFieldModule,
        MatSelectModule,
        FinancialSearchPipe,
        MatInputModule,
        MatTabsModule,
        MatListModule,
        MatMenuModule,
        FormFieldsModule
    ],
})
/**
 * MultiCurrencyReportsModule module
 * Implements MultiCurrencyReportsModule functionality
 */
export class MultiCurrencyReportsModule {
}
