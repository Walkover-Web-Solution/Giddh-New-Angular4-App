import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

// import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
// import {
//     BalanceSheetGridComponent,
// } from './components/balance-sheet/components/balance-sheet-grid/balance-sheet-grid.component';
// import {
//     BalanceSheetGridRowComponent,
// } from './components/balance-sheet/components/balance-sheet-grid/components/balance-sheet-grid-row/balance-sheet-grid-row.component';
// import { BalanceSheetExportXlsComponent } from './components/export/balance-sheet/export-xls/export-xls.component';
// import { ProfitLossExportXlsComponent } from './components/export/profit-loss/export-xls/export-xls.component';
// import { TrialBalanceExportCsvComponent } from './components/export/trial-balance/export-csv/export-csv.component';
// import { TrialBalanceExportXlsComponent } from './components/export/trial-balance/export-xls/export-xls.component';
// import { FinancialReportsFilterComponent } from './components/filter/filter.component';
// import { GridRowComponent } from './components/grid-row/grid-row.component';
// import {
//     ProfitLossGridRowComponent,
// } from './components/profit-loss/components/profit-loss-grid/components/profit-loss-grid-row/profit-loss-grid-row.component';
// import { ProfitLossGridComponent } from './components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
// import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
// import {
//     TrialBalanceGridComponent,
// } from './components/trial-balance/components/trial-balance-grid/trial-balance-grid.component';
// import { TrialBalanceComponent } from './components/trial-balance/trial-balance.component';
// import { FinancialAccordionDirective } from './directives/financial-accordion.directive';
// import { AccountsFilterPipe } from './pipes/accounts-filter.pipe';

import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BalanceSheetReportComponent } from './balance-sheet/balance-sheet-report.component';
import { BalanceSheetReportGridComponent } from './balance-sheet/components/balance-sheet-grid/balance-sheet-report-grid.component';
import { BalanceSheetReportGridRowComponent } from './balance-sheet/components/balance-sheet-grid/components/balance-sheet-grid-row/balance-sheet-report-grid-row.component';
import { MultiCurrencyReportsComponent } from './multi-currency-reports.component';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { MultiCurrencyReportsRoutingModule } from './multi-currency-reports.routing.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { RecTypeModule } from '../shared/helpers/pipes/recType/recType.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
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
        ProfitLossReportGridRowComponent
       
        // GridRowComponent,
        // TrialBalanceComponent,
        // ProfitLossComponent,
        // ProfitLossGridComponent,
        // ProfitLossGridRowComponent,
        // ProfitLossExportXlsComponent,
        // TrialBalanceExportCsvComponent,
        // TrialBalanceExportXlsComponent,
        // BalanceSheetExportXlsComponent,
        // BalanceSheetComponent,
        // BalanceSheetGridComponent,
        // BalanceSheetGridRowComponent,
    ],
    exports: [
        MultiCurrencyReportsComponent, CurrencyModule
    ],
    providers: [],
    imports: [
        CommonModule,
        ModalModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
        Daterangepicker,
        MultiCurrencyReportsRoutingModule,
        TabsModule.forRoot(),
        LaddaModule.forRoot({
            style: 'slide-left',
            spinnerSize: 30
        }),
        HighlightModule,
        RecTypeModule,
        ShSelectModule,
        ClickOutsideModule,
        BsDropdownModule.forRoot(),
        CurrencyModule,
        TooltipModule.forRoot(),
        AccountDetailModalModule,
        ScrollingModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        GiddhPageLoaderModule,
        AmountFieldComponentModule,
        DatepickerWrapperModule,
        PopoverModule.forRoot(),
        AsideMenuAccountModule,
        MatTooltipModule,
        MatButtonModule,
        MatTableModule,
        MatFormFieldModule,
        MatSelectModule,
        FormFieldsModule,
        FinancialSearchPipe,
        MatTabsModule
        
    ],
})
export class MultiCurrencyReportsModule {
}
