import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateUpdateGroupComponent } from "./create-update-group.component";
import { MainGroupComponent } from "./main-group.component";

const routes: Routes = [
    {
        path: "",
        component: MainGroupComponent,
        children: [
            {
                path: "product/create",
                component: CreateUpdateGroupComponent
            },
            {
                path: "service/create",
                component: CreateUpdateGroupComponent
            },
            {
                path: "fixedassets/create",
                component: CreateUpdateGroupComponent
            },
            {
                path: "product/edit/:groupUniqueName",
                component: CreateUpdateGroupComponent
            },
            {
                path: "service/edit/:groupUniqueName",
                component: CreateUpdateGroupComponent
            },
            {
                path: "fixedassets/edit/:groupUniqueName",
                component: CreateUpdateGroupComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class GroupCreateEditRoutingModule {
}
