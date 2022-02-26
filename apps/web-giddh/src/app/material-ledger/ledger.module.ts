import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularResizeEventModule } from 'angular-resize-event';
import { LaddaModule } from 'angular2-ladda';
import { ClickOutsideModule } from 'ng-click-outside';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationComponent, PaginationModule } from 'ngx-bootstrap/pagination';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxUploaderModule } from 'ngx-uploader';
import { InventoryAddStockModule } from '../inventory/components/add-stock-components/inventory.addstock.module';
import { AsideMenuSalesOtherTaxesModule } from '../sales/aside-menu-sales-other-taxes/aside-menu-sales-other-taxes.module';
import { AdvanceReceiptAdjustmentModule } from '../shared/advance-receipt-adjustment/advance-receipt-adjustment.module';
import { AmountFieldComponentModule } from '../shared/amount-field/amount-field.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { AccountAddNewDetailsModule } from '../shared/header/components/account-add-new-details/account-add-new-details.module';
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
import { ExportLedgerComponent } from './components/export-ledger/export-ledger.component';
import { ImportStatementComponent } from './components/import-statement/import-statement.component';
import { LedgerColumnarReportTableComponent } from './components/ledger-columnar-report-table/ledger-columnar-report-table.component';
import { LedgerAsidePaneAccountComponent } from './components/ledger-aside-pane/component/ledger-aside-pane-account/ledger-aside.pane.account.component';
import { LedgerAsidePaneComponent } from './components/ledger-aside-pane/ledger-aside-pane.component';
import { LedgerDiscountModule } from './components/ledger-discount/ledger-discount.module';
import { NewLedgerEntryPanelComponent } from './components/new-ledger-entry-panel/new-ledger-entry-panel.component';
import { ShareLedgerComponent } from './components/share-ledger/share-ledger.component';
import { UpdateLedgerEntryPanelModule } from './components/update-ledger-entry-panel/update-ledger-entry-panel.module';
import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { ParticularPipeModule } from './pipes/particular/particular.module';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ConfirmationModalModule } from '../common/confirmation-modal/confirmation-modal.module';
import { NoDataModule } from '../shared/no-data/no-data.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { NewConfirmModalModule } from '../theme/new-confirm-modal';
import { GenerateVoucherConfirmationModalComponent } from './components/generate-voucher-confirm-modal/generate-voucher-confirm-modal.component';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { NewConfirmationModalModule } from '../theme/new-confirmation-modal/confirmation-modal.module';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { AttachmentsModule } from '../theme/attachments/attachments.module';

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
        ImportStatementComponent,
        GenerateVoucherConfirmationModalComponent
    ],
    exports: [
        LedgerComponent
    ],
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
        BsDatepickerModule.forRoot(),
        ButtonsModule,
        BsDropdownModule,
        TextCaseChangeModule,
        ClickOutsideModule,
        QuickAccountModule,
        SelectModule.forRoot(),
        AngularResizeEventModule,
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
        AsideMenuSalesOtherTaxesModule,
        PopoverModule,
        ConfirmationModalModule,
        ValidateSectionPermissionDirectiveModule,
        NoDataModule,
        GiddhDatepickerModule,
        GiddhPageLoaderModule,
        MatInputModule,
        MatTooltipModule,
        MatSlideToggleModule,
        MatButtonModule,
        MatTableModule,
        MatCheckboxModule,
        MatDialogModule,
        MatRadioModule,
        MatMenuModule,
        NewConfirmModalModule,
        MatSelectModule,
        NewConfirmationModalModule,
        MatGridListModule,
        MatExpansionModule,
        AttachmentsModule
    ]
})
export class LedgerModule {
}
