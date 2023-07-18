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
                path: ":type/create",
                component: CreateUpdateGroupComponent,
                pathMatch: 'full'
            },
            {
                path: ":type/edit/:groupUniqueName",
                component: CreateUpdateGroupComponent,
                pathMatch: 'full'
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
