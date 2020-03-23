import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { InventoryComponent } from "./inventory.component";
import { InventoryAddStockComponent } from "./components/add-stock-components/inventory.addstock.component";
import { InventoryCustomStockComponent } from "./components/custom-stock-components/inventory.customstock.component";
import { InventoryStockReportComponent } from "./components/stock-report-component/inventory.stockreport.component";
import { InventoryUpdateGroupComponent } from "./components/update-group-component/inventory.updategroup.component";
import { InventoryGroupStockReportComponent } from "./components/group-stock-report-component/group.stockreport.component";
import { InventoryWelcomeComponent } from "./components/welcome-inventory/welcome-inventory.component";
import { JobworkComponent } from "./jobwork/jobwork.component";

import { InvViewService } from "./inv.view.service";
import { ManufacturingComponent } from "./manufacturing/manufacturing.component";
import { NewBranchTransferListComponent } from "./components/new-branch-transfer/new.branch.transfer.list.component";
import { DashboardComponent} from "./components/dashboard-component/dashboard.component";
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                component: InventoryComponent,
                children: [
                    {
                        path: "add-group/:groupUniqueName",
                        pathMatch: "full",
                        component: InventoryUpdateGroupComponent
                    },
                    {
                        path: "add-group/:groupUniqueName/add-stock/:stockUniqueName",
                        component: InventoryAddStockComponent
                    },
                    {
                        path: "stock/:groupUniqueName/report/:stockUniqueName",
                        component: InventoryStockReportComponent
                    },
                    {
                        path: "group/:groupUniqueName/report",
                        component: InventoryGroupStockReportComponent
                    },
                    {
                        path: "custom-stock",
                        component: InventoryCustomStockComponent
                    },
                    {
                        path: "",
                        pathMatch: "full",
                        component: InventoryWelcomeComponent
                    },
                    {
                        path: "jobwork",
                        component: JobworkComponent
                    },
                    {
                        path: "jobwork/:type/:uniqueName",
                        component: JobworkComponent
                    },
                    {
                        path: "manufacturing",
                        component: ManufacturingComponent
                    },
                    {
                        path: "report",
                        component: NewBranchTransferListComponent
                    },

                    {
                        path: "dashboard",
                        component: DashboardComponent
                    }

                    
                ]
            }
        ])
    ],
    exports: [RouterModule],
    providers: [InvViewService]
})
export class InventoryRoutingModule { }
