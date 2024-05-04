import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateBranchTransferComponent } from "./create-branch-transfer/create-branch-transfer.component";
import { ListBranchTransferComponent } from "./list-branch-transfer/list-branch-transfer.component";
import { MainComponent } from "./main.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: ":type/create",
                component: CreateBranchTransferComponent,
                pathMatch: 'full'
            },
            {
                path: ":type/edit/:uniqueName",
                component: CreateBranchTransferComponent,
                pathMatch: 'full'
            },
            {
                path: "list",
                component: ListBranchTransferComponent
            },
        ]
    }
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BranchTransferRoutingModule {
}
