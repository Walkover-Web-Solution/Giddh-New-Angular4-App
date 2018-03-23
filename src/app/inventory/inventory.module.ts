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

import { DatepickerModule, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DatePickerCustomModule } from '../theme/datepicker/date-picker.module';
import { LaddaModule } from 'angular2-ladda';
import { DecimalDigitsModule } from '../shared/helpers/directives/decimalDigits/decimalDigits.module';
import { ShSelectModule } from '../theme/ng-virtual-select/sh-select.module';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap';
import { AsideCustomStockComponent } from 'app/inventory/components/aside-custom-stock.components/aside-custom-stock.component';
import { AsideInventoryComponent } from 'app/inventory/components/aside-inventory.components/aside-inventory.components';
import { Daterangepicker } from 'app/theme/ng2-daterangepicker/daterangepicker.module';
import { TextCaseChangeModule } from 'app/shared/helpers/directives/textCaseChange/textCaseChange.module';
import { InventoryGroupStockReportComponent } from './components/group-stock-report-component/group.stockreport.component';

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
    InventoryGroupStockReportComponent
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
    InventoryAddStockComponent
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
    TextCaseChangeModule
  ],
})
export class InventoryModule {
}
