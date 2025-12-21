import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { CreateManufacturingComponent } from "./create-manufacturing/create-manufacturing.component";
import { ListManufacturingComponent } from "./list-manufacturing/list-manufacturing.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "create",
                component: CreateManufacturingComponent
            },
            {
                path: "edit/:uniqueName",
                component: CreateManufacturingComponent
            },
            {
                path: "list",
                component: ListManufacturingComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ManufacturingRoutingModule {
}
