import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AsideBranchTransferPaneComponent } from '../inventory/components/aside-branch-transfer-pane/aside-branch-transfer-pane.component';
import { AsideCustomStockComponent } from '../inventory/components/aside-custom-stock.components/aside-custom-stock.component';
import { AsideInventoryComponent } from '../inventory/components/aside-inventory.components/aside-inventory.components';
import { AsidePaneComponent } from '../inventory/components/aside-pane/aside-pane.components';
import { AsideTransferPaneComponent } from '../inventory/components/aside-transfer-pane/aside-transfer-pane.component';
import { JobworkComponent } from '../inventory/jobwork/jobwork.component';
import { JobworkWelcomeComponent } from '../inventory/jobwork/welcome-jobwork/welcome-jobwork.component';
import { ExceptionLogService } from '../services/exception-log.service';
import { DigitsOnlyModule } from '../shared/helpers/directives/digitsOnly/digitsOnly.module';
import { NgxMaskModule } from '../shared/helpers/directives/ngx-mask';
import { TextCaseChangeModule } from '../shared/helpers/directives/textCaseChange/textCaseChange.module';
import { GiddhRoundOffPipeModule } from '../shared/helpers/pipes/round-off/round-off.module';
import { SharedModule } from '../shared/shared.module';
import { ConfirmModalModule } from '../theme';
import { Daterangepicker } from '../theme/ng2-daterangepicker/daterangepicker.module';
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
import { AsideMenuProductServiceModule } from '../shared/aside-menu-product-service/aside-menu-product-service.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatExpansionModule } from '@angular/material/expansion';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { GiddhNumberFormatModule } from '../shared/helpers/pipes/number-format/number-format.module';

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
        MatButtonModule,
        InventoryRoutingModule,
        SharedModule,
        Daterangepicker,
        TextCaseChangeModule,
        GiddhNumberFormatModule,
        MatTabsModule,
        ReactiveFormsModule,
        DigitsOnlyModule,
        NgxMaskModule.forRoot(),
        GiddhRoundOffPipeModule,
        InventoryAddStockModule,
        ConfirmModalModule,
        ScrollingModule,
        AsideMenuProductServiceModule,
        FormFieldsModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatPaginatorModule,
        GiddhDatepickerModule,
        MatMenuModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatCheckboxModule,
        MatRadioModule,
        MatExpansionModule
    ]
})
export class InventoryModule { }
