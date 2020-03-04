import { CurrencyModule } from '../shared/helpers/pipes/currencyPipe/currencyType.module';
import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';

import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { ShareLedgerComponent } from './components/shareLedger/shareLedger.component';
import { ExportLedgerComponent } from './components/exportLedger/exportLedger.component';
import { UpdateLedgerTaxControlComponent } from './components/updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from './components/updateLedgerDiscount/updateLedgerDiscount.component';
import { AngularResizedEventModule } from 'angular-resize-event';
// import { ElementViewContainerRef } from '../shared/helpers/pipes/element.viewchild.directive';
import { NgxUploaderModule } from 'ngx-uploader';
import { ClipboardModule } from 'ngx-clipboard';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { TextMaskModule } from 'angular2-text-mask';
import { NumberToWordsModule } from '../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ButtonsModule, PaginationComponent } from 'ngx-bootstrap';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { ClickOutsideModule } from 'ng-click-outside';
import { QuickAccountModule } from 'apps/web-giddh/src/app/theme/quick-account-component/quickAccount.module';
import { LedgerAsidePaneComponent } from './components/ledgerAsidePane/ledgerAsidePane.component';
import { InventoryModule } from '../inventory/inventory.module';
import { LedgerAsidePaneAccountComponent } from './components/ledgerAsidePane/component/ledger-aside-pane-account/ledger-aside.pane.account.component';
import { SharedModule } from '../shared/shared.module';
import { SelectModule } from '../theme/ng-select/ng-select';
import { BaseAccountComponent } from './components/baseAccountModal/baseAccountModal.component';
import { SalesModule } from '../sales/sales.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask'
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { SettingsServiceModule } from '../settings/settings-service.module';
import { LedgerServiceModule } from './services/ledger.service.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        LedgerComponent,
        NewLedgerEntryPanelComponent,
        //LedgerDiscountComponent,
        UpdateLedgerEntryPanelComponent,
        ShareLedgerComponent,
        ExportLedgerComponent,
        UpdateLedgerTaxControlComponent,
        UpdateLedgerDiscountComponent,
        AdvanceSearchModelComponent,
        LedgerAsidePaneComponent,
        LedgerAsidePaneAccountComponent,
        BaseAccountComponent
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
        ModalModule,
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
        BsDatepickerModule,
        DatepickerModule,
        ButtonsModule,
        BsDropdownModule,
        TextCaseChangeModule,
        ClickOutsideModule,
        QuickAccountModule.forRoot(),
        InventoryModule,
        SharedModule,
        CurrencyModule,
        SelectModule.forRoot(),
        SalesModule,
        AngularResizedEventModule,
        NgxMaskModule.forRoot(),
        NgbTooltipModule,
        SettingsServiceModule,
        LedgerServiceModule
    ],
})
export class LedgerModule {
}
