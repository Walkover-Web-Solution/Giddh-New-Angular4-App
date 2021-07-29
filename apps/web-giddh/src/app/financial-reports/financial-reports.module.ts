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

import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { TbsearchPipe } from '../shared/header/pipe/tbsearch.pipe';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { HighlightModule } from '../shared/helpers/pipes/highlightPipe/highlight.module';
import { RecTypeModule } from '../shared/helpers/pipes/recType/recType.module';
import { SharedModule } from '../shared/shared.module';
import { AccountDetailModalModule } from '../theme/account-detail-modal/account-detail-modal.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { BalanceSheetComponent } from './components/balance-sheet/balance-sheet.component';
import {
    BalanceSheetGridComponent,
} from './components/balance-sheet/components/balance-sheet-grid/balance-sheet-grid.component';
import {
    BalanceSheetGridRowComponent,
} from './components/balance-sheet/components/balance-sheet-grid/components/balance-sheet-grid-row/balance-sheet-grid-row.component';
import { BalanceSheetExportXlsComponent } from './components/export/balance-sheet/export-xls/export-xls.component';
import { ProfitLossExportXlsComponent } from './components/export/profit-loss/export-xls/export-xls.component';
import { TrialBalanceExportCsvComponent } from './components/export/trial-balance/export-csv/export-csv.component';
import { TrialBalanceExportPdfComponent } from './components/export/trial-balance/export-pdf/export-pdf.component';
import { TrialBalanceExportXlsComponent } from './components/export/trial-balance/export-xls/export-xls.component';
import { TbPlBsFilterComponent } from './components/filter/filter.component';
import { GridRowComponent } from './components/grid-row/grid-row.component';
import {
    ProfitLossGridRowComponent,
} from './components/profit-loss/components/profit-loss-grid/components/profit-loss-grid-row/profit-loss-grid-row.component';
import { ProfitLossGridComponent } from './components/profit-loss/components/profit-loss-grid/profit-loss-grid.component';
import { ProfitLossComponent } from './components/profit-loss/profit-loss.component';
import {
    TrialBalanceGridComponent,
} from './components/trial-balance/components/trial-balance-grid/trial-balance-grid.component';
import { TbComponent } from './components/trial-balance/trial-balance.component';
import { TrialAccordionDirective } from './directives/trial-accordion.directive';
import { FinancialReportsComponent } from './financial-reports.component';
import { FinancialReportsRoutingModule } from './financial-reports.routing.module';
import { AccountsFilterPipe } from './pipes/accounts-filter.pipe';

@NgModule({
    declarations: [
        FinancialReportsComponent,
        TrialBalanceGridComponent,
        TbPlBsFilterComponent,
        GridRowComponent,
        TbComponent,
        ProfitLossComponent,
        ProfitLossGridComponent,
        ProfitLossGridRowComponent,
        ProfitLossExportXlsComponent,
        TrialBalanceExportCsvComponent,
        TrialBalanceExportPdfComponent,
        TrialBalanceExportXlsComponent,
        BalanceSheetExportXlsComponent,
        BalanceSheetComponent,
        BalanceSheetGridComponent,
        BalanceSheetGridRowComponent,
        TrialAccordionDirective,
        TbsearchPipe,
        AccountsFilterPipe
    ],
    exports: [
        FinancialReportsComponent, CurrencyModule
    ],
    providers: [],
    imports: [
        CommonModule,
        ModalModule,
        FormsModule,
        ReactiveFormsModule,
        Daterangepicker,
        FinancialReportsRoutingModule,
        TabsModule,
        LaddaModule,
        HighlightModule,
        RecTypeModule,
        ShSelectModule,
        ClickOutsideModule,
        BsDropdownModule,
        CurrencyModule,
        TooltipModule,
        AccountDetailModalModule,
        ScrollingModule,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        AmountFieldComponentModule,
        DatepickerWrapperModule,
        PopoverModule,
        SharedModule
    ],
})
export class FinancialReportsModule {
}
