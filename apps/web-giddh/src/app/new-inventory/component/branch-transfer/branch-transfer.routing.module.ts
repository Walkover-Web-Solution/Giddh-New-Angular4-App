import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateBranchTransfer } from "./create-branch-transfer/create-branch-transfer";
import { ListBranchTransfer } from "./list-branch-transfer/list-branch-transfer";
import { MainComponent } from "./main.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: ":type/create",
                component: CreateBranchTransfer,
                pathMatch: 'full'
            },
            {
                path: ":type/edit/:uniqueName",
                component: CreateBranchTransfer,
                pathMatch: 'full'
            },
            {
                path: "list",
                component: ListBranchTransfer
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
