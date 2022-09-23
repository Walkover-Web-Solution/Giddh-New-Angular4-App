import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AsideBranchTransferPaneComponent } from '../inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component';
import { AsideCustomStockComponent } from '../inventory/components/aside-custom-stock.components/aside-custom-stock.component';
import { AsideInventoryComponent } from '../inventory/components/aside-inventory.components/aside-inventory.components';
import { AsidePaneComponent } from '../inventory/components/aside-pane/aside-pane.components';
import { AsideTransferPaneComponent } from '../inventory/components/aside-transfer-pane/aside-transfer-pane.component';
import { JobworkComponent } from '../inventory/jobwork/jobwork.component';
import { JobworkWelcomeComponent } from '../inventory/jobwork/welcome-jobwork/welcome-jobwork.component';
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { ExceptionLogService } from '../services/exception-log.service';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { GiddhRoundOffPipeModule } from '../shared/helpers/pipes/round-off/round-off.module';
import { SharedModule } from '../shared/shared.module';
import { ConfirmModalModule } from '../theme';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
import { CurrencyModule } from './../shared/helpers/pipes/currencyPipe/currencyType.module';
import { InventoryAddGroupComponent } from './components/add-group-components/inventory.addgroup.component';
import { InventoryAddStockModule } from './components/add-stock-components/inventory.addstock.module';
import { InventoryCustomStockComponent } from './components/custom-stock-components/inventory.customstock.component';
import { InventoryUserComponent } from './components/forms/inventory-user/transfer-inventory-user.component';
import { InwardNoteComponent } from './components/forms/inward-note/inward-note.component';
import { OutwardNoteComponent } from './components/forms/outward-note/outward-note.component';
import { TransferNoteComponent } from './components/forms/transfer-note/transfer-note.component';
import { InventoryGroupStockReportComponent } from './components/group-stock-report-component/group.stockreport.component';
import { InventoryHearderComponent } from './components/header-components/inventory-header-component';
import { NewBranchTransferAddComponent } from './components/new-branch-transfer/new.branch.transfer.add.component';
import { NewBranchTransferListComponent } from './components/new-branch-transfer/new.branch.transfer.list.component';
import { InventorySidebarComponent } from './components/sidebar-components/inventory.sidebar.component';
import { StockgrpListComponent } from './components/sidebar-components/stockgrplist.component';
import { StockListComponent } from './components/sidebar-components/stockList.component';
import { InventoryStockReportComponent } from './components/stock-report-component/inventory.stockreport.component';
import { InventoryUpdateGroupComponent } from './components/update-group-component/inventory.updategroup.component';
import { InventoryWelcomeComponent } from './components/welcome-inventory/welcome-inventory.component';
import { DateFormatterPipe } from './dateFormatter.pipe';
import { InventoryComponent } from './inventory.component';
import { InventoryRoutingModule } from './inventory.routing.module';
import { JobworkSidebarComponent } from './jobwork/sidebar-components/jobwork.sidebar.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';
import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AsideMenuProductServiceModule } from '../shared/aside-menu-product-service/aside-menu-product-service.module';

@NgModule({
    declarations: [
        // Components / Directives/ Pipes
        InventoryComponent,
        InventorySidebarComponent,
        InventoryAddGroupComponent,
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
        JobworkComponent,
        JobworkWelcomeComponent,
        AsidePaneComponent,
        AsideTransferPaneComponent,
        AsideBranchTransferPaneComponent,
        InventoryUserComponent,
        TransferNoteComponent,
        InwardNoteComponent,
        OutwardNoteComponent,
        JobworkSidebarComponent,
        ManufacturingComponent,
        NewBranchTransferAddComponent,
        NewBranchTransferListComponent,
        DateFormatterPipe
    ],
    exports: [
        InventoryComponent,
        InventorySidebarComponent,
        InventoryAddGroupComponent,
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
        JobworkComponent,
        JobworkWelcomeComponent,
        AsidePaneComponent,
        AsideTransferPaneComponent,
        AsideBranchTransferPaneComponent,
        InventoryUserComponent,
        TransferNoteComponent,
        InwardNoteComponent,
        OutwardNoteComponent,
        JobworkSidebarComponent,
        ManufacturingComponent,
        NewBranchTransferAddComponent,
        NewBranchTransferListComponent,
        InventoryAddStockModule
    ],
    providers: [ExceptionLogService],
    imports: [
        InventoryRoutingModule,
        TooltipModule.forRoot(),
        SharedModule,
        Daterangepicker,
        TextCaseChangeModule,
        BsDropdownModule.forRoot(),
        CurrencyModule,
        TabsModule.forRoot(),
        ReactiveFormsModule,
        DigitsOnlyModule,
        NgxMaskModule.forRoot(),
        ProformaInvoiceModule,
        GiddhRoundOffPipeModule,
        InventoryAddStockModule,
        ConfirmModalModule,
        NgxBootstrapSwitchModule.forRoot(),
        PerfectScrollbarModule,
        AsideMenuProductServiceModule
    ],
    entryComponents: [PaginationComponent]
})
export class InventoryModule { }
