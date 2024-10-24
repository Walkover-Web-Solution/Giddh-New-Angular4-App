import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { AboutGroupDetailComponent } from "./component/about-group-detail/about-group-detail.component";
import { AboutProductServiceDetailComponent } from "./component/about-product-service-detail/about-product-service-detail.component";
import { InventoryComboListComponent } from "./component/combo-list/inventory-combo-list.component";
import { AboutComboDetailComponent } from "./component/about-combo-detail/about-combo-detail.component";
import { CreateCustomFieldComponent } from "./component/create-custom-field/create-custom-field.component";
import { AdjustGroupComponent } from "./component/adjust-group/adjust-group.component";
import { AdjustProductServiceComponent } from "./component/adjust-product-service/adjust-product-service.component";
import { InventoryDashboardComponent } from "./component/inventory-dashboard/inventory-dashboard.component";
import { DashboardSellingReport } from "./component/inventory-dashboard/dashboard-selling-report/dashboard-selling-report.component";
import { ProductServiceListComponent } from "./component/inventory-product-service-list/inventory-product-service-list.component";
import { InventoryTransactionListComponent } from "./component/inventory-transaction-list/inventory-transaction-list.component";
import { ListGroupComponent } from "./component/stock-group/list-group/list-group.component";
import { StockBalanceComponent } from "./component/stock-balance/stock-balance.component";
import { ItemWiseComponent } from "./component/stock-group/item-wise/item-wise.component";
import { VariantWiseComponent } from "./component/variant-wise/variant-wise.component";
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
                path: "stock-group/list-group",
                component: ListGroupComponent,
            },
            {
                path: "inventory-product-service-list",
                component: ProductServiceListComponent,
            },
            {
                path: "inventory-combo-list",
                component: InventoryComboListComponent,
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
        path: "item-wise",
        component: ItemWiseComponent,
    },
    {
        path: "variant-wise",
        component: VariantWiseComponent,
    },
    {
        path: "about-group-detail",
        component: AboutGroupDetailComponent,

    },
    {
        path: "about-product-service-detail",
        component: AboutProductServiceDetailComponent,
    },
    {
        path: "inventory-combo-list",
        component: InventoryComboListComponent,
    },
    {
        path: "about-combo-detail",
        component: AboutComboDetailComponent,
    },
    {
        path: "create-custom-field",
        component: CreateCustomFieldComponent,
    },
    {
        path: "adjust-inventory-group",
        component: AdjustGroupComponent,
    },
    {
        path: "adjust-product-and-service",
        component: AdjustProductServiceComponent,
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
        path: "inventory-dashboard",
        component: InventoryDashboardComponent,
    },
    {
        path: "top-selling-report",
        component: DashboardSellingReport,
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
