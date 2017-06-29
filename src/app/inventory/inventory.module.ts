import { SharedModule } from './../shared/shared.module';
import { InventoryActions } from './actions/inventory.actions';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
    InventoryStockReportComponent
  ],
  exports: [
    InventoryComponent,
    InventorySidebarComponent,
    InventoryAddGroupComponent,
    InventoryAddStockComponent,
    InventoryHearderComponent,
    InventoryCustomStockComponent,
    InventoryStockReportComponent
  ],
  providers: [],
  imports: [
    CommonModule,
    FormsModule,
    InventoryRoutingModule,
    Ng2BootstrapModule.forRoot(),
    SharedModule,
  ],
})
export class InventoryModule {
}
