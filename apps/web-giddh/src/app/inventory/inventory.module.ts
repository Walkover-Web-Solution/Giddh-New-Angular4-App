import { CurrencyModule } from "./../shared/helpers/pipes/currencyPipe/currencyType.module";
import { NgModule } from "@angular/core";
import { InventoryRoutingModule } from "./inventory.routing.module";
import { InventoryComponent } from "./inventory.component";
import { InventoryHearderComponent } from "./components/header-components/inventory-header-component";
import { InventorySidebarComponent } from "./components/sidebar-components/inventory.sidebar.component";
import { InventoryAddGroupComponent } from "./components/add-group-components/inventory.addgroup.component";
import { InventoryAddStockComponent } from "./components/add-stock-components/inventory.addstock.component";
import { InventoryCustomStockComponent } from "./components/custom-stock-components/inventory.customstock.component";
import { InventoryStockReportComponent } from "./components/stock-report-component/inventory.stockreport.component";
import { StockgrpListComponent } from "./components/sidebar-components/stockgrplist.component";
import { StockListComponent } from "./components/sidebar-components/stockList.component";
import { InventoryUpdateGroupComponent } from "./components/update-group-component/inventory.updategroup.component";

import { BsDatepickerModule } from "ngx-bootstrap/datepicker";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { SharedModule } from "../shared/shared.module";
import {
    BsDropdownModule,
    PaginationComponent,
    TabsModule
} from "ngx-bootstrap";
import { AsideCustomStockComponent } from "../inventory/components/aside-custom-stock.components/aside-custom-stock.component";
import { AsideInventoryComponent } from "../inventory/components/aside-inventory.components/aside-inventory.components";
import { Daterangepicker } from "../theme/ng2-daterangepicker/daterangepicker.module";
import { TextCaseChangeModule } from "../shared/helpers/directives/textCaseChange/textCaseChange.module";
import { InventoryGroupStockReportComponent } from "./components/group-stock-report-component/group.stockreport.component";
import { InventoryWelcomeComponent } from "./components/welcome-inventory/welcome-inventory.component";
import { BranchTransferComponent } from "./components/branch/branchTransfer/branch.transfer.component";
import { BranchHeaderComponent } from "./components/branch/branchHeader/branch.header.component";
import { JobworkComponent } from "../inventory/jobwork/jobwork.component";
import { JobworkWelcomeComponent } from "../inventory/jobwork/welcome-jobwork/welcome-jobwork.component";
import { AsidePaneComponent } from "../inventory/components/aside-pane/aside-pane.components";
import { AsideTransferPaneComponent } from "../inventory/components/aside-transfer-pane/aside-transfer-pane.component";
import { AsideBranchTransferPaneComponent } from "../inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component";
import { InOutStockListComponent } from "./components/sidebar-components/in-out-stock-list.component";
import { InventoryUserComponent } from "./components/forms/inventory-user/transfer-inventory-user.component";
import { TransferNoteComponent } from "./components/forms/transfer-note/transfer-note.component";
import { BranchTransferNoteComponent } from "./components/forms/branch-transfer/branch-transfer-note.component";
import { InwardNoteComponent } from "./components/forms/inward-note/inward-note.component";
import { OutwardNoteComponent } from "./components/forms/outward-note/outward-note.component";
import { JobworkSidebarComponent } from "./jobwork/sidebar-components/jobwork.sidebar.component";
import { ManufacturingComponent } from "./manufacturing/manufacturing.component";
import { NewBranchTransferAddComponent } from "./components/new-branch-transfer/new.branch.transfer.add.component";
import { AsideSenderReceiverDetailsPaneComponent } from "./components/aside-sender-receiver-details/aside-sender-receiver-details.component";
import { NewBranchTransferListComponent } from "./components/new-branch-transfer/new.branch.transfer.list.component";
import { ProformaInvoiceModule } from '../proforma-invoice/proforma-invoice.module';
import { DateFormatterPipe } from "./dateFormatter.pipe";
import { ReactiveFormsModule } from "@angular/forms";
import { DigitsOnlyModule } from "../shared/helpers/directives/digitsOnly/digitsOnly.module";
import { NgxMaskModule } from "../shared/helpers/directives/ngx-mask";
import { GiddRoundOffPipeModule } from '../shared/helpers/pipes/round-off/round-off.module';

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
        NewBranchTransferAddComponent,
        NewBranchTransferListComponent,
        AsideSenderReceiverDetailsPaneComponent,
        DateFormatterPipe
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
        NewBranchTransferAddComponent,
        NewBranchTransferListComponent
    ],
    providers: [],
    imports: [
        InventoryRoutingModule,
        TooltipModule,
        SharedModule,
        Daterangepicker,
        TextCaseChangeModule,
        BsDropdownModule,
        BsDatepickerModule.forRoot(),
        CurrencyModule,
        TabsModule,
        ReactiveFormsModule,
        DigitsOnlyModule,
        NgxMaskModule.forRoot(),
        ProformaInvoiceModule,
        GiddRoundOffPipeModule
    ],
    entryComponents: [PaginationComponent]
})
export class InventoryModule { }
