import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { InventoryCreateGroupComponent } from "./component/create-group/create-group.component";
import { AboutGroupDetailComponent } from "./component/about-group-detail/about-group-detail.component";
import { AboutProductServiceDetailComponent } from "./component/about-product-service-detail/about-product-service-detail.component";
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
            }
        ])
    ]
})
export class NewInventoryRoutingModule { }
