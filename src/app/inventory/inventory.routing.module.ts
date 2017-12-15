import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { InventoryAddGroupComponent } from './components/add-group-components/inventory.addgroup.component';
import { InventoryAddStockComponent } from './components/add-stock-components/inventory.addstock.component';
import { InventoryCustomStockComponent } from './components/custom-stock-components/inventory.customstock.component';
import { InventoryStockReportComponent } from './components/stock-report-component/inventory.stockreport.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '', component: InventoryComponent,
        children: [
          { path: '', pathMatch: 'full', component: InventoryAddStockComponent },
          { path: 'add-group', pathMatch: 'full', component: InventoryAddGroupComponent },
          { path: 'add-group/:groupUniqueName', pathMatch: 'full', component: InventoryAddGroupComponent, },
          { path: 'add-stock', pathMatch: 'full', component: InventoryAddStockComponent },
          { path: 'add-group/:groupUniqueName/add-stock/:stockUniqueName', component: InventoryAddStockComponent },
          { path: 'add-group/:groupUniqueName/stock-report/:stockUniqueName', component: InventoryStockReportComponent },
          { path: 'custom-stock', component: InventoryCustomStockComponent },
        ]
      }

    ])
  ],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
