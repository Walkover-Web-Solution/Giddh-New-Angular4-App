import { SharedModule } from './../shared/shared.module';
import { InventoryActions } from './actions/inventory.actions';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
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

console.log('`Inventory` bundle loaded asynchronously');

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
    StockListComponent
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
    StockListComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
    Ng2BootstrapModule.forRoot(),
    SharedModule,
  ],
})
export class InventoryModule {
}
