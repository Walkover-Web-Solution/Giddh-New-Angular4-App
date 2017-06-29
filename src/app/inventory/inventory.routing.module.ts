import { PageComponent } from '../page.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { ChildHomeComponent } from './components';
import { NeedsAuthentication } from '../services/decorators/needsAuthentication';
import { InventoryAddGroupComponent } from './components/add-group-components/inventory.addgroup.component';
import { InventoryAddStockComponent } from './components/add-stock-components/inventory.addstock.component';
import { InventoryCustomStockComponent } from './components/custom-stock-components/inventory.customstock.component';
import { InventoryStockReportComponent } from "./components/stock-report-component/inventory.stockreport.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full', canActivate: [NeedsAuthentication] },
      {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
          {
            path: 'inventory', component: InventoryComponent, canActivate: [NeedsAuthentication],
            children: [
              { path: 'add-group', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication] },
              { path: 'add-group/:groupUniqueName', component: InventoryAddGroupComponent, canActivate: [NeedsAuthentication], },
              { path: 'add-group/:groupUniqueName/add-stock', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
              { path: 'add-group/:groupUniqueName/add-stock/:stockUniqueName', component: InventoryAddStockComponent, canActivate: [NeedsAuthentication] },
              { path: 'add-group/:groupUniqueName/stock-report/:stockUniqueName', component: InventoryStockReportComponent, canActivate: [NeedsAuthentication] },
              { path: 'custom-stock', component: InventoryCustomStockComponent, canActivate: [NeedsAuthentication] },
            ]
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
