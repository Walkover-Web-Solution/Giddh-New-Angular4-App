import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { LedgerComponent } from './ledger.component';
import { LedgerRoutingModule } from './ledger.routing.module';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { LedgerDiscountComponent } from './components/ledgerDiscount/ledgerDiscount.component';

import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { ShareLedgerComponent } from './components/shareLedger/shareLedger.component';
import { ExportLedgerComponent } from './components/exportLedger/exportLedger.component';
import { UpdateLedgerTaxControlComponent } from './components/updateLedger-tax-control/updateLedger-tax-control.component';
import { UpdateLedgerDiscountComponent } from './components/updateLedgerDiscount/updateLedgerDiscount.component';
// import { ElementViewContainerRef } from '../shared/helpers/directives/element.viewchild.directive';
import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgUploaderModule } from 'ngx-uploader/src/ngx-uploader/module/ngx-uploader.module';
import { ClipboardModule } from 'ngx-clipboard';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule } from 'ngx-bootstrap/popover';
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
    // ElementViewContainerRef
  ],
  exports: [
    LedgerComponent, UpdateLedgerEntryPanelComponent
  ],
  entryComponents: [UpdateLedgerEntryPanelComponent],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LedgerRoutingModule,
    SharedModule,
    ModalModule,
    TooltipModule,
    PaginationModule,
    NgUploaderModule,
    ClipboardModule
  ],
})
export class LedgerModule {
}
