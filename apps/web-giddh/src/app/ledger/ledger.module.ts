import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizedEventModule } from 'angular-resize-event';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxUploaderModule } from 'ngx-uploader';
import { InventoryAddStockModule } from '../inventory/components/add-stock-components/inventory.addstock.module';

import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import {
    AccountAddNewDetailsModule,
} from '../shared/header/components/account-add-new-details/account-add-new-details.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { KeyboardShortutModule } from '../shared/helpers/directives/keyboardShortcut/keyboardShortut.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { NumberToWordsModule } from '../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ReplacePipeModule } from '../shared/helpers/pipes/replace/replace.module';
import { ValidateSectionPermissionDirectiveModule } from '../shared/validate-section-permission/validate-section-permission.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { SelectModule } from '../theme/ng-select/ng-select';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { NgxDaterangepickerMd } from '../theme/ngx-date-range-picker';
import { QuickAccountModule } from '../theme/quick-account-component/quickAccount.module';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { ExportLedgerComponent } from './components/exportLedger/exportLedger.component';
import { ImportStatementComponent } from './components/import-statement/import-statement.component';
import {
    LedgerColumnarReportTableComponent,
} from './components/ledger-columnar-report-table/ledger.columnar.report.table.component';
import {
    LedgerAsidePaneAccountComponent,
} from './components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component';
import { LedgerAsidePaneComponent } from './components/ledgerAsidePane/ledgerAsidePane.component';
import { LedgerDiscountModule } from './components/ledgerDiscount/ledgerDiscount.module';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { ShareLedgerComponent } from './components/shareLedger/shareLedger.component';
import { UpdateLedgerEntryPanelModule } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.module';
import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { ParticularPipeModule } from './pipes/particular/particular.module';

@NgModule({
    declarations: [
        LedgerComponent,
        NewLedgerEntryPanelComponent,
        ShareLedgerComponent,
        ExportLedgerComponent,
        AdvanceSearchModelComponent,
        LedgerAsidePaneComponent,
        LedgerAsidePaneAccountComponent,
        LedgerColumnarReportTableComponent,
        ImportStatementComponent
    ],
    exports: [
        LedgerComponent
    ],
    entryComponents: [PaginationComponent],
    providers: [],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        TaxControlModule,
        LedgerRoutingModule,
        ModalModule.forRoot(),
        TooltipModule,
        PaginationModule,
        NgxUploaderModule,
        ClipboardModule,
        Daterangepicker,
        LaddaModule,
        ElementViewChildModule,
        NumberToWordsModule,
        ConfirmModalModule,
        ShSelectModule,
        DecimalDigitsModule,
        DatepickerModule,
        ButtonsModule,
        BsDropdownModule,
        TextCaseChangeModule,
        ClickOutsideModule,
        QuickAccountModule,
        SelectModule.forRoot(),
        AngularResizedEventModule,
        NgxMaskModule.forRoot(),
        AdvanceReceiptAdjustmentModule,
        NgxDaterangepickerMd.forRoot(),
        AmountFieldComponentModule,
        TranslateDirectiveModule,
        AccountAddNewDetailsModule,
        KeyboardShortutModule,
        BsDatepickerModule,
        LedgerDiscountModule,
        UpdateLedgerEntryPanelModule,
        DatepickerWrapperModule,
        InventoryAddStockModule,
        ParticularPipeModule,
        ReplacePipeModule,
        HamburgerMenuModule,
        ValidateSectionPermissionDirectiveModule
    ],
})
export class LedgerModule {
}
