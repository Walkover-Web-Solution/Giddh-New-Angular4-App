import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { InventoryRoutingModule } from './inventory.routing.module';
import { InventoryComponent } from './inventory.component';
import { InventoryHearderComponent } from './components/header-components/inventory-header-component';
import { InventorySidebarComponent } from './components/sidebar-components/inventory.sidebar.component';
import { InventoryAddGroupComponent } from './components/add-group-components/inventory.addgroup.component';
import { InventoryAddStockComponent } from './components/add-stock-components/inventory.addstock.component';
import { InventoryCustomStockComponent } from './components/custom-stock-components/inventory.customstock.component';
import { InventoryStockReportComponent } from './components/stock-report-component/inventory.stockreport.component';
import { StockgrpListComponent } from './components/sidebar-components/stockgrplist.component';
import { StockListComponent } from './components/sidebar-components/stockList.component';
import { InventoryUpdateGroupComponent } from './components/update-group-component/inventory.updategroup.component';

import { BsDatepickerModule, DatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';
import { BsDropdownModule, ModalModule, PaginationModule, PaginationComponent, TabsModule } from 'ngx-bootstrap';
import { AsideCustomStockComponent } from '../inventory/components/aside-custom-stock.components/aside-custom-stock.component';
import { AsideInventoryComponent } from '../inventory/components/aside-inventory.components/aside-inventory.components';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { InventoryGroupStockReportComponent } from './components/group-stock-report-component/group.stockreport.component';
import { InventoryWelcomeComponent } from './components/welcome-inventory/welcome-inventory.component';
import { BranchTransferComponent } from './components/branch/branchTransfer/branch.transfer.component';
import { BranchHeaderComponent } from './components/branch/branchHeader/branch.header.component';
import { JobworkComponent } from '../inventory/jobwork/jobwork.component';
import { JobworkWelcomeComponent } from '../inventory/jobwork/welcome-jobwork/welcome-jobwork.component';
import { AsidePaneComponent } from '../inventory/components/aside-pane/aside-pane.components';
import { AsideTransferPaneComponent } from '../inventory/components/aside-transfer-pane/aside-transfer-pane.component';
import { AsideBranchTransferPaneComponent } from '../inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { InOutStockListComponent } from './components/sidebar-components/in-out-stock-list.component';
import { InventoryUserComponent } from './components/forms/inventory-user/transfer-inventory-user.component';
import { TransferNoteComponent } from './components/forms/transfer-note/transfer-note.component';
import { BranchTransferNoteComponent } from './components/forms/branch-transfer/branch-transfer-note.component';
import { InwardNoteComponent } from './components/forms/inward-note/inward-note.component';
import { OutwardNoteComponent } from './components/forms/outward-note/outward-note.component';
import { JobworkSidebarComponent } from './jobwork/sidebar-components/jobwork.sidebar.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { ReceiptNoteComponent } from "./components/receipt-note-components/receipt.note.component";


@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    InventoryComponent,
    InventorySidebarComponent,
    InventoryAddGroupComponent,
    InventoryAddStockComponent,
    InventoryHearderComponent,
    InventoryCustomStockComponent,
    InventoryStockReportComponent,
    StockgrpListComponent,
    StockListComponent,
    AsideCustomStockComponent,
    AsideInventoryComponent,
    InventoryUpdateGroupComponent,
    InventoryGroupStockReportComponent,
    InventoryWelcomeComponent,
    BranchTransferComponent,
    BranchHeaderComponent,
    JobworkComponent,
    JobworkWelcomeComponent,
    AsidePaneComponent,
    AsideTransferPaneComponent,
    AsideBranchTransferPaneComponent,
    InOutStockListComponent,
    InventoryUserComponent,
    TransferNoteComponent,
    BranchTransferNoteComponent,
    InwardNoteComponent,
    OutwardNoteComponent,
    JobworkSidebarComponent,
    ManufacturingComponent,
    ReceiptNoteComponent
  ],
  exports: [
    InventoryComponent,
    InventorySidebarComponent,
    InventoryAddGroupComponent,
    InventoryAddStockComponent,
    InventoryHearderComponent,
    InventoryCustomStockComponent,
    InventoryStockReportComponent,
    StockgrpListComponent,
    StockListComponent,
    AsideCustomStockComponent,
    AsideInventoryComponent,
    InventoryUpdateGroupComponent,
    InventoryGroupStockReportComponent,
    InventoryWelcomeComponent,
    BranchTransferComponent,
    JobworkComponent,
    JobworkWelcomeComponent,
    AsidePaneComponent,
    AsideTransferPaneComponent,
    AsideBranchTransferPaneComponent,
    InOutStockListComponent,
    InventoryUserComponent,
    TransferNoteComponent,
    BranchTransferNoteComponent,
    InwardNoteComponent,
    OutwardNoteComponent,
    JobworkSidebarComponent,
    ManufacturingComponent,
    ReceiptNoteComponent,
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
    TooltipModule,
    DatepickerModule,
    LaddaModule,
    DecimalDigitsModule,
    ShSelectModule,
    SharedModule,
    ModalModule,
    Daterangepicker,
    TextCaseChangeModule,
    BsDropdownModule,
    BsDatepickerModule.forRoot(),
    PaginationModule,
    CurrencyModule,
    TabsModule,
    ClickOutsideModule
  ],
  entryComponents: [
    PaginationComponent
  ],
})
export class InventoryModule {
}
