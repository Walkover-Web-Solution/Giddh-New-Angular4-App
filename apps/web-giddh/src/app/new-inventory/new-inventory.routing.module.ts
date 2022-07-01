import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { InventoryCreateUpdateGroupComponent } from "./component/stock-group/create-update-group/create-update-group.component";
import { AboutGroupDetailComponent } from "./component/about-group-detail/about-group-detail.component";
import { AboutProductServiceDetailComponent } from "./component/about-product-service-detail/about-product-service-detail.component";
import { InventoryComboListComponent } from "./component/combo-list/inventory-combo-list.component";
import { AboutComboDetailComponent } from "./component/about-combo-detail/about-combo-detail.component";
import { CreateCustomFieldComponent } from "./component/create-custom-field/create-custom-field.component";
import { AdjustInventoryComponent } from "./component/adjust-inventory-list/adjust-inventory-list.component";
import { AdjustGroupComponent } from "./component/adjust-group/adjust-group.component";
import { AdjustProductServiceComponent } from "./component/adjust-product-service/adjust-product-service.component";
import { InventoryDashboardComponent } from "./component/inventory-dashboard/inventory-dashboard.component";
import { DashboardSellingReport } from "./component/inventory-dashboard/dashboard-selling-report/dashboard-selling-report.component";
import { ProductServiceListComponent } from "./component/inventory-product-service-list/inventory-product-service-list.component";
import { InventoryTransactionListComponent } from "./component/inventory-transaction-list/inventory-transaction-list.component";
import { InventoryCustomFieldComponent } from "./component/inventory-custom-field/inventory-custom-field.component";
import { ListGroupComponent } from "./component/stock-group/list-group/list-group.component";
import { StockCreateEditModule } from "./component/stock-create-edit/stock-create-edit.module";
import { StockBalanceComponent } from "./component/stock-balance/stock-balance.component";
import { GroupwiseComponent } from "./component/stock-group/group-wise/group-wise.component";
import { ItemWiseComponent } from "./component/stock-group/item-wise/item-wise.component";

const routes: Routes = [
    {
        path: "", component: NewInventoryComponent,
        children: [
            { path: "", redirectTo: "stock-group/list-group", pathMatch: "full" },

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
                path: "inventory-transaction-list",
                component: InventoryTransactionListComponent,
            },
            {
                path: "inventory-custom-field",
                component: InventoryCustomFieldComponent,
            },

        ],
    },
    {
        path: "group-wise",
        component: GroupwiseComponent,
    },
    {
        path: "item-wise",
        component: ItemWiseComponent,
    },
    {
        path: "stock-group/create",
        component: InventoryCreateUpdateGroupComponent,
    },
    {
        path: "stock-group/edit/:groupUniqueName",
        component: InventoryCreateUpdateGroupComponent,
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
        path: "adjust-inventory",
        component: AdjustInventoryComponent,
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
    }
];


@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes), StockCreateEditModule],
    exports: [RouterModule],
})
export class NewInventoryRoutingModule {
}
