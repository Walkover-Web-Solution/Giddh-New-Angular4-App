import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MainComponent } from "./main.component";
import { BranchTransferListComponent } from "./branch-transfer-list/branch-transfer-list.component";
import { BranchTransferCreateComponent } from "./branch-transfer-create/branch-transfer-create.component";

const routes: Routes = [
    {
        path: "",
        component: MainComponent,
        children: [
            {
                path: "",
                redirectTo: 'list'
            },
            {
                path: "list",
                component: BranchTransferListComponent
            },
            {
                path: "create",
                component: BranchTransferCreateComponent
            }
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
