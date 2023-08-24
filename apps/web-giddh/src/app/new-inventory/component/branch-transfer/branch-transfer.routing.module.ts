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
                path: ":type/create",
                component: BranchTransferCreateComponent,
                pathMatch: 'full'
            },
            {
                path: ":type/edit/:uniqueName",
                component: BranchTransferCreateComponent,
                pathMatch: 'full'
            },
            {
                path: "list",
                component: BranchTransferListComponent
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
