import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { ProductServiceListComponent } from "./component/inventory-product-service-list/inventory-product-service-list.component";
import { InventoryTransactionListComponent } from "./component/inventory-transaction-list/inventory-transaction-list.component";
import { StockBalanceComponent } from "./component/stock-balance/stock-balance.component";
import { ReportsComponent } from "./component/reports/reports.component";
import { CustomUnitsComponent } from "./component/custom-units/custom-units.component"
import { InventoryMasterComponent } from "./component/inventory-master/inventory-master.component";
import { BulkStockEditComponent } from "./component/bulk-stock-edit/bulk-stock-edit.component";
import { AdjustInventoryListComponent } from "./component/adjust-inventory-list/adjust-inventory-list.component";
import { AdjustInventoryComponent } from "./component/adjust-inventory/adjust-inventory.component";

const routes: Routes = [
    {
        path: "", component: NewInventoryComponent,
        children: [
            { path: "", redirectTo: "product/master", pathMatch: "full" },
            {
                path: "inventory-product-service-list",
                component: ProductServiceListComponent,
            },
            {
                path: "reports/:type/transaction",
                component: InventoryTransactionListComponent,
            },
            {
                path: ":type/master",
                component: InventoryMasterComponent,
            },
            {
                path: "reports/:type/transaction/:uniqueName",
                component: InventoryTransactionListComponent,
            },
            {
                path: "reports/:type",
                component: ReportsComponent,
            },
            {
                path: "reports/:type/:reportType",
                component: ReportsComponent,
            },
            {
                path: "reports/:type/:reportType/:uniqueName",
                component: ReportsComponent,
            },
            {
                path: "custom-units",
                component: CustomUnitsComponent,
            },
            {
                path: ":type/bulk-stock-edit",
                component: BulkStockEditComponent
            },
            {
                path: ":type/adjust",
                component: AdjustInventoryListComponent,
            },
            {
                path: ":type/adjust/create",
                component: AdjustInventoryComponent
            },
            {
                path: ":type/adjust/:refNo",
                component: AdjustInventoryComponent
            },
        ],
    },
    {
        path: "stock",
        loadChildren: () => import('./component/stock-create-edit/stock-create-edit.module').then(module => module.StockCreateEditModule)
    },
    {
        path: "group",
        loadChildren: () => import('./component/create-update-group/create-update-group.module').then(module => module.GroupCreateEditModule)
    },
    {
        path: "recipe",
        loadChildren: () => import('./component/recipe/recipe.module').then(module => module.RecipeModule)
    },
    {
        path: "price",
        loadChildren: () => import('./component/custom-price/custom-price.module').then(module => module.CustomPriceModule)
    },
    {
        path: "manufacturing",
        loadChildren: () => import('./component/manufacturing/manufacturing.module').then(module => module.ManufacturingModule)
    },
    {
        path: "branch-transfer",
        loadChildren: () => import('./component/branch-transfer/branch-transfer.module').then(module => module.BranchTransferModule)
    },
    {
        path: "stock-balance",
        component: StockBalanceComponent,
    },
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NewInventoryRoutingModule {
}
