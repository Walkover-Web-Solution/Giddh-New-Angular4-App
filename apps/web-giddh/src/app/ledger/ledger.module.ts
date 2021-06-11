import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { LaddaModule } from 'angular2-ladda';
import { TextMaskModule } from 'angular2-text-mask';
import { QuickAccountModule } from 'apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxUploaderModule } from 'ngx-uploader';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesModule } from '../sales/sales.module';
import { SettingsServiceModule } from '../settings/settings-service.module';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { NumberToWordsModule } from '../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { ExportLedgerComponent } from './components/exportLedger/exportLedger.component';
import { LedgerColumnarReportTableComponent } from './components/ledger-columnar-report-table/ledger.columnar.report.table.component';
import { LedgerAsidePaneAccountComponent } from './components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component';
import { LedgerAsidePaneComponent } from './components/ledgerAsidePane/ledgerAsidePane.component';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { ShareLedgerComponent } from './components/shareLedger/shareLedger.component';
import { UpdateLedgerTaxControlComponent } from './components/updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from './components/updateLedgerDiscount/updateLedgerDiscount.component';
import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { ImportStatementComponent } from './components/import-statement/import-statement.component';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { AccountAddNewDetailsModule } from '../shared/header/components/account-add-new-details/account-add-new-details.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        LedgerComponent,
        NewLedgerEntryPanelComponent,
        UpdateLedgerEntryPanelComponent,
        ShareLedgerComponent,
        ExportLedgerComponent,
        UpdateLedgerTaxControlComponent,
        UpdateLedgerDiscountComponent,
        AdvanceSearchModelComponent,
        LedgerAsidePaneComponent,
        LedgerAsidePaneAccountComponent,
        LedgerColumnarReportTableComponent,
        ImportStatementComponent
    ],
    exports: [
        LedgerComponent, UpdateLedgerEntryPanelComponent
    ],
    entryComponents: [UpdateLedgerEntryPanelComponent, PaginationComponent],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TaxControlModule.forRoot(),
        LedgerRoutingModule,
        ModalModule.forRoot(),
        TooltipModule,
        PaginationModule,
        NgxUploaderModule,
        ClipboardModule,
        Daterangepicker,
        LaddaModule,
        ElementViewChildModule,
        TextMaskModule,
        NumberToWordsModule,
        ConfirmModalModule,
        ShSelectModule,
        DecimalDigitsModule,
        DatepickerModule,
        ButtonsModule,
        BsDropdownModule,
        TextCaseChangeModule,
        ClickOutsideModule,
        QuickAccountModule.forRoot(),
        InventoryModule,
        CurrencyModule,
        SelectModule.forRoot(),
        SalesModule,
        AngularResizedEventModule,
        NgxMaskModule.forRoot(),
        SettingsServiceModule,
        AdvanceReceiptAdjustmentModule,
        NgxDaterangepickerMd.forRoot(),
        AmountFieldComponentModule,
        TranslateDirectiveModule,
        AccountAddNewDetailsModule,
        KeyboardShortutModule,
        BsDatepickerModule
    ],
})
export class LedgerModule {
}
