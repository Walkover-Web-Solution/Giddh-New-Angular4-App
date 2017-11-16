import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { LedgerDiscountComponent } from './components/ledgerDiscount/ledgerDiscount.component';

import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { ShareLedgerComponent } from './components/shareLedger/shareLedger.component';
import { ExportLedgerComponent } from './components/exportLedger/exportLedger.component';
import { UpdateLedgerTaxControlComponent } from './components/updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from './components/updateLedgerDiscount/updateLedgerDiscount.component';
// import { ElementViewContainerRef } from '../shared/helpers/pipes/element.viewchild.directive';
import { NgUploaderModule } from 'ngx-uploader/src/ngx-uploader/module/ngx-uploader.module';
import { ClipboardModule } from 'ngx-clipboard';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TaxControlModule } from '../theme/tax-control/tax-control.module';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { LaddaModule } from 'angular2-ladda';
import { ElementViewChildModule } from '../shared/helpers/directives/elementViewChild/elementViewChild.module';
import { TextMaskModule } from 'angular2-text-mask';
import { SelectModule } from '../theme/ng-select/ng-select';
import { NumberToWordsModule } from '../shared/helpers/pipes/numberToWords/numberToWords.module';
import { ConfirmModalModule } from '../theme/confirm-modal';
import { QuickAccountComponent } from './components/quickAccount/quickAccount.component';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ButtonsModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    LedgerComponent,
    NewLedgerEntryPanelComponent,
    LedgerDiscountComponent,
    UpdateLedgerEntryPanelComponent,
    ShareLedgerComponent,
    ExportLedgerComponent,
    UpdateLedgerTaxControlComponent,
    UpdateLedgerDiscountComponent,
    QuickAccountComponent,
    AdvanceSearchModelComponent
  ],
  exports: [
    LedgerComponent, UpdateLedgerEntryPanelComponent
  ],
  entryComponents: [UpdateLedgerEntryPanelComponent, QuickAccountComponent],
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
    NgUploaderModule,
    ClipboardModule,
    Daterangepicker,
    LaddaModule,
    ElementViewChildModule,
    TextMaskModule,
    SelectModule,
    NumberToWordsModule,
    ConfirmModalModule,
    ShSelectModule,
    DecimalDigitsModule,
    BsDatepickerModule,
    ButtonsModule,
    BsDropdownModule
  ],
})
export class LedgerModule {
}
