import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { InventoryCreateGroupComponent } from "./component/create-group/create-group.component";
import { AboutGroupDetailComponent } from "./component/about-group-detail/about-group-detail.component";
import { AboutProductServiceDetailComponent } from "./component/about-product-service-detail/about-product-service-detail.component";
import { InventoryComboListComponent } from "./component/combo-list/inventory-combo-list.component";
import { AboutComboDetailComponent } from "./component/about-combo-detail/about-combo-detail.component";
import { CreateCustomFieldComponent } from "./component/create-custom-field/create-custom-field.component";
import { AdjustInventoryComponent } from "./component/adjust-inventory-list/adjust-inventory-list.component";
import { AdjustGroupComponent } from "./component/adjust-group/adjust-group.component";
import { AdjustProductServiceComponent } from "./component/adjust-product-service/adjust-product-service.component";
import { CreateNewInventoryComponent } from "./component/create-new-inventory-component/create-new-inventory.component";
import { InventoryDashboardComponent } from "./component/inventory-dashboard/inventory-dashboard.component";
import { DashboardSellingReport } from "./component/inventory-dashboard/dashboard-selling-report/dashboard-selling-report.component";
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: "",
                component: NewInventoryComponent,
            },
            {
                path: "create-group",
                component: InventoryCreateGroupComponent,
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
                component: AboutComboDetailComponent
            },
            {
                path: "create-custom-field",
                component: CreateCustomFieldComponent
            },
            {
                path: "adjust-inventory",
                component: AdjustInventoryComponent
            },
            {
                path: "adjust-inventory-group",
                component: AdjustGroupComponent
            },
            {
                path: "adjust-product-and-service",
                component: AdjustProductServiceComponent
            },
            {
                path: "create-new-inventory",
                component: CreateNewInventoryComponent,
            },
            {
                path: "inventory-dashboard",
                component: InventoryDashboardComponent,
            },
            {
                path: "top-selling-report",
                component: DashboardSellingReport,
            }

        ])
    ],
    exports: [RouterModule]
})
export class NewInventoryRoutingModule { }
