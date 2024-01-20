import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { VouchersListComponent } from "./list/list.component";
import { VouchersPreviewComponent } from "./preview/preview.component";
import { VouchersCreateComponent } from "./create/create.component";

const routes: Routes = [
    {
        path: "", 
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: "list",
                pathMatch: "full"
            },
            {
                path: ":type/list",
                component: VouchersListComponent
            },
            {
                path: ":type/preview/:uniqueName",
                component: VouchersPreviewComponent
            },
            {
                path: ":type/create",
                component: VouchersCreateComponent
            },
            {
                path: ":type/edit/:uniqueName",
                component: VouchersCreateComponent
            }
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VouchersRoutingModule {
}