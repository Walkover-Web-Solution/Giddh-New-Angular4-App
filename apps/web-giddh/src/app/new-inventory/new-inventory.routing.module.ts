import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NewInventoryComponent } from "./new-inventory.component";
import { InventoryCreateGroupComponent } from "./component/create-group/create-group.component";

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
            }
        ])
    ]
})
export class NewInventoryRoutingModule { }
